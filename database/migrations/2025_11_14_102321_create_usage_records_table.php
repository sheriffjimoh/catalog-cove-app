<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('feature'); 
            $table->integer('used')->default(0);
            $table->integer('limit')->nullable(); 
            $table->date('period_start');
            $table->date('period_end');
            $table->timestamps();

            $table->unique(['business_id', 'feature', 'period_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_records');
    }
};