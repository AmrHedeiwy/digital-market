import { z } from 'zod';
import { authRouter } from './authRouter';
import { publicProcedure, router } from './trpc';
import { QueryValidator } from '../lib/validators/query-validator';
import { getPayloadClient } from '../get-payload';

export const appRouter = router({
  auth: authRouter,
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        query: QueryValidator
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;

      const { sort, limit, ...queryOptions } = query;

      const payload = await getPayloadClient();

      const parsedQueryOpts: Record<string, { equals: string }> = {};

      Object.entries(queryOptions).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value
        };
      });

      const page = cursor || 1;

      const {
        docs: items,
        hasNextPage,
        nextPage
      } = await payload.find({
        collection: 'products',
        where: {
          approvedForSale: {
            equals: 'approved'
          },
          ...parsedQueryOpts
        },
        sort,
        limit,
        depth: 1,
        page
      });

      return {
        items,
        nextPage: hasNextPage ? nextPage : null
      };
    })
});

export type AppRouter = typeof appRouter;
