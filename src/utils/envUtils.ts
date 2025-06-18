
export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_DEMO_MODE === 'true' || false;
};

export const getApiUrl = (): string => {
  return import.meta.env.VITE_BASE_URL || '';
};
