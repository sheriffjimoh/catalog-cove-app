<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsageRecord extends Model
{
    protected $fillable = [
        'business_id',
        'feature',
        'used',
        'limit',
        'period_start',
        'period_end',
    ];

    protected $casts = [
        'used' => 'integer',
        'limit' => 'integer',
        'period_start' => 'date',
        'period_end' => 'date',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function hasReachedLimit(): bool
    {
        if ($this->limit === null) {
            return false; // unlimited
        }

        return $this->used >= $this->limit;
    }

    public function incrementUsage(int $amount = 1): void
    {
        $this->used += $amount;
        $this->save();
    }

    public function isActive(): bool
    {
        return now()->between($this->period_start, $this->period_end);
    }
}
