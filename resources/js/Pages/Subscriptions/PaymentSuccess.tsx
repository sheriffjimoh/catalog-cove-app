import { Head, Link } from '@inertiajs/react';
import React from 'react';

const PaymentSuccess: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50">
            <Head title="Payment Successful" />
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Payment Successful!</h2>
                <p className="mb-6 text-slate-600">
                    Your subscription has been activated. You can now access all the features of your plan.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-block w-full py-3 px-6 bg-gradient-to-r from-purple-700 to-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
