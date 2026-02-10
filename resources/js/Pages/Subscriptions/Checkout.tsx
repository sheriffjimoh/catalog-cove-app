import { Head } from '@inertiajs/react';
import React from 'react';

interface Props {
    plan: {
        id: number;
        name: string;
        slug: string;
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


    let priceId = '';
    if (provider === 'stripe') {
        priceId = interval === 'yearly' ? (pricing.stripe_yearly_price_id || '') : (pricing.stripe_price_id || '');
    } else {
        priceId = interval === 'yearly' ? (pricing.paystack_yearly_plan_code || '') : (pricing.paystack_plan_code || '');
    }
   
    let endpoint = '';
    if (provider === 'stripe') {
        endpoint = '/api/stripe/checkout';
    } else {
        endpoint = '/api/paystack/checkout';
    }
    const handlePayment = async () => {
        // await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify({
                plan_id: plan.id,
                currency: currency,
                plan_pricing_id: priceId,
                provider: provider, // 'stripe' or 'paystack'
                interval: interval, // 'monthly' or 'yearly'
            }),
        });
    
        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        }
    };

    const price = interval === 'yearly' ? pricing.yearly_price : pricing.monthly_price;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50">
            <Head title="Checkout" />
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{plan.name} Plan Checkout</h2>
                <p className="mb-4 text-slate-600">
                    You are subscribing to the {plan.name} plan ({interval}) for {currency} {price}.
                </p>
                <button
                    onClick={handlePayment}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-700 to-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    Pay with {provider === 'stripe' ? 'Stripe' : 'Paystack'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
