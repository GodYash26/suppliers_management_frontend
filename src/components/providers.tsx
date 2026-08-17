'use client';

import React, { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { getErrorMessage } from '@/lib/api-error';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            // Only toast query errors if meta.suppressToast is not set to true
            if (!query.meta?.suppressToast) {
              const message = getErrorMessage(error);
              toast.error(message || 'Failed to fetch data');
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            // Only toast mutation errors if meta.suppressToast is not set to true
            if (!mutation.meta?.suppressToast) {
              const message = getErrorMessage(error);
              toast.error(message || 'Action failed');
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors closeButton />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
