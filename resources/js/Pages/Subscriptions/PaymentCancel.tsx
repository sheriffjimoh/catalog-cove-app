import { Head, Link } from '@inertiajs/react';
import React from 'react';

const PaymentCancel: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Head title="Payment Cancelled" />
            <div className="bg-white rounded-2xl border border-gray-200 p-10 w-full max-w-md text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-black">Payment Cancelled</h2>
                <p className="mb-6 text-gray-500">
                    Your payment was cancelled. No charges were made. You can try again whenever you're ready.
                </p>
                <Link
                    href="/select-plan"
                    className="inline-block w-full py-3 px-6 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition-colors"
                >
                    Back to Plans
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancel;
