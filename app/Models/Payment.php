<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'business_id',
        'subscription_id',
        'provider',
        'provider_payment_id',
        'status',
        'amount',
        'currency',
        'description',
        'metadata',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];


    public function isSucceeded(): bool
    {
        return $this->status === 'succeeded';
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
    
}
