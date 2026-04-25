<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 40px 40px 32px; text-align: center;">
                            <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <span style="font-size: 28px;">🎉</span>
                            </div>
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px;">
                                Welcome to {{ $plan->name }}!
                            </h1>
                            <p style="color: rgba(255,255,255,0.8); font-size: 15px; margin: 0;">
                                Your subscription is now active
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 32px 40px;">
                            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                                Hi <strong>{{ $business->name }}</strong>,
                            </p>
                            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
                                Thank you for subscribing to the <strong style="color: #374151;">{{ $plan->name }}</strong> plan. Your payment has been processed successfully and your account has been upgraded.
                            </p>

                            <!-- Subscription Details Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 28px;">
                                <tr>
                                    <td style="padding: 20px 24px 12px;">
                                        <h3 style="color: #111827; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">
                                            Subscription Details
                                        </h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Plan</td>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{{ $plan->name }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Billing</td>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{{ ucfirst($interval) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Amount</td>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{{ $currency }} {{ number_format($amount, 2) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Start Date</td>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{{ \Carbon\Carbon::parse($subscription->current_period_start)->format('M d, Y') }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Next Billing</td>
                                                <td style="padding: 10px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                                    @if($subscription->current_period_end)
                                                        {{ \Carbon\Carbon::parse($subscription->current_period_end)->format('M d, Y') }}
                                                    @else
                                                        No expiry
                                                    @endif
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr><td style="padding: 8px;"></td></tr>
                            </table>

                            <!-- Features -->
                            @if($plan->features && count($plan->features) > 0)
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                                <tr>
                                    <td>
                                        <h3 style="color: #111827; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;">
                                            What's Included
                                        </h3>
                                    </td>
                                </tr>
                                @foreach($plan->features as $feature)
                                <tr>
                                    <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">
                                        ✓ &nbsp; {{ $feature }}
                                    </td>
                                </tr>
                                @endforeach
                            </table>
                            @endif

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 8px 0 16px;">
                                        <a href="{{ url('/dashboard') }}" style="display: inline-block; background: #7c3aed; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 10px;">
                                            Go to Dashboard →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
                                You can manage your subscription anytime from your
                                <a href="{{ url('/subscription') }}" style="color: #7c3aed; text-decoration: none;">account settings</a>.
                            </p>
                            <p style="color: #d1d5db; font-size: 12px; margin: 12px 0 0; text-align: center;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
