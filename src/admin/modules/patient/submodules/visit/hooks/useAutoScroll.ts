
import { useEffect, useCallback } from "react";

export function useAutoScroll(
  loadMore: () => void, 
  isLoading: boolean, 
  hasMore: boolean
) {
  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    // Load more when user is 100px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      console.log('Auto-loading more visits...');
      loadMore();
    }
  }, [loadMore, isLoading, hasMore]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);
}

// Simple throttle function to prevent excessive scroll event firing
function throttle(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  
  return function (...args: any[]) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}
