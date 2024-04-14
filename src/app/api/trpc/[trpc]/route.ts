import { appRouter } from '@/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) => {
  fetchRequestHandler({
    req,
    endpoint: '/api/trpc',
    router: appRouter,
    // @ts-expect-error context already passed from expres middleware
    createContext: () => ({})
  });
};

export { handler as GET, handler as POST };
