
import { useEffect, useRef, useCallback, RefObject } from 'react';

interface UseAutoScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  rootRef?: RefObject<HTMLElement | null>;
}

/**
 * useAutoScroll
 * - Uses an IntersectionObserver on a bottom "sentinel" element.
 * - Allows passing an explicit rootRef (scroll container). Falls back to auto-detect.
 * - Prevents duplicate fetches while a request is in-flight.
 * - Returns a ref callback to assign to a sentinel element at the end of the list.
 */
export const useAutoScroll = ({ hasNextPage, isFetchingNextPage, fetchNextPage, rootRef }: UseAutoScrollProps) => {
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Find nearest scrollable parent to use as IntersectionObserver root
  const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
    if (!element) return null;
    let parent: HTMLElement | null = element.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      const overflowY = style.overflowY;
      const canScroll = overflowY === 'auto' || overflowY === 'scroll';
      if (canScroll && parent.scrollHeight > parent.clientHeight) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  const loadMoreRef: React.RefCallback<HTMLDivElement> = useCallback((node: HTMLDivElement | null) => {
    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;

    // Prefer explicit rootRef if provided and current
    const explicitRoot = rootRef?.current as HTMLElement | null | undefined;
    const root = explicitRoot ?? getScrollParent(node);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first || !first.isIntersecting) return;

        // Guard conditions
        if (isLoadingRef.current || !hasNextPage || isFetchingNextPage) return;

        isLoadingRef.current = true;
        fetchNextPage();
      },
      {
        root: (root as Element | null) ?? null, // auto-detected scroll container, or viewport
        rootMargin: '0px 0px 200px 0px', // trigger a bit earlier
        threshold: 0,
      }
    );

    observerRef.current.observe(node);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootRef]);

  // Reset loading flag when fetching completes
  useEffect(() => {
    if (!isFetchingNextPage) {
      isLoadingRef.current = false;
    }
  }, [isFetchingNextPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { loadMoreRef };
};
