"use client"

import React from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/Common/Button"
import { Separator } from "@/components/Common/Separator"
import useSubscriptions from "@/hooks/getSubscriptionData"
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Loader2 } from "lucide-react"

const ProfilePage = ({ params: { id } }: { params: { id: string } }) => {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { subscription, loading, error } = useSubscriptions()
  const router = useRouter()

  const handleCancelSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) {
      console.error('No active subscription found');
      toast.error('No active subscription found');
      return;
    }

    // Add confirmation popup
    const isConfirmed = confirm('Are you sure you want to cancel your subscription? This action cannot be undone.');
    
    if (!isConfirmed) {
      return; // User cancelled the action
    }

    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId: subscription.stripeSubscriptionId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Show a success message to the user
          toast.success('Subscription cancelled successfully');
          // Redirect to the profile page
          router.push(`/dashboard/profile/${user?.id}`);
          window.location.reload()
        } else {
          // Handle any errors returned from the API
          toast.error(data.error || 'Failed to cancel subscription');
        }
      } else {
        // Handle non-OK responses
        const errorData = await response.json();
        console.error('Error cancelling subscription:', errorData);
        toast.error(errorData.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('An unexpected error occurred');
    }
  }

  const handleSignOut = () => {
    signOut()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Account Profile</h1>
        <div className="bg-card text-card-foreground p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
          <p className="mb-2">Name: {user?.firstName} {user?.lastName}</p>
          <p className="mb-4">Email: {user?.primaryEmailAddress?.emailAddress}</p>

          <Separator className="my-6" />

          <h2 className="text-2xl font-semibold mb-4">Subscription Details</h2>
          {subscription ? (
            <>
              <p className="mb-2">Current Plan: <span className="font-medium">{subscription.subscriptionName}</span></p>
              {subscription.subscriptionCancelAt && (
                <p className="mb-2">Ending on: <span className="font-medium">{new Date(subscription.subscriptionCancelAt).toLocaleDateString()}</span></p>
              )}
              <p className="mb-2">Billing Period: <span className="font-medium">{subscription.isYearly ? 'Yearly' : 'Monthly'}</span></p>
              <p className="mb-4">Next Billing Date: <span className="font-medium">{new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}</span></p>
              {subscription && subscription.stripeSubscriptionId && !subscription.isCanceled && (
                <Button onClick={handleCancelSubscription} variant="outline" className="mt-4 bg-red-600 hover:bg-red-700">
                  Cancel Subscription
                </Button>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">You are not currently subscribed to any plan.</p>
          )}

          <Separator className="my-6" />

          <Button onClick={handleSignOut} variant="destructive" className="mt-4">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage