<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('plan_pricing', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();
            $table->string('currency', 3); 
            $table->decimal('monthly_price', 10, 2);
            $table->decimal('yearly_price', 10, 2)->nullable();
            $table->string('stripe_price_id')->nullable();
            $table->string('paystack_plan_code')->nullable();
            $table->timestamps();

            $table->unique(['plan_id', 'currency']);
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('plan_pricing');
    }
};
