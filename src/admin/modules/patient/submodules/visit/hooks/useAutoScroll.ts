
import { useEffect, useRef, useCallback } from 'react';

interface UseAutoScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

/**
 * useAutoScroll
 * - Uses an IntersectionObserver on a bottom "sentinel" element.
 * - Automatically detects the nearest scrollable container for correct root.
 * - Prevents duplicate fetches while a request is in-flight.
 * - Returns a ref callback to assign to a sentinel element at the end of the list.
 */
export const useAutoScroll = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: UseAutoScrollProps) => {
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Find nearest scrollable parent to use as IntersectionObserver root
  const getScrollParent = (element: Element | null): Element | null => {
    let parent: HTMLElement | null = element?.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      const overflowY = style.overflowY;
      const canScroll = (overflowY === 'auto' || overflowY === 'scroll');
      if (canScroll && parent.scrollHeight > parent.clientHeight) {
        return parent;
      }
      parent = parent.parentElement;
    }
    // Fallback to viewport
    return null;
  };

  const loadMoreRef = useCallback((node: Element | null) => {
    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;

    const root = getScrollParent(node);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;

        // Guard conditions
        if (isLoadingRef.current || !hasNextPage || isFetchingNextPage) return;

        console.log('Sentinel intersecting - fetching next page');
        isLoadingRef.current = true;
        fetchNextPage();
      },
      {
        root, // auto-detected scroll container, or viewport
        rootMargin: '0px 0px 300px 0px', // start loading a bit before reaching bottom
        threshold: 0,
      }
    );

    observerRef.current.observe(node);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

