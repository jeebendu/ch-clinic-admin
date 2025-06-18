
export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_DEMO_MODE === 'true' || false;
};

export const getApiUrl = (): string => {
  return import.meta.env.VITE_BASE_URL || '';
};

export const getEnvVariable = (key: string): string => {
  switch (key) {
    case 'API_URL':
      return import.meta.env.VITE_API_URL || '';
    case 'BASE_URL':
      return import.meta.env.VITE_BASE_URL || '';
    case 'DEFAULT_TENANT':
      return import.meta.env.VITE_DEFAULT_TENANT || 'default';
    default:
      return import.meta.env[`VITE_${key}`] || '';
  }
};
