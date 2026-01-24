"use client";

import {
  QueryClient,
  QueryClientProvider as ReactQueryProvider,
} from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 3 * 60 * 1000, // 3 minutes - reduced API calls
            cacheTime: 10 * 60 * 1000, // 10 minutes - keep data in cache longer
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: false, // Don't refetch on reconnect
            retry: 2, // Retry failed requests twice
            refetchOnMount: false, // Don't refetch on component mount if cache is available
          },
          mutations: {
            retry: 1, // Retry mutations once
          },
        },
      }),
  );

  return (
    <ReactQueryProvider client={queryClient}>{children}</ReactQueryProvider>
  );
}
