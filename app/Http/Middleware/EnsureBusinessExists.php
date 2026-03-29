<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
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

        // Allow callback and checkout routes to pass through
        if ($request->routeIs('paystack.callback') ||
        $request->routeIs('stripe.callback') ||
        $request->routeIs('checkout') ||
        $request->routeIs('payment.success') ||
        $request->routeIs('billing.cancel') ||
        $request->routeIs('business.create')) {
            return $next($request);
        }

        // Allow select-plan access (users can change plans at any time)
        if ($request->routeIs('plans.select') || $request->routeIs('plans.select.submit')) {
            return $next($request);
        }

        // If no active subscription, redirect to plan selection
        if (!$business->activeSubscription()) {
            return redirect()->route('plans.select');
        }

        return $next($request);
    }
}