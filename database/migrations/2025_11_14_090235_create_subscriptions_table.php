<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained();
            $table->enum('status', [
                'active', 
                'cancelled', 
                'expired', 
                'pending', 
                'past_due'
            ])->default('pending');
            $table->enum('provider', ['stripe', 'paystack'])->nullable();
            $table->string('provider_subscription_id')->nullable()->unique();
            $table->string('provider_customer_id')->nullable();
            $table->string('currency', 3);
            $table->decimal('amount', 10, 2);
            $table->enum('interval', ['monthly', 'yearly'])->default('monthly');
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};