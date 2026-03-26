<?php

namespace App\Services;

use Stripe\StripeClient;
use App\Models\Business;
use App\Models\PlanPricing;
use Stripe\Checkout\Session;

class PaymentService
{
    protected $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(env('STRIPE_SECRET'));
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
}