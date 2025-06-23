import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

// We'll import and use Prisma only in the actual execution context, not during build
// import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    // Import prisma dynamically only when needed
    const { prisma } = await import("@/lib/db");

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription from Stripe
      const subscriptionResponse = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
      
      // Cast to access the needed properties
      const subscription = subscriptionResponse as unknown as {
        id: string;
        customer: string;
        items: { data: [{ price: { id: string } }] };
        current_period_end: number;
      };

    // Update the user with the subscription data
    await prisma.subscription.create({
      data: {
        userId: session.client_reference_id || session.customer as string,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // Handle the invoice.payment_succeeded event for subscription renewals
  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription from Stripe
      const subscriptionResponse = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
      
      // Cast to access the needed properties
      const subscription = subscriptionResponse as unknown as {
        id: string;
        items: { data: [{ price: { id: string } }] };
        current_period_end: number;
      };

    // Update the subscription with new period end date
    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
    }
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook error processing", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
} 