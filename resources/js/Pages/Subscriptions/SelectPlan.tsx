import React, { useState } from 'react';
import { useForm } from "@inertiajs/react";

interface PlanPricing {
    currency: string;
    monthly_price: number;
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

const SelectPlan: React.FC<Props> = ({ plans }) => {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

    const { post } = useForm({
        plan_id: selectedPlan,
        interval: interval,
    });



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;

       post(route('plans.select.submit'), {
            preserveScroll: true,
            onSuccess: (page) => {
                const redirect = (page as any)?.props?.redirect;
                if (redirect) {
                    window.location.href = redirect;
                }
            }
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Select a Plan</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {plans.map(plan => (
                        <div key={plan.id} className="border p-4 rounded">
                            <h2 className="text-xl font-semibold">{plan.name}</h2>
                            <p className="mb-2">{plan.description}</p>
                            <div className="mb-2">
                                {plan.pricing.map(price => (
                                    <div key={price.currency}>
                                        {price.currency} {price.monthly_price} / month
                                    </div>
                                ))}
                            </div>
                            <label className="inline-flex items-center mt-2">
                                <input
                                    type="radio"
                                    name="plan_id"
                                    value={plan.id}
                                    onChange={() => setSelectedPlan(plan.id)}
                                    required
                                    className="mr-2"
                                />
                                Select
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <label className="mr-2">Interval:</label>
                    <select value={interval} onChange={e => setInterval(e.target.value as any)} className="border p-1 rounded">
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Continue
                </button>
            </form>
        </div>
    );
};

export default SelectPlan;
