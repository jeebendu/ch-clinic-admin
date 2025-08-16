
import React, { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import VisitService from "../services/visitService";

type Visit = {
  id: string | number;
  patientName: string;
  doctorName: string;
  visitDate: string;
  status: string;
  // ... add more fields if needed for UI
};

type PaginatedVisits = {
  content: Visit[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

type InfiniteVisitListProps = {
  searchTerm?: string;
  pageSize?: number;
  className?: string;
};

const InfiniteVisitList: React.FC<InfiniteVisitListProps> = ({
  searchTerm = "",
  pageSize = 20,
  className = "",
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const queryKey = useMemo(() => ["visits", "infinite", { searchTerm, pageSize }], [searchTerm, pageSize]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery<PaginatedVisits>({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      console.log("[VisitList] fetching page:", pageParam, "search:", searchTerm);
      // Use the service helper which normalizes the API response
      const resp = await VisitService.getAllVisits(pageParam as number, pageSize, searchTerm);
      return resp;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // lastPage.number is zero-based; move to next if hasNext is true
      const next = lastPage?.hasNext ? lastPage.number + 1 : undefined;
      console.log("[VisitList] getNextPageParam ->", next, { lastPage });
      return next;
    },
    // Refetch on searchTerm change
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    meta: {
      onError: (err: unknown) => {
        console.error("[VisitList] query error:", err);
      },
    },
  });

  // Setup IntersectionObserver for auto-fetch
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          console.log("[VisitList] sentinel intersecting; hasNextPage:", hasNextPage, "isFetchingNextPage:", isFetchingNextPage);
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }
      },
      {
        root: null, // viewport scroll
        rootMargin: "200px 0px", // prefetch a bit earlier
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten content
  const visits: Visit[] = useMemo(() => {
    const all = data?.pages?.flatMap((p) => p.content || []) ?? [];
    return all;
  }, [data]);

  if (isLoading) {
    return (
      <div className={`w-full flex items-center justify-center py-10 ${className}`}>
        <span className="text-muted-foreground">Loading visits...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`w-full flex flex-col items-center justify-center gap-2 py-10 ${className}`}>
        <div className="text-destructive">Failed to load visits.</div>
        <button
          className="px-3 py-1.5 rounded-md border text-sm hover:bg-accent"
          onClick={() => refetch()}
        >
          Retry
        </button>
        <pre className="text-xs opacity-60">{String((error as Error)?.message ?? error)}</pre>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* List */}
      <ul className="divide-y rounded-md border bg-card">
        {visits.map((v) => (
          <li key={v.id} className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="font-medium">{v.patientName}</div>
              <div className="text-sm text-muted-foreground">
                {v.doctorName} • {new Date(v.visitDate).toLocaleString()}
              </div>
            </div>
            <span className="px-2 py-1 rounded-md text-xs border bg-secondary/40">{v.status}</span>
          </li>
        ))}
        {visits.length === 0 && !isFetching && (
          <li className="p-6 text-center text-muted-foreground">No visits found</li>
        )}
      </ul>

      {/* Load More state and manual fallback */}
      <div className="flex items-center justify-center py-4">
        {isFetchingNextPage ? (
          <span className="text-sm text-muted-foreground">Loading more...</span>
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-accent"
          >
            Load more
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">No more results</span>
        )}
      </div>

      {/* Sentinel for IntersectionObserver */}
      <div ref={sentinelRef} className="h-1 w-full" />
    </div>
  );
};

export default InfiniteVisitList;
