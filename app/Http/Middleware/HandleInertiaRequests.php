<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $business = $user?->business;
        $activeSub = $business ? $business->activeSubscription() : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'business' => $business,
            'subscription' => $activeSub ? [
                'plan_name' => $activeSub->plan?->name,
                'plan_slug' => $activeSub->plan?->slug,
                'product_limit' => $activeSub->plan?->product_limit,
                'product_count' => $business->products()->count(),
                'is_active' => true,
                'expires_at' => $activeSub->current_period_end?->toDateString(),
            ] : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
                'errors' => fn () => $request->session()->get('errors'),
            ],
            
        ];
    }
}
