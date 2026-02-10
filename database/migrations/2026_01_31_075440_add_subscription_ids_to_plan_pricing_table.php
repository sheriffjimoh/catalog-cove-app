<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::table('plan_pricing', function (Blueprint $table) {
            $table->string('stripe_monthly_price_id')->nullable()->after('stripe_price_id');
            $table->string('stripe_yearly_price_id')->nullable()->after('stripe_monthly_price_id');
            $table->string('paystack_monthly_plan_code')->nullable()->after('paystack_plan_code');
            $table->string('paystack_yearly_plan_code')->nullable()->after('paystack_monthly_plan_code');
        });
    }

    public function down(): void
    {
        Schema::table('plan_pricing', function (Blueprint $table) {
            $table->dropColumn([
                'stripe_monthly_price_id',
                'stripe_yearly_price_id',
                'paystack_monthly_plan_code',
                'paystack_yearly_plan_code'
            ]);
        });
    }
};
