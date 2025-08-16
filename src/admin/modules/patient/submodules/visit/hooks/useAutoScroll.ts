
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
    if (!element) return null;
    
    let parent: HTMLElement | null = element.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      const overflowY = style.overflowY;
      const canScroll = (overflowY === 'auto' || overflowY === 'scroll');
      
      console.log('Checking parent:', parent.tagName, {
        overflowY,
        canScroll,
        scrollHeight: parent.scrollHeight,
        clientHeight: parent.clientHeight
      });
      
      if (canScroll && parent.scrollHeight > parent.clientHeight) {
        console.log('Found scrollable parent:', parent.tagName);
        return parent;
      }
      parent = parent.parentElement;
    }
    console.log('No scrollable parent found, using viewport');
    return null;
  };

  const loadMoreRef = useCallback((node: Element | null) => {
    console.log('loadMoreRef callback called with node:', node);
    
    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    
    if (!node) {
      console.log('No node provided to loadMoreRef');
      return;
    }

    const root = getScrollParent(node);
    console.log('Using root for IntersectionObserver:', root);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        console.log('IntersectionObserver entries:', entries);
        const first = entries[0];
        
        if (!first) {
          console.log('No intersection entry found');
          return;
        }
        
        console.log('Intersection entry:', {
          isIntersecting: first.isIntersecting,
          intersectionRatio: first.intersectionRatio,
          boundingClientRect: first.boundingClientRect,
          rootBounds: first.rootBounds
        });
        
        if (!first.isIntersecting) {
          console.log('Sentinel not intersecting');
          return;
        }

        // Guard conditions
        console.log('Guard conditions check:', {
          isLoadingRef: isLoadingRef.current,
          hasNextPage,
          isFetchingNextPage
        });
        
        if (isLoadingRef.current || !hasNextPage || isFetchingNextPage) {
          console.log('Guard conditions failed - not fetching');
          return;
        }

        console.log('✅ Sentinel intersecting - fetching next page');
        isLoadingRef.current = true;
        fetchNextPage();
      },
      {
        root, // auto-detected scroll container, or viewport
        rootMargin: '0px 0px 100px 0px', // reduced margin for more reliable triggering
        threshold: 0,
      }
    );

    console.log('Starting to observe sentinel element');
    observerRef.current.observe(node);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset loading flag when fetching completes
  useEffect(() => {
    if (!isFetchingNextPage) {
      console.log('Fetch completed, resetting loading flag');
      isLoadingRef.current = false;
    }
  }, [isFetchingNextPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up IntersectionObserver');
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { loadMoreRef };
};
