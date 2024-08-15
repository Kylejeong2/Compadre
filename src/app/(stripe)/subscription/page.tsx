import React from 'react';
import { storeSubscriptionPlans } from '@/configs/stripe';
import PlanCard from '@/components/Plans/PlanCard';
import { auth } from '@clerk/nextjs/server';
import useSubscriptions from '@/hooks/useSubscriptions';

const SubscriptionPage = async () => {
    const subscriptionPlan = await useSubscriptions();
    const session = await auth();

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-24">
            <h1 className="text-3xl font-bold mb-8">Choose a Subscription Plan</h1>
            <div className="flex w-full gap-3">
                {storeSubscriptionPlans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        session={session}
                        subscriptionPlan={subscriptionPlan}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;