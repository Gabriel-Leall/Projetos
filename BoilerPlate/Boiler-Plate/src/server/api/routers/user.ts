import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      },
      include: {
        subscriptions: true
      }
    });

    return user;
  }),
  
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          name: input.name
        }
      });

      return user;
    })
}); 