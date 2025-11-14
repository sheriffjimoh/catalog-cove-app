<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->nullable()->constrained()->nullOnDelete();
            $table->string('provider'); // stripe, paystack
            $table->string('provider_payment_id')->unique();
            $table->enum('status', ['pending', 'succeeded', 'failed', 'refunded']);
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3);
            $table->string('description')->nullable();
            $table->text('metadata')->nullable(); // JSON
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};