<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'subscription_id',
        'amount',
        'currency',
        'payment_method',
        'status',
        'transaction_id',
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
