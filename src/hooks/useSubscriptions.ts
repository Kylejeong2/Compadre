import { auth } from "@clerk/nextjs/server";
import { clerk } from "@/configs/clerk-server";
import { storeSubscriptionPlans, stripe } from "@/configs/stripe";

const useSubscriptions = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found.");
  }

  const user = await clerk.users.getUser(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as string | undefined;
  const stripePriceId = user.privateMetadata.stripePriceId as string | undefined;
  const stripeSubscriptionId = user.privateMetadata.stripeSubscriptionId as string | undefined;
  const stripeCurrentPeriodEnd = user.privateMetadata.stripeCurrentPeriodEnd as string | undefined;

  const isSubscribed = stripePriceId && stripeCurrentPeriodEnd && new Date(stripeCurrentPeriodEnd).getTime() + 86_400_000 > Date.now();

  const plan = isSubscribed
    ? storeSubscriptionPlans.find(
        (plan) => plan.stripePriceId === stripePriceId
      )
    : null;

  let isCanceled = false;
  if (isSubscribed && stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    stripeSubscriptionId,
    stripeCurrentPeriodEnd,
    stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
};

export default useSubscriptions;