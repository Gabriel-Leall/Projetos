"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { redirect } from "next/navigation";

export default function PricingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();

  const handleSubscribe = async () => {
    if (!session) {
      return redirect("/login");
    }

    setIsLoading(true);
    
    try {
      const result = await createCheckoutSession.mutateAsync({
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "price_fake",
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      });
      
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">Pricing Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="border rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Free</h2>
          <p className="text-3xl font-bold mb-6">$0 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
          <ul className="mb-8 space-y-2 flex-grow">
            <li>• Basic features</li>
            <li>• Limited storage</li>
            <li>• Email support</li>
          </ul>
          <Button variant="outline" className="w-full" disabled>Current Plan</Button>
        </div>
        
        {/* Pro Plan */}
        <div className="border rounded-lg p-6 flex flex-col relative bg-primary/5">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-3 text-xs rounded-bl-lg rounded-tr-lg font-semibold">
            POPULAR
          </div>
          <h2 className="text-xl font-bold mb-4">Pro</h2>
          <p className="text-3xl font-bold mb-6">$9 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
          <ul className="mb-8 space-y-2 flex-grow">
            <li>• All Free features</li>
            <li>• Advanced analytics</li>
            <li>• Priority support</li>
            <li>• 10GB storage</li>
          </ul>
          <Button className="w-full" onClick={handleSubscribe} disabled={isLoading}>
            {isLoading ? "Processing..." : "Subscribe"}
          </Button>
        </div>
        
        {/* Enterprise Plan */}
        <div className="border rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Enterprise</h2>
          <p className="text-3xl font-bold mb-6">$29 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
          <ul className="mb-8 space-y-2 flex-grow">
            <li>• All Pro features</li>
            <li>• Unlimited storage</li>
            <li>• Dedicated support</li>
            <li>• Custom integrations</li>
            <li>• SSO Authentication</li>
          </ul>
          <Button variant="outline" className="w-full" onClick={() => window.open("mailto:sales@example.com")}>
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
} 