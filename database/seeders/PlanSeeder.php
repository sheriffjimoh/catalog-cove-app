<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\PlanPricing;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        // Free Plan
        $freePlan = Plan::create([
            'name' => 'Free',
            'slug' => 'free',
            'description' => 'Perfect for getting started',
            'product_limit' => 10,
            'features' => [
                'Up to 10 products',
                'Basic analytics',
                'WhatsApp integration',
                'Product images',
            ],
            'sort_order' => 1,
        ]);

        PlanPricing::create([
            'plan_id' => $freePlan->id,
            'currency' => 'NGN',
            'monthly_price' => 0,
            'yearly_price' => 0,
        ]);

        PlanPricing::create([
            'plan_id' => $freePlan->id,
            'currency' => 'USD',
            'monthly_price' => 0,
            'yearly_price' => 0,
        ]);

        // Starter Plan
        $starterPlan = Plan::create([
            'name' => 'Starter',
            'slug' => 'starter',
            'description' => 'For growing businesses',
            'product_limit' => 100,
            'features' => [
                'Up to 100 products',
                'Advanced analytics',
                'WhatsApp integration',
                'Unlimited images',
                'Priority support',
            ],
            'sort_order' => 2,
        ]);

        PlanPricing::create([
            'plan_id' => $starterPlan->id,
            'currency' => 'NGN',
            'monthly_price' => 5000,
            'yearly_price' => 50000,
        ]);

        PlanPricing::create([
            'plan_id' => $starterPlan->id,
            'currency' => 'USD',
            'monthly_price' => 10,
            'yearly_price' => 100,
        ]);

        PlanPricing::create([
            'plan_id' => $starterPlan->id,
            'currency' => 'GHS',
            'monthly_price' => 150,
            'yearly_price' => 1500,
        ]);

        PlanPricing::create([
            'plan_id' => $starterPlan->id,
            'currency' => 'KES',
            'monthly_price' => 1300,
            'yearly_price' => 13000,
        ]);

        // Pro Plan
        $proPlan = Plan::create([
            'name' => 'Pro',
            'slug' => 'pro',
            'description' => 'For established businesses',
            'product_limit' => null, // unlimited
            'features' => [
                'Unlimited products',
                'Advanced analytics',
                'WhatsApp integration',
                'Unlimited images',
                'Priority support',
                'Custom branding',
                'API access',
                'Bulk import',
            ],
            'sort_order' => 3,
        ]);

        PlanPricing::create([
            'plan_id' => $proPlan->id,
            'currency' => 'NGN',
            'monthly_price' => 15000,
            'yearly_price' => 150000,
        ]);

        PlanPricing::create([
            'plan_id' => $proPlan->id,
            'currency' => 'USD',
            'monthly_price' => 29,
            'yearly_price' => 290,
        ]);

        PlanPricing::create([
            'plan_id' => $proPlan->id,
            'currency' => 'GHS',
            'monthly_price' => 450,
            'yearly_price' => 4500,
        ]);

        PlanPricing::create([
            'plan_id' => $proPlan->id,
            'currency' => 'KES',
            'monthly_price' => 3800,
            'yearly_price' => 38000,
        ]);
    }
}