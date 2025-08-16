
import { useEffect, useRef, useState } from 'react';

interface UseAutoScrollOptions {
  enabled: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  scrollAmount?: number;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  loadingMore?: boolean;
}

export const useAutoScroll = ({
  enabled = false,
  interval = 3000,
  pauseOnHover = true,
  scrollAmount = 100,
  onLoadMore,
  hasNextPage = false,
  loadingMore = false
}: UseAutoScrollOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToNext = () => {
    if (!containerRef.current || isPaused) return;

    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Check if near bottom and can load more
    if (scrollTop + clientHeight >= scrollHeight - 200 && hasNextPage && !loadingMore && onLoadMore) {
      onLoadMore();
      return;
    }
    
    // If at bottom, scroll to top
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll down by specified amount
      container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto scroll effect
  useEffect(() => {
    if (enabled && !isPaused) {
      intervalRef.current = setInterval(scrollToNext, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isPaused, interval, scrollAmount, hasNextPage, loadingMore]);

  // Handle pause on hover
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pauseOnHover) return;

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pauseOnHover]);

  return {
    containerRef,
    isPaused
  };
};
