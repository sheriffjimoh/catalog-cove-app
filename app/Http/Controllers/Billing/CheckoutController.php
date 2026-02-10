<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\PlanPricing;
use App\Services\Billing\PaystackSubscriptionService;
use App\Services\Billing\StripeSubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'plan_pricing_id' => ['required', 'exists:plan_pricing,id'],
            'provider' => ['required', 'in:stripe,paystack'],
            'interval' => ['required', 'in:monthly,yearly'],
        ]);

        $business = Auth::user()->business;
        $pricing = PlanPricing::findOrFail($request->plan_pricing_id);
        $interval = $request->interval;

        if ($request->provider === 'stripe') {
            $checkoutUrl = app(StripeSubscriptionService::class)
                ->createCheckout($business, $pricing, $interval);
        } else {
            $checkoutUrl = app(PaystackSubscriptionService::class)
                ->createSubscription($business, $pricing);
        }

        return response()->json([
            'url' => $checkoutUrl,
        ]);
    }
}
