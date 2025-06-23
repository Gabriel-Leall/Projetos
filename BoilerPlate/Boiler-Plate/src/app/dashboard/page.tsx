"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { data: userData, isLoading } = trpc.user.getCurrent.useQuery(undefined, {
    enabled: !!session,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {session?.user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {session?.user.email}
            </p>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
          <div className="space-y-2">
            {userData?.subscriptions && userData.subscriptions.length > 0 ? (
              <div>
                <p className="font-medium text-green-600">Active Subscription</p>
                <p>
                  Renews on:{" "}
                  {new Date(
                    userData.subscriptions[0].stripeCurrentPeriodEnd
                  ).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-yellow-600">No Active Subscription</p>
                <Button className="mt-4" asChild>
                  <a href="/pricing">View Plans</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 