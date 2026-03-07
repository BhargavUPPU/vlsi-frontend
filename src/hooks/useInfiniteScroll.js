import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for infinite scroll with React Query
 * @param {string} queryKey - Unique query key
 * @param {Function} queryFn - Function that fetches data, receives pageParam
 * @param {Object} options - Additional options
 * @returns {Object} - React Query result + observer ref
 */
export function useInfiniteScroll(queryKey, queryFn, options = {}) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
    initialPageParam = 1,
    getNextPageParam = (lastPage) => {
      if (!lastPage) return undefined;
      const { page, limit, total } = lastPage;
      const hasMore = page * limit < total;
      return hasMore ? page + 1 : undefined;
    },
    ...restOptions
  } = options;

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const result = useInfiniteQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: ({ pageParam = initialPageParam }) => queryFn(pageParam),
    getNextPageParam,
    initialPageParam,
    enabled,
    staleTime,
    cacheTime,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    ...restOptions,
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = result;

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px", // Load 200px before reaching bottom
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [handleObserver]);

  // Flatten all pages into single array
  const items = result.data?.pages?.flatMap((page) => page.data || []) || [];

  return {
    ...result,
    items,
    loadMoreRef,
    total: result.data?.pages?.[0]?.total || 0,
  };
}
