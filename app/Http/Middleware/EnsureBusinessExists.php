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

        if ($request->routeIs('plans.select') || $request->routeIs('business.create')) {
            return $next($request);
        }

        if ($request->user() && !$business->activeSubscription()) {
            return redirect()->route('plans.select');
        }

        return $next($request);
    }
}
