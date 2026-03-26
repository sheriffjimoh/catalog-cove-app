<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\UsageRecord;
use App\Models\Business;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $payment;

    public function __construct(PaymentService $payment)
    {
        $this->payment = $payment;
    }

    public function stripeCheckout(Request $request)
    {
        $user = $request->user();
        $plan = Plan::findOrFail($request->plan_id);
        $pricing = $plan->pricing()->where('currency', $request->currency)->first();
        $business = $user->business;

        $session = $this->payment->createStripeCheckoutSession($business, $pricing, $request->interval);

        return response()->json([
            'authorization_url' => $session->url,
        ]);
    }

    public function paystackCheckout(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $plan = Plan::findOrFail($request->plan_id);
        $pricing = $plan->pricing()->where('currency', $request->currency)->first();

        $transaction = $this->payment->createPaystackTransaction($plan, $pricing, $request->interval, $request->currency, $user);

        return response()->json($transaction['data']);
    }

    /**
     * Handle Paystack redirect callback after payment.
     */
    public function paystackCallback(Request $request)
    {
        $reference = $request->query('reference') ?? $request->query('trxref');

        if (!$reference) {
            return redirect()->route('plans.select')->withErrors(['payment' => 'Invalid payment reference.']);
        }

        $transactionData = $this->payment->verifyPaystackTransaction($reference);

        if (!$transactionData) {
            return redirect()->route('plans.select')->withErrors(['payment' => 'Payment verification failed.']);
        }

        $planId = $request->query('plan_id');
        $interval = $request->query('interval');
        $businessId = $request->query('business_id');
        $currency = $request->query('currency');

        $plan = Plan::findOrFail($planId);
        $business = Business::findOrFail($businessId);
        $amount = $transactionData['amount'] / 100; // Convert from kobo

        $this->createSubscriptionAndPayment(
            business: $business,
            plan: $plan,
            provider: 'paystack',
            providerSubscriptionId: $transactionData['reference'],
            providerCustomerId: $transactionData['customer']['customer_code'] ?? null,
            providerPaymentId: $transactionData['reference'],
            currency: $currency,
            amount: $amount,
            interval: $interval,
        );

        return redirect()->route('payment.success');
    }

    /**
     * Handle Stripe redirect callback after payment.
     */
    public function stripeCallback(Request $request)
    {
        $sessionId = $request->query('session_id');

        if (!$sessionId) {
            return redirect()->route('plans.select')->withErrors(['payment' => 'Invalid session.']);
        }

        $session = $this->payment->verifyStripeSession($sessionId);

        if (!$session) {
            return redirect()->route('plans.select')->withErrors(['payment' => 'Payment verification failed.']);
        }

        $metadata = $session->metadata;
        $plan = Plan::findOrFail($metadata->plan_id);
        $business = Business::findOrFail($metadata->business_id);

        $pricing = $plan->pricing()->where('currency', $metadata->currency)->first();
        $amount = $metadata->interval === 'yearly' ? $pricing->yearly_price : $pricing->monthly_price;

        $this->createSubscriptionAndPayment(
            business: $business,
            plan: $plan,
            provider: 'stripe',
            providerSubscriptionId: $session->subscription->id ?? $session->subscription,
            providerCustomerId: $session->customer,
            providerPaymentId: $session->payment_intent,
            currency: $metadata->currency,
            amount: $amount,
            interval: $metadata->interval,
        );

        return redirect()->route('payment.success');
    }

    /**
     * Shared method to create Subscription, Payment, and UsageRecord.
     */
    private function createSubscriptionAndPayment(
        Business $business,
        Plan $plan,
        string $provider,
        ?string $providerSubscriptionId,
        ?string $providerCustomerId,
        ?string $providerPaymentId,
        string $currency,
        float $amount,
        string $interval,
    ): void {
        $now = Carbon::now();
        $periodEnd = $interval === 'yearly' ? $now->copy()->addYear() : $now->copy()->addMonth();

        // Cancel any existing active subscriptions
        $business->subscriptions()
            ->where('status', 'active')
            ->update(['status' => 'cancelled', 'cancelled_at' => $now]);

        // Create subscription
        $subscription = Subscription::create([
            'business_id' => $business->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'provider' => $provider,
            'provider_subscription_id' => $providerSubscriptionId,
            'provider_customer_id' => $providerCustomerId,
            'currency' => $currency,
            'amount' => $amount,
            'interval' => $interval,
            'current_period_start' => $now,
            'current_period_end' => $periodEnd,
        ]);

        // Create payment record
        Payment::create([
            'business_id' => $business->id,
            'subscription_id' => $subscription->id,
            'provider' => $provider,
            'provider_payment_id' => $providerPaymentId ?? $providerSubscriptionId,
            'status' => 'succeeded',
            'amount' => $amount,
            'currency' => $currency,
            'description' => "Subscription to {$plan->name} plan ({$interval})",
            'paid_at' => $now,
        ]);

        // Initialize usage record for this billing period
        UsageRecord::updateOrCreate(
            [
                'business_id' => $business->id,
                'feature' => 'products',
                'period_start' => $now->toDateString(),
            ],
            [
                'used' => $business->products()->count(),
                'limit' => $plan->product_limit,
                'period_end' => $periodEnd->toDateString(),
            ]
        );

        // Mark business as having selected a plan
        $business->update(['has_selected_plan' => true]);

        Log::info("Subscription created for business {$business->id} on plan {$plan->name} via {$provider}");
    }
}