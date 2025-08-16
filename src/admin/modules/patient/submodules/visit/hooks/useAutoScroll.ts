
import { useEffect, useRef } from 'react';

interface UseAutoScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useAutoScroll = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: UseAutoScrollProps) => {
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Prevent multiple simultaneous requests
      if (isLoadingRef.current || !hasNextPage || isFetchingNextPage) {
        return;
      }

      // Get scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate if we're near the bottom (within 200px)
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 200;

      if (isNearBottom) {
        console.log('Near bottom - fetching next page');
        isLoadingRef.current = true;
        fetchNextPage();
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset loading flag when fetching completes
  useEffect(() => {
    if (!isFetchingNextPage) {
      isLoadingRef.current = false;
    }
  }, [isFetchingNextPage]);
};
