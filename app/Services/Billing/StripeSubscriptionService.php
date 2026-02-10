<?php

namespace App\Services\Billing;

use App\Models\Business;
use App\Models\PlanPricing;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeSubscriptionService
{
    public function createCheckout(
        Business $business,
        PlanPricing $pricing,
        string $interval
    ): string {
        Stripe::setApiKey(config('services.stripe.secret'));

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
            ],
            'success_url' => route('billing.success'),
            'cancel_url' => route('billing.cancel'),
        ]);

        return $session->url;
    }
}
