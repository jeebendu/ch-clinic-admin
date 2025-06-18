
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
      if (query.data.info) {
        // Handle error/info message returned by backend
        alert(query.data.info); // Or show a custom UI message component instead of alert
        // Optionally, you can also set a fallback page title or favicon here:
        document.title = 'Clinic SaaS Portal - Error';
      } else {
        // Normal flow: update page title and favicon
        if (query.data.title) {
          document.title = query.data.title;
        }
        
        if (query.data.favIcon) {
          const favicon = document.querySelector('link[rel="icon"]');
          if (favicon) {
            favicon.setAttribute('href', query.data.favIcon);
          }
        }
      }
    }
  }, [query.data]);
  
  return {
    tenant: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
