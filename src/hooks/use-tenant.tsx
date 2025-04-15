
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "@/admin/modules/core/types/Tenant";
import TenantService from "@/admin/modules/core/services/tenant/tenantService";
import { getTenantId } from "@/utils/tenantUtils";
import { useEffect } from "react";

export const useTenant = () => {
  const tenantId = getTenantId();
  
  const query = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => TenantService.getPublicInfo(tenantId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Update document title and favicon when tenant info loads
  useEffect(() => {
    if (query.data) {
      // Update page title
      document.title = query.data.title;
      
      // Update favicon if needed
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon && query.data.favIcon) {
        favicon.setAttribute('href', query.data.favIcon);
      }
    }
  }, [query.data]);
  
  return {
    tenant: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
