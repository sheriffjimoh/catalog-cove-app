import React, { useState } from 'react';
import { Check, ArrowRight, Gift, Zap, Crown } from 'lucide-react';
import { Head, router } from '@inertiajs/react';

interface PlanPricing {
    currency: string;
    monthly_price: number;
    yearly_price?: number;
}

interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string;
    features: string[];
    product_limit: number | null;
    pricing: PlanPricing[];
}

interface Props {
    plans: Plan[];
}

const PlanSelectionPage: React.FC<Props> = ({ plans }) => {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');



    const handleContinue = () => {
        if (selectedPlan) {
            router.post('/select-plan', {
                plan_id: selectedPlan,
                interval: interval,
            });
        }
    };

    const getPlanIcon = (slug: string) => {
        switch (slug) {
            case 'free': return <Gift className="w-8 h-8" />;
            case 'starter': return <Zap className="w-8 h-8" />;
            case 'pro': return <Crown className="w-8 h-8" />;
            default: return <Gift className="w-8 h-8" />;
        }
    };

    const getPlanColor = (slug: string) => {
        switch (slug) {
            case 'free': return 'from-slate-600 to-slate-700';
            case 'starter': return 'from-purple-600 to-purple-700';
            case 'pro': return 'from-purple-700 to-black';
            default: return 'from-slate-600 to-slate-700';
        }
    };

    const formatPrice = (price: number, currency: string) => {
        const formatMap: { [key: string]: string } = {
            NGN: `₦${price.toLocaleString()}`,
            KES: `KSh${price.toLocaleString()}`,
        };
        return formatMap[currency] || `${currency} ${price}`;
    };

    const getYearlySavings = (pricing: PlanPricing) => {
        if (!pricing.yearly_price) return 0;
        const monthlyCost = pricing.monthly_price * 12;
        const yearlyCost = pricing.yearly_price;
        return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <Head title="Select a Plan" />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-full flex items-center justify-center mb-6">
                        <img src="/images/logo.svg" alt="CatalogCove" className="w-60 h-20" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Start with our free plan and upgrade as you grow. All plans include core features to help your business succeed.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md border border-purple-100">
                        <button
                            type="button"
                            onClick={() => setInterval('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${interval === 'monthly' ? 'bg-purple-700 text-white shadow-md' : 'text-slate-600 hover:text-purple-700'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => setInterval('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${interval === 'yearly' ? 'bg-purple-700 text-white shadow-md' : 'text-slate-600 hover:text-purple-700'
                                }`}
                        >
                            Yearly
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Save 17%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {plans.map(plan => {
                        const pricing = plan.pricing[0];
                        const price = interval === 'yearly' ? pricing?.yearly_price : pricing?.monthly_price;
                        const isSelected = selectedPlan === plan.id;
                        const isPro = plan.slug === 'pro';

                        return (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${isSelected ? 'border-purple-700 shadow-purple-200' : 'border-gray-200 hover:border-purple-300'
                                    } ${isPro ? 'md:scale-105 z-10' : ''}`}
                            >
                                {/* Popular Badge */}
                                {isPro && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-purple-700 to-black text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                {/* Selected Indicator */}
                                {isSelected && (
                                    <div className="absolute -top-3 -right-3">
                                        <div className="bg-purple-700 text-white rounded-full p-2 shadow-lg">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Plan Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`bg-gradient-to-br ${getPlanColor(plan.slug)} text-white p-3 rounded-xl shadow-md`}>
                                            {getPlanIcon(plan.slug)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                                            <p className="text-sm text-slate-500">{plan.description}</p>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-slate-900">
                                                {price === 0 ? 'Free' : formatPrice(price || 0, pricing.currency)}
                                            </span>
                                            {price !== 0 && (
                                                <span className="text-slate-500 text-sm">
                                                    / {interval === 'yearly' ? 'year' : 'month'}
                                                </span>
                                            )}
                                        </div>
                                        {interval === 'yearly' && pricing?.yearly_price && (
                                            <p className="text-sm text-green-600 mt-1">
                                                Save {getYearlySavings(pricing)}% with yearly billing
                                            </p>
                                        )}
                                    </div>

                                    {/* Product Limit */}
                                    <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <p className="text-sm font-semibold text-purple-900">
                                            {plan.product_limit ? `Up to ${plan.product_limit} products` : 'Unlimited products'}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-slate-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>


                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue Button */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!selectedPlan}
                        className="inline-flex items-center gap-2 bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        Continue to Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-sm text-slate-500 mt-4">
                        You can change your plan anytime from your dashboard
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 pt-12 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-purple-700 mb-2">10K+</div>
                            <p className="text-slate-600">Active Businesses</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-700 mb-2">99.9%</div>
                            <p className="text-slate-600">Uptime Guaranteed</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-700 mb-2">24/7</div>
                            <p className="text-slate-600">Customer Support</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlanSelectionPage;
