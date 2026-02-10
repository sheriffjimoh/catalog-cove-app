<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanPricing extends Model
{
    protected $table = 'plan_pricing';

    protected $fillable = [
        'plan_id',
        'currency',
        'monthly_price',
        'yearly_price',
        'stripe_price_id',
        'paystack_plan_code',
        'stripe_monthly_price_id',
        'stripe_yearly_price_id',
        'paystack_plan_code', 
        'paystack_monthly_plan_code',
        'paystack_yearly_plan_code',
    ];

    protected $casts = [
        'monthly_price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function getFormattedPrice(string $interval = 'monthly'): string
    {
        $price = $interval === 'yearly' ? $this->yearly_price : $this->monthly_price;
        
        return match($this->currency) {
            'NGN' => '₦' . number_format($price, 0),
            'USD' => '$' . number_format($price, 2),
            'GHS' => 'GH₵' . number_format($price, 2),
            'KES' => 'KSh' . number_format($price, 0),
            default => $this->currency . ' ' . number_format($price, 2),
        };
    }
}