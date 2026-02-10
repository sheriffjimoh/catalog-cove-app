<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use App\Models\Plan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class PaymentController extends Controller
{
    protected $payment;
    protected $user;

    public function __construct(PaymentService $payment)
    {
        $this->payment = $payment;
        $this->user = Auth::user();
    }
   

    public function stripeCheckout(Request $request)
    {
        $plan = Plan::findOrFail($request->plan_id);
        $pricing = $plan->pricing()->where('currency', $request->currency)->first();

        $session = $this->payment->createStripeCheckoutSession($plan, $pricing, $request->interval, $request->currency, $request->user());

        return response()->json([
            'sessionUrl' => $session->url
        ]);
    }

    public function paystackCheckout(Request $request)
    {
        // dd($request->all());
        // $user = $this->user;
        $user = $request->user();
        dd($user);

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $plan = Plan::findOrFail($request->plan_id);
        $pricing = $plan->pricing()->where('currency', $request->currency)->first();

        $transaction = $this->payment->createPaystackTransaction($plan, $pricing, $request->interval, $request->currency, $user);
        //  dd($transaction);
        return response()->json($transaction['data']);
    }
}
