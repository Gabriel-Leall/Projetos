import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { authRouter } from "./routers/auth";
import { stripeRouter } from "./routers/stripe";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter; 