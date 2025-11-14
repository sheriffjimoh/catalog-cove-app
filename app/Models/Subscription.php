<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Subscription extends Model
{
    protected $fillable = [
        'business_id',
        'plan_id',
        'status',
        'provider',
        'provider_subscription_id',
        'provider_customer_id',
        'currency',
        'amount',
        'interval',
        'current_period_start',
        'current_period_end',
        'trial_ends_at',
        'cancelled_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'current_period_start' => 'datetime',
        'current_period_end' => 'datetime',
        'trial_ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && 
               ($this->current_period_end === null || $this->current_period_end->isFuture());
    }

    public function isCancelled(): bool
    {
        return $this->cancelled_at !== null;
    }

    public function isExpired(): bool
    {
        return $this->current_period_end && $this->current_period_end->isPast();
    }

    public function onGracePeriod(): bool
    {
        return $this->cancelled_at !== null && 
               $this->current_period_end && 
               $this->current_period_end->isFuture();
    }

    public function daysUntilExpiry(): ?int
    {
        if (!$this->current_period_end) {
            return null;
        }

        return now()->diffInDays($this->current_period_end, false);
    }
}