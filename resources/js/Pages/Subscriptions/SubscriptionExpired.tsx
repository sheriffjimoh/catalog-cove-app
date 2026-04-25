import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShieldOff, ArrowRight, Clock } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    subscription?: {
        plan_name: string;
        expired_at: string;
    } | null;
}

const SubscriptionExpired: React.FC<Props> = ({ subscription }) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Subscription Expired" />
            <div className="min-h-screen bg-slate-50 dark:bg-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-lg text-center">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-10">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldOff className="w-10 h-10 text-black dark:text-white" />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-black dark:text-white mb-3">
                            Your Subscription Has Expired
                        </h1>

                        {/* Details */}
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Your access to the dashboard and product management features has been paused.
                            Renew your subscription to continue using all features.
                        </p>

                        {subscription && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 flex items-center justify-center gap-3">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">{subscription.plan_name}</span> plan expired on{' '}
                                    <span className="font-medium">{formatDate(subscription.expired_at)}</span>
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <Link
                            href="/select-plan"
                            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition-colors"
                        >
                            Renew Subscription
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <Link
                            href="/subscription"
                            className="inline-block mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
                        >
                            View subscription details →
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SubscriptionExpired;
