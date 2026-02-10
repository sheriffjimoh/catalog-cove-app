<?php


namespace App\Services;

use Stripe\StripeClient;
use App\Models\Business;
use App\Models\PlanPricing;
use Stripe\Checkout\Session;

class PaymentService
{
    protected $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(env('STRIPE_SECRET'));
    }

    public function createStripeCheckoutSession(
      Business $business,
    PlanPricing $pricing,
    string $interval)
    {
        $priceId = $pricing->stripe_price_id;

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

        return $session;
    }

    public function createPaystackTransaction($plan, $pricing, $interval, $currency, $user)
    {
        $amount = ($interval === 'yearly' ? $pricing->yearly_price : $pricing->monthly_price) * 100; // Paystack in kobo
        $reference = 'PSK-' . uniqid();

        $payload = [
            'email' => $user->email,
            'amount' => $amount,
            'reference' => $reference,
            'currency' => $currency,
            'callback_url' => route('payment.success'),
        ];

        // Send request to Paystack API
        $ch = curl_init('https://api.paystack.co/transaction/initialize');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . env('PAYSTACK_SECRET'),
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}

?>