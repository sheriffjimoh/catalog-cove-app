<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'product_limit',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'product_limit' => 'integer',
    ];

    public function pricing(): HasMany
    {
        return $this->hasMany(PlanPricing::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function getPricing(string $currency): ?PlanPricing
    {
        return $this->pricing()->where('currency', $currency)->first();
    }

    public function isFree(): bool
    {
        return $this->slug === 'free';
    }

    public function isUnlimited(): bool
    {
        return $this->product_limit === null;
    }
}