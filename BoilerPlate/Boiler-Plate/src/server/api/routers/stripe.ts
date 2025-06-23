import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createStripeCustomer,
  createStripeCustomerSubscriptionPaymentCheckout,
  cancelStripeSubscription,
} from "@/lib/stripe";

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { priceId, successUrl, cancelUrl } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // If user doesn't have a Stripe customer ID, create one
      if (!user.stripeCustomerId) {
        const customer = await createStripeCustomer({
          email: user.email!,
          name: user.name || undefined,
        });

        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id },
        });

        user.stripeCustomerId = customer.id;
      }

      const checkoutSession = await createStripeCustomerSubscriptionPaymentCheckout({
        priceId,
        customerId: user.stripeCustomerId,
        successUrl,
        cancelUrl,
      });

      return { checkoutUrl: checkoutSession.url };
    }),

  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { subscriptionId } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { subscriptions: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const subscription = user.subscriptions.find(
        (sub: { stripeSubscriptionId: string }) => sub.stripeSubscriptionId === subscriptionId
      );

      if (!subscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      await cancelStripeSubscription(subscriptionId);

      await ctx.prisma.subscription.delete({
        where: { id: subscription.id },
      });

      return { success: true };
    }),
}); 