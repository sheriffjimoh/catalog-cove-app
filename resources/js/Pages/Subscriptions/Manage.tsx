import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SettingsPagesLayout from '../Settings/Index';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Crown,
    Calendar,
    CreditCard,
    Clock,
    Package,
    ArrowUpRight,
    Shield,
    Zap,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Wallet,
    ExternalLink,
    Loader2,
} from 'lucide-react';
import SettingsSidebar from '@/Components/SettingsSidebar';

interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string;
    product_limit: number | null;
    features: string[];
}

interface Subscription {
    id: number;
    status: string;
    provider: string | null;
    provider_subscription_id: string | null;
    currency: string;
    amount: string;
    interval: string;
    current_period_start: string;
    current_period_end: string | null;
    trial_ends_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    plan: Plan;
}

interface Payment {
    id: number;
    provider: string;
    provider_payment_id: string;
    status: string;
    amount: string;
    currency: string;
    description: string | null;
    paid_at: string;
}

interface UsageRecord {
    feature: string;
    used: number;
    limit: number | null;
    period_start: string;
    period_end: string;
}

interface Props {
    subscription: Subscription | null;
    payments: Payment[];
    usage: UsageRecord | null;
    daysRemaining: number | null;
}

const ManageSubscription: React.FC<Props> = ({ subscription, payments, usage, daysRemaining }) => {
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: string, currency: string) => {
        const num = parseFloat(amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(num);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active':
                return { label: 'Active', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: CheckCircle2 };
            case 'cancelled':
                return { label: 'Cancelled', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: AlertTriangle };
            case 'expired':
                return { label: 'Expired', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: Clock };
            case 'past_due':
                return { label: 'Past Due', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: AlertTriangle };
            default:
                return { label: 'Pending', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: Clock };
        }
    };

    const getProviderLabel = (provider: string | null) => {
        if (!provider) return 'Free';
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    };

    const handleUpdatePaymentMethod = async () => {
        if (!subscription) return;
        setIsUpdatingPayment(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const xsrfCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            const response = await fetch('/api/subscription/update-payment-method', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                    ...(xsrfCookie ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfCookie) } : {}),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    subscription_id: subscription.id,
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Failed to initiate payment method update:', error);
        } finally {
            setIsUpdatingPayment(false);
        }
    };

    const usagePercentage = usage && usage.limit ? Math.min((usage.used / usage.limit) * 100, 100) : 0;
    const isNearLimit = usage && usage.limit ? usage.used >= usage.limit * 0.8 : false;

    return (
        <SettingsPagesLayout>
            <Head title="Subscription" />
            <div className="min-h-screen">
                <div className="col-span-12 ">
                    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-black dark:text-white">
                                    Subscription
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    Manage your plan, billing, and payment method
                                </p>
                            </div>
                            {subscription && subscription.status === 'active' && (
                                <Badge className={`${getStatusConfig(subscription.status).color} px-3 py-1.5 text-sm font-medium`}>
                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                    Active Plan
                                </Badge>
                            )}
                        </div>

                        {/* No Subscription State */}
                        {!subscription && (
                            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-none">
                                <CardContent className="p-12 text-center">
                                    <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Crown className="w-10 h-10 text-purple-700 dark:text-purple-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-black dark:text-white mb-3">
                                        No Active Subscription
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                        Choose a plan to unlock all features and grow your business.
                                    </p>
                                    <Link href="/select-plan">
                                        <Button className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 text-base">
                                            <Zap className="w-5 h-5 mr-2" />
                                            Browse Plans
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Active Subscription */}
                        {subscription && (
                            <>
                                {/* Current Plan Card */}
                                <Card className="border bg-purple-700 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                                    <CardContent className="p-8 relative z-10">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Crown className="w-8 h-8 text-white" />
                                                    <h2 className="text-3xl font-bold text-white">
                                                        {subscription.plan.name} Plan
                                                    </h2>
                                                </div>
                                                <p className="text-purple-200 text-lg">
                                                    {formatCurrency(subscription.amount, subscription.currency)}
                                                    <span className="text-purple-300 text-base"> / {subscription.interval}</span>
                                                </p>
                                                {subscription.plan.description && (
                                                    <p className="text-purple-200/80 text-sm max-w-md">
                                                        {subscription.plan.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
                                                    <p className="text-purple-200 text-xs uppercase tracking-wider mb-1">
                                                        {daysRemaining !== null && daysRemaining > 0 ? 'Days Remaining' : 'Status'}
                                                    </p>
                                                    <p className="text-3xl font-bold text-white">
                                                        {daysRemaining !== null ? (daysRemaining > 0 ? daysRemaining : 'Expired') : '∞'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Info Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Billing Period */}
                                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-none">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Calendar className="w-6 h-6 text-purple-700 dark:text-purple-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Billing Period</p>
                                                    <p className="text-sm font-semibold text-black dark:text-white">
                                                        {formatDate(subscription.current_period_start)}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">to</p>
                                                    <p className="text-sm font-semibold text-black dark:text-white">
                                                        {subscription.current_period_end
                                                            ? formatDate(subscription.current_period_end)
                                                            : 'No expiry'}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Payment Method */}
                                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-none">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <CreditCard className="w-6 h-6 text-black dark:text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Provider</p>
                                                    <p className="text-lg font-semibold text-black dark:text-white">
                                                        {getProviderLabel(subscription.provider)}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-1">
                                                        Billed {subscription.interval}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Status */}
                                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-none">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Shield className="w-6 h-6 text-purple-700 dark:text-purple-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                                    <Badge className={`${getStatusConfig(subscription.status).color} text-sm font-medium`}>
                                                        {getStatusConfig(subscription.status).label}
                                                    </Badge>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                        Since {formatDate(subscription.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Card Management */}
                                {subscription.provider && (
                                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-none">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg text-black dark:text-white flex items-center gap-2">
                                                <Wallet className="w-5 h-5 text-purple-700" />
                                                Card Details
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                                        <CreditCard className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-black dark:text-white">
                                                            Card via {getProviderLabel(subscription.provider)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                            Update your card details for future payments
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0"
                                                    onClick={handleUpdatePaymentMethod}
                                                    disabled={isUpdatingPayment}
                                                >
                                                    {isUpdatingPayment ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                    )}
                                                    {isUpdatingPayment ? 'Redirecting...' : 'Update Card'}
                                                </Button>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                                                <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    <p className="font-medium">Please note:</p>
                                                    <ul className="mt-1 space-y-0.5 list-disc list-inside">
                                                        <li>A small verification charge of ₦50 applies when updating your card.</li>
                                                        <li>You'll be taken to {getProviderLabel(subscription.provider)}'s secure page. After updating, please return to this page manually.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Usage & Features */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Usage Card */}
                                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-none">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg text-black dark:text-white flex items-center gap-2">
                                                <Package className="w-5 h-5 text-purple-700" />
                                                Product Usage
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-4xl font-bold text-black dark:text-white">
                                                        {usage ? usage.used : 0}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        of {usage && usage.limit ? usage.limit : '∞'} products used
                                                    </p>
                                                </div>
                                                {usage && usage.limit && (
                                                    <p className={`text-2xl font-bold ${isNearLimit ? 'text-black dark:text-white' : 'text-purple-700 dark:text-purple-400'}`}>
                                                        {Math.round(usagePercentage)}%
                                                    </p>
                                                )}
                                            </div>

                                            {usage && usage.limit && (
                                                <div className="space-y-2">
                                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${isNearLimit
                                                                ? 'bg-black dark:bg-white'
                                                                : 'bg-purple-700'
                                                                }`}
                                                            style={{ width: `${usagePercentage}%` }}
                                                        />
                                                    </div>
                                                    {isNearLimit && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            You're approaching your product limit
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {subscription.plan.product_limit === null && (
                                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                                                    <p className="text-sm text-purple-700 dark:text-purple-300">Unlimited products on your plan</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Plan Features */}
                                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-none">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg text-black dark:text-white flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-purple-700" />
                                                Plan Features
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {subscription.plan.features && subscription.plan.features.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {subscription.plan.features.map((feature, index) => (
                                                        <li key={index} className="flex items-start gap-3">
                                                            <CheckCircle2 className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                                                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    No feature details available for this plan.
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Payment History */}
                                <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-none">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-black dark:text-white flex items-center gap-2">
                                            <RefreshCw className="w-5 h-5 text-purple-700" />
                                            Payment History
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {payments.length === 0 ? (
                                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                                No payment history available.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {payments.map((payment) => (
                                                    <div
                                                        key={payment.id}
                                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border "
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'succeeded'
                                                                ? 'bg-purple-100 dark:bg-purple-900/30'
                                                                : 'bg-gray-100 dark:bg-gray-800'
                                                                }`}>
                                                                <CreditCard className={`w-5 h-5 ${payment.status === 'succeeded'
                                                                    ? 'text-purple-700 dark:text-purple-400'
                                                                    : 'text-gray-500 dark:text-gray-400'
                                                                    }`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-black dark:text-white">
                                                                    {payment.description || `Payment via ${getProviderLabel(payment.provider)}`}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {payment.paid_at ? formatDate(payment.paid_at) : 'Pending'}
                                                                    {' · '}
                                                                    <span className="uppercase">{payment.provider}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-black dark:text-white">
                                                                {formatCurrency(payment.amount, payment.currency)}
                                                            </p>
                                                            <Badge className={`text-xs ${payment.status === 'succeeded'
                                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                                }`}>
                                                                {payment.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-4">
                                    <Link href="/select-plan">
                                        <Button variant="outline" className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <ArrowUpRight className="w-4 h-4 mr-2" />
                                            Change Plan
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </SettingsPagesLayout>
    );
};

export default ManageSubscription;
