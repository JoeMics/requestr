import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const requestsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.request.findMany({ include: {
      user: true
    } });
  }),

  createRequest: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      return await ctx.prisma.request.create({
        data: {
          message: input.message,
          userId: user.id,
        },
      });
    }),

  deleteRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.request.delete({ where: { id: input } });
    }),
});
