import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Crown,
    Lock,
    Shield,
    Sparkles,
    Loader2,
    Zap,
    Calendar,
    AlertCircle,
} from 'lucide-react';

interface Props {
    plan: {
        id: number;
        name: string;
        slug: string;
        description?: string;
        features?: string[];
        product_limit?: number | null;
    };
    pricing: {
        monthly_price: number;
        yearly_price: number;
        stripe_price_id?: string;
        paystack_plan_code?: string;
        stripe_yearly_price_id?: string;
        paystack_monthly_plan_code?: string;
        paystack_yearly_plan_code?: string;
    };
    interval: 'monthly' | 'yearly';
    currency: string;
    provider: 'stripe' | 'paystack';
}

const Checkout: React.FC<Props> = ({ plan, pricing, interval, currency, provider }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    let priceId = '';
    if (provider === 'stripe') {
        priceId = interval === 'yearly' ? (pricing.stripe_yearly_price_id || '') : (pricing.stripe_price_id || '');
    } else {
        priceId = interval === 'yearly' ? (pricing.paystack_yearly_plan_code || '') : (pricing.paystack_plan_code || '');
    }

    const endpoint = provider === 'stripe' ? '/api/stripe/checkout' : '/api/paystack/checkout';
    const price = interval === 'yearly' ? pricing.yearly_price : pricing.monthly_price;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const monthlyCost = interval === 'yearly' ? price / 12 : price;
    const yearlySavings = interval === 'yearly'
        ? pricing.monthly_price * 12 - pricing.yearly_price
        : 0;

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                },
                credentials: 'include',
                body: JSON.stringify({
                    plan_id: plan.id,
                    currency: currency,
                    plan_pricing_id: priceId,
                    provider: provider,
                    interval: interval,
                }),
            });

            const data = await response.json();
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                setError('Unable to initiate payment. Please try again.');
                setLoading(false);
            }
        } catch {
            setError('A network error occurred. Please check your connection.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={`Checkout — ${plan.name} Plan`} />

            {/* Top Bar */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/select-plan"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to plans
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Lock className="w-3.5 h-3.5" />
                        Secure checkout
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Left Column — Order Summary */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Complete your subscription
                            </h1>
                            <p className="text-gray-500">
                                You're subscribing to the <span className="font-semibold text-gray-700">{plan.name}</span> plan
                            </p>
                        </div>

                        {/* Plan Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {/* Plan Header */}
                            <div className="bg-gradient-to-r from-purple-700 to-purple-800 px-6 py-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Crown className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{plan.name} Plan</h2>
                                        <p className="text-purple-200 text-sm capitalize">{interval} billing</p>
                                    </div>
                                </div>
                                {interval === 'yearly' && yearlySavings > 0 && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-400/20 text-green-100 text-xs font-semibold rounded-full">
                                        <Sparkles className="w-3 h-3" />
                                        Save {formatCurrency(yearlySavings)}
                                    </span>
                                )}
                            </div>

                            {/* Plan Details */}
                            <div className="p-6 space-y-5">
                                {/* Description */}
                                {plan.description && (
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {plan.description}
                                    </p>
                                )}

                                {/* Features */}
                                {plan.features && plan.features.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                            What's included
                                        </h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2.5">
                                                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Product Limit */}
                                {plan.product_limit !== undefined && (
                                    <div className="flex items-center gap-3 p-3.5 bg-purple-50 rounded-xl">
                                        <Zap className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                        <span className="text-sm text-purple-700">
                                            {plan.product_limit === null
                                                ? 'Unlimited products'
                                                : `Up to ${plan.product_limit} products`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 text-center">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <span className="text-xs text-gray-500 font-medium">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 text-center">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span className="text-xs text-gray-500 font-medium">Cancel Anytime</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 text-center">
                                <Sparkles className="w-5 h-5 text-gray-400" />
                                <span className="text-xs text-gray-500 font-medium">Instant Access</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Payment */}
                    <div className="lg:col-span-2">
                        <div className="lg:sticky lg:top-8 space-y-5">
                            {/* Order Total Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="p-6 space-y-5">
                                    <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

                                    {/* Line Items */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">{plan.name} — {interval}</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(price)}</span>
                                        </div>
                                        {interval === 'yearly' && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Monthly equivalent</span>
                                                <span className="text-gray-400">{formatCurrency(monthlyCost)}/mo</span>
                                            </div>
                                        )}
                                        {interval === 'yearly' && yearlySavings > 0 && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-green-600 font-medium">Yearly savings</span>
                                                <span className="text-green-600 font-medium">−{formatCurrency(yearlySavings)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-100" />

                                    {/* Total */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-gray-900">Total due today</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(price)}</span>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {currency} · billed {interval}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pay Button */}
                                <div className="px-6 pb-6">
                                    {error && (
                                        <div className="flex items-start gap-2.5 p-3 mb-4 bg-red-50 text-red-700 rounded-xl text-sm">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-semibold rounded-xl transition-all text-base shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-200"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Redirecting to {provider === 'stripe' ? 'Stripe' : 'Paystack'}...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                Pay {formatCurrency(price)} with {provider === 'stripe' ? 'Stripe' : 'Paystack'}
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                                        <Lock className="w-3 h-3" />
                                        Processed securely via {provider === 'stripe' ? 'Stripe' : 'Paystack'}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Provider Badge */}
                            <div className="flex items-center justify-center gap-3 py-3">
                                {provider === 'stripe' ? (
                                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                                        <div className="flex gap-1.5">
                                            <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[9px] font-bold text-gray-400">VISA</div>
                                            <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[9px] font-bold text-gray-400">MC</div>
                                        </div>
                                        <span className="text-gray-300">|</span>
                                        <span>Powered by Stripe</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                                        <span>Powered by Paystack</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
