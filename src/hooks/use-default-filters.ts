
import { useState, useEffect } from 'react';

export const useDefaultFilters = (isDefaultEnabled = true) => {
  const [showFilters, setShowFilters] = useState(isDefaultEnabled);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      setShowFilters(isDefaultEnabled);
      setHasInitialized(true);
    }
  }, [isDefaultEnabled, hasInitialized]);

  return {
    showFilters,
    setShowFilters,
  };
};
