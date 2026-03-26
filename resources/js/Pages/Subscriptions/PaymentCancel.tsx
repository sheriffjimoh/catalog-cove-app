import { Head, Link } from '@inertiajs/react';
import React from 'react';

const PaymentCancel: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50">
            <Head title="Payment Cancelled" />
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Payment Cancelled</h2>
                <p className="mb-6 text-slate-600">
                    Your payment was cancelled. No charges were made. You can try again whenever you're ready.
                </p>
                <Link
                    href="/select-plan"
                    className="inline-block w-full py-3 px-6 bg-gradient-to-r from-purple-700 to-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    Back to Plans
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancel;
