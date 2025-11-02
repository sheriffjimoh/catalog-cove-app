<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsEvent extends Model
{
    const UPDATED_AT = null; // We only need created_at

    protected $fillable = [
        'business_id',
        'product_id',
        'event_type',
        'visitor_id',
        'device_type',
        'referrer',
        'ip_address',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}