<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;
use App\Models\PlanPricing;

class PlansSeeder extends Seeder
{
    public function run(): void
    {
        $plansData = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Free plan with limited features',
                'product_limit' => 10,
                'features' => ['basic_support'],
                'sort_order' => 0,
                'pricing' => [
                    ['currency' => 'NGN', 'monthly_price' => 0],
                    ['currency' => 'USD', 'monthly_price' => 0],
                    ['currency' => 'EUR', 'monthly_price' => 0],
                    ['currency' => 'GBP', 'monthly_price' => 0],
                    ['currency' => 'INR', 'monthly_price' => 0],
                ],
            ],
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Starter plan for small businesses',
                'product_limit' => 100,
                'features' => ['basic_support', 'analytics'],
                'sort_order' => 1,
                'pricing' => [
                    ['currency' => 'NGN', 'monthly_price' => 5000],
                    ['currency' => 'USD', 'monthly_price' => 10],
                    ['currency' => 'EUR', 'monthly_price' => 10],
                    ['currency' => 'GBP', 'monthly_price' => 9],
                    ['currency' => 'INR', 'monthly_price' => 299],
                ],
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Pro plan with unlimited products and advanced features',
                'product_limit' => null,
                'features' => ['priority_support', 'analytics', 'custom_features'],
                'sort_order' => 2,
                'pricing' => [
                    ['currency' => 'NGN', 'monthly_price' => 15000],
                    ['currency' => 'USD', 'monthly_price' => 29],
                    ['currency' => 'EUR', 'monthly_price' => 29],
                    ['currency' => 'GBP', 'monthly_price' => 25],
                    ['currency' => 'INR', 'monthly_price' => 999],
                ],
            ],
        ];

        foreach ($plansData as $data) {
            $plan = Plan::create([
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'],
                'product_limit' => $data['product_limit'],
                'features' => $data['features'],
                'sort_order' => $data['sort_order'],
                'is_active' => true,
            ]);

            foreach ($data['pricing'] as $price) {
                PlanPricing::create([
                    'plan_id' => $plan->id,
                    'currency' => $price['currency'],
                    'monthly_price' => $price['monthly_price'],
                ]);
            }
        }
    }
}
