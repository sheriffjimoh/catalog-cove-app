<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBusinessExists
{

    public function handle(Request $request, Closure $next): Response
    {
        $business = $request->user()->business;
        if (!$business) {
            return redirect()->route('business.create');
        }

        // Routes that should always be accessible regardless of subscription status
        $allowedRoutes = [
            'paystack.callback',
            'stripe.callback',
            'checkout',
            'payment.success',
            'billing.cancel',
            'business.create',
            'plans.select',
            'plans.select.submit',
            'subscription.expired',
            'profile.edit',
            'profile.update',
            'profile.destroy',
            'settings',
            'subscription',
            'business.update',
        ];

        foreach ($allowedRoutes as $route) {
            if ($request->routeIs($route)) {
                return $next($request);
            }
        }

        // Check for active subscription
        $activeSubscription = $business->activeSubscription();

        if (!$activeSubscription) {
            // Check if they have any subscription at all (to distinguish expired vs never subscribed)
            $latestSubscription = $business->subscriptions()
                ->with('plan')
                ->latest()
                ->first();

            if ($latestSubscription && $latestSubscription->isExpired()) {
                // Had a subscription but it expired
                return redirect()->route('subscription.expired');
            }

            // Never had a subscription or it was cancelled
            return redirect()->route('plans.select');
        }

        return $next($request);
    }
}