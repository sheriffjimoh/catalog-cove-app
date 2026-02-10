<?php

namespace App\Services\Billing;

use App\Models\Business;
use App\Models\PlanPricing;
use Illuminate\Support\Facades\Http;

class PaystackSubscriptionService
{
    protected string $baseUrl;
    protected string $secretKey;

    public function __construct()
    {
        $this->baseUrl = 'https://api.paystack.co';
        $this->secretKey = config('services.paystack.secret');
    }

   
    public function createSubscription(Business $business, PlanPricing $pricing, string $interval = 'monthly'): string
    {
        // Convert interval to Paystack format
        $paystackInterval = $interval === 'monthly' ? 'monthly' : 'yearly';

        // Ensure customer exists on Paystack
        $customerId = $this->ensureCustomer($business);

        // Create subscription
        $response = Http::withToken($this->secretKey)
            ->post("{$this->baseUrl}/subscription", [
                'customer' => $customerId,
                'plan' => $pricing->paystack_plan_code,
                'start_date' => now()->toIso8601String(),
                'authorization' => null,
            ]);

        $data = $response->json();

        if (!$response->successful() || !$data['status']) {
            throw new \Exception('Paystack subscription creation failed: ' . ($data['message'] ?? 'Unknown'));
        }

        // Paystack may require authorization URL (for first-time authorization)
        return $data['data']['authorization_url'] ?? '';
    }

    /**
     * Ensure the business has a Paystack customer ID
     */
    protected function ensureCustomer(Business $business): string
    {
        if ($business->paystack_customer_id) {
            return $business->paystack_customer_id;
        }

        // Create customer
        $response = Http::withToken($this->secretKey)
            ->post("{$this->baseUrl}/customer", [
                'email' => $business->owner->email,
                'name' => $business->name,
            ]);

        $data = $response->json();

        if (!$response->successful() || !$data['status']) {
            throw new \Exception('Paystack customer creation failed: ' . ($data['message'] ?? 'Unknown'));
        }

        $customerId = $data['data']['id'];
        $business->paystack_customer_id = $customerId;
        $business->save();

        return $customerId;
    }
}
