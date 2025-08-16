
import { useEffect, useRef } from 'react';

interface UseAutoScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useAutoScroll = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: UseAutoScrollProps) => {
  const loadingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasNextPage || isFetchingNextPage) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.offsetHeight - 300;

      if (scrollPosition >= threshold) {
        loadingRef.current = true;
        fetchNextPage();
        
        // Reset loading flag after a delay
        setTimeout(() => {
          loadingRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
};
