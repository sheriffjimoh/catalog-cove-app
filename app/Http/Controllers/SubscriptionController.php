<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected $user;

    public function __construct() {
        $this->user = Auth::user();
    }
    
    public function showPlans()
    {
        // Fetch only active plans
        $plans = Plan::where('is_active', true)->with('pricing')->orderBy('sort_order')->get();
        return Inertia::render('Subscriptions/SelectPlan', [
            'plans' => $plans,
        ]);
    }

  
    public function selectPlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'interval' => 'required|in:monthly,yearly',
        ]);

        $plan = Plan::findOrFail($request->plan_id);

        $currency = $this->getUserCurrency();

        $pricing = $plan->pricing()->where('currency', $currency)->first();

        if (!$pricing) {
            return back()->withErrors(['plan_id' => 'Pricing not available for your region']);
        }

        // If Free plan → create subscription immediately
        if ($plan->isFree()) {
           Subscription::create([
                'business_id' => $this->user->business->id,
                'plan_id' => $plan->id,
                'status' => 'active',
                'provider' => null,
                'provider_subscription_id' => null,
                'currency' => $currency,
                'amount' => 0,
                'interval' => $request->interval,
                'current_period_start' => Carbon::now(),
                'current_period_end' => null,
            ]);

            return redirect()->route('dashboard')->with('success', 'Free plan activated!');
        }

        // Paid plan → redirect to payment checkout
        return redirect()->route('checkout', [
            'plan_id' => $plan->id,
            'interval' => $request->interval,
            'currency' => $currency
        ]);
    }

    protected function getUserCurrency()
    {
        $country = $this->user->business->country_code ?? 'US';

        return match($country) {
            'NG' => 'NGN',
            'GH' => 'GHS',
            'KE' => 'KES',
            'IN' => 'INR',
            'GB' => 'GBP',
            'EU' => 'EUR',
            default => 'USD',
        };
    }
}
