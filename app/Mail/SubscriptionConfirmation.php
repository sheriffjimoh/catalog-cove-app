<?php

namespace App\Mail;

use App\Models\Subscription;
use App\Models\Plan;
use App\Models\Business;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public Business $business;
    public Plan $plan;
    public Subscription $subscription;
    public float $amount;
    public string $currency;
    public string $interval;

    public function __construct(
        Business $business,
        Plan $plan,
        Subscription $subscription,
        float $amount,
        string $currency,
        string $interval
    ) {
        $this->business = $business;
        $this->plan = $plan;
        $this->subscription = $subscription;
        $this->amount = $amount;
        $this->currency = $currency;
        $this->interval = $interval;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🎉 Welcome to the {$this->plan->name} Plan!",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscription-confirmation',
        );
    }
}
