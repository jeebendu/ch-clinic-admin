
/**
 * Check if the application is running in production mode
 * based on the VITE_PRODUCTION environment variable
 */
export const isProduction = (): boolean => {
  return import.meta.env.VITE_PRODUCTION === 'true';
};

/**
 * Get environment variable from import.meta.env
 * @param key The name of the environment variable
 * @returns The value of the environment variable or empty string if not found
 */
export const getEnvVariable = (key: string): string => {
  return (import.meta.env[`VITE_${key}`] as string) || '';
};
