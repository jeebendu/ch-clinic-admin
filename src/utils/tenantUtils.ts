
import { getEnvVariable } from "./envUtils";

/**
 * Gets the tenant ID from the subdomain or returns the default
 */
export const getTenantId = (): string => {
  const defaultTenant = getEnvVariable('DEFAULT_TENANT');
  
  // In a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check if running locally or on specific domains
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        !hostname.endsWith('clinichub.care')) {
      return defaultTenant;
    }
    
    // Extract subdomain
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts[0];
    }
  }
  
  // Return default if subdomain not found
  return defaultTenant;
};

/**
 * Gets the file URL for tenant assets
 */
export const getTenantFileUrl = (fileName: string, type: 'logo' | 'favicon' | 'banner'): string => {
  if (!fileName) return '';
  return `${getEnvVariable('BASE_URL')}/tenants/public/download?fileName=${fileName}&type=${type}`;
};
