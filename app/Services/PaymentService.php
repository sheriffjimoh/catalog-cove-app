<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\StripeClient;
use App\Models\Business;
use App\Models\PlanPricing;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected $stripe;

    public function __construct()
    {
        $secret = config('services.stripe.secret');
        Stripe::setApiKey($secret);
        $this->stripe = new StripeClient($secret);
    }

    public function createStripeCheckoutSession(
        Business $business,
        PlanPricing $pricing,
        string $interval)
    {
        $session = Session::create([
            'mode' => 'subscription',
            'payment_method_types' => ['card'],
            'customer_email' => $business->owner->email,
            'line_items' => [
                [
                    'price' => $pricing->stripe_price_id,
                    'quantity' => 1,
                ],
            ],
            'metadata' => [
                'business_id' => $business->id,
                'plan_id' => $pricing->plan_id,
                'interval' => $interval,
                'currency' => $pricing->currency,
            ],
            'success_url' => route('stripe.callback') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('billing.cancel'),
        ]);

        return $session;
    }

    public function createPaystackTransaction($plan, $pricing, $interval, $currency, $user)
    {
        $business = $user->business;
        $amount = ($interval === 'yearly' ? $pricing->yearly_price : $pricing->monthly_price) * 100;
        $reference = 'PSK-' . uniqid();

        // Get the correct Paystack plan code for the interval
        $paystackPlanCode = $interval === 'yearly'
            ? $pricing->paystack_yearly_plan_code
            : ($pricing->paystack_monthly_plan_code ?? $pricing->paystack_plan_code);

        $callbackUrl = route('paystack.callback') . '?' . http_build_query([
            'plan_id' => $plan->id,
            'interval' => $interval,
            'business_id' => $business->id,
            'currency' => $currency,
        ]);

        $payload = [
            'email' => $user->email,
            'amount' => $amount,
            'reference' => $reference,
            'currency' => $currency,
            'callback_url' => $callbackUrl,
        ];

        // Include plan code so Paystack creates a subscription (recurring billing)
        if ($paystackPlanCode) {
            $payload['plan'] = $paystackPlanCode;
        }

        $ch = curl_init('https://api.paystack.co/transaction/initialize');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . env('PAYSTACK_SECRET'),
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    public function verifyPaystackTransaction(string $reference): ?array
    {
        $ch = curl_init('https://api.paystack.co/transaction/verify/' . rawurlencode($reference));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . env('PAYSTACK_SECRET'),
        ]);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        if ($data && $data['status'] === true && $data['data']['status'] === 'success') {
            return $data['data'];
        }

        return null;
    }

    public function verifyStripeSession(string $sessionId): ?object
    {
        try {
            $session = $this->stripe->checkout->sessions->retrieve($sessionId, [
                'expand' => ['subscription'],
            ]);

            if ($session->payment_status === 'paid') {
                return $session;
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Create a Stripe Billing Portal session for updating payment method.
     */
    public function createStripeBillingPortal(string $customerId, string $returnUrl): ?string
    {
        try {
            $session = $this->stripe->billingPortal->sessions->create([
                'customer' => $customerId,
                'return_url' => $returnUrl,
            ]);

            return $session->url;
        } catch (\Exception $e) {
            \Log::error('Stripe Billing Portal error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get Paystack subscription management link for updating card.
     */
    public function getPaystackSubscriptionManageLink(string $subscriptionCode): ?string
    {
        $ch = curl_init('https://api.paystack.co/subscription/' . rawurlencode($subscriptionCode) . '/manage/link');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . env('PAYSTACK_SECRET'),
        ]);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        if ($data && $data['status'] === true && isset($data['data']['link'])) {
            return $data['data']['link'];
        }

        Log::error('Paystack manage link error', ['response' => $data]);
        return null;
    }

    /**
     * Get the active subscription code for a Paystack customer by fetching customer details.
     */
    public function getPaystackCustomerActiveSubscription(string $customerCode): ?string
    {
        // Fetch customer details — subscriptions are embedded in the response
        $ch = curl_init('https://api.paystack.co/customer/' . rawurlencode($customerCode));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . env('PAYSTACK_SECRET'),
        ]);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        if ($data && $data['status'] === true && !empty($data['data']['subscriptions'])) {
            $subscriptions = $data['data']['subscriptions'];

            // Find the first active/non-cancelled subscription
            foreach ($subscriptions as $sub) {
                if (isset($sub['subscription_code']) && ($sub['status'] ?? '') !== 'cancelled') {
                    Log::info('Found Paystack subscription via customer', [
                        'subscription_code' => $sub['subscription_code'],
                        'status' => $sub['status'] ?? 'unknown',
                    ]);
                    return $sub['subscription_code'];
                }
            }

            // If all are cancelled, return the most recent one anyway
            $last = end($subscriptions);
            if (isset($last['subscription_code'])) {
                return $last['subscription_code'];
            }
        }

        Log::info('No Paystack subscriptions found for customer', [
            'customer' => $customerCode,
            'subscriptions_count' => count($data['data']['subscriptions'] ?? []),
        ]);
        return null;
    }

    /**
     * Create a Paystack subscription for a customer on a plan.
     */
    public function createPaystackSubscription(string $customerCode, string $planCode): ?string
    {
        $payload = [
            'customer' => $customerCode,
            'plan' => $planCode,
        ];

        $ch = curl_init('https://api.paystack.co/subscription');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . env('PAYSTACK_SECRET'),
            'Content-Type: application/json',
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        if ($data && $data['status'] === true && isset($data['data']['subscription_code'])) {
            Log::info('Paystack subscription created', ['subscription_code' => $data['data']['subscription_code']]);
            return $data['data']['subscription_code'];
        }

        Log::error('Failed to create Paystack subscription', ['response' => $data]);
        return null;
    }
}