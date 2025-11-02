<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->cascadeOnDelete();
            $table->enum('event_type', ['store_visited', 'product_viewed', 'inquiry_sent', 'product_shared']);
            $table->string('visitor_id', 64)->index(); // Anonymous tracking
            $table->string('device_type', 20)->nullable(); // mobile, desktop, tablet
            $table->string('referrer', 255)->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamp('created_at');
            
            $table->index(['business_id', 'event_type', 'created_at']);
            $table->index(['product_id', 'event_type', 'created_at']);
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
