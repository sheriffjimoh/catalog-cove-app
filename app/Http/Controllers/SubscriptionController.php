<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Business;

class SubscriptionController extends Controller
{
    protected $user;

    public function __construct() {
        $this->user = Auth::user();
    }
    
    public function showPlans()
    {
       
        $currency = $this->getUserCurrency();
        $plans = Plan::where('is_active', true) ->with(['pricing' => function ($query) use ($currency) {
            $query->where('currency', $currency);
        }])->orderBy('sort_order')->get();
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
            'plan_id' => $plan,
            'pricing' => $pricing,
            'interval' => $request->interval,
            'currency' => $currency
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'interval' => 'required|in:monthly,yearly',
            'currency' => 'required|string',
        ]);
    
    
    
        $plan = Plan::with('pricing')->findOrFail($request->plan_id);
        $pricing = $plan->pricing()->where('currency', $request->currency)->first();
        if (!$pricing) {
            return redirect()->back()->withErrors(['plan_id' => 'Pricing not available for your region']);
        }
    
        // Detect provider based on currency
        $provider = match($request->currency) {
            'NGN','GHS','KES' => 'paystack',
            default => 'stripe',
        };
        
      return  Inertia::render('Subscriptions/Checkout', [
            'plan' => $plan,
            'pricing' => $pricing,
            'interval' => $request->interval,
            'currency' => $request->currency,
            'provider' => $provider,
        ]);
    }

    protected function getUserCurrency()
    {
        $business = Business::with('country')->find($this->user->business->id);
        $country = $business->country->code;

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
