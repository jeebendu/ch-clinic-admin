import { useQuery } from "@tanstack/react-query";
import { Tenant } from "@/admin/modules/core/types/Tenant";
import TenantService from "@/admin/modules/core/services/tenant/tenantService";
import { getTenantId } from "@/utils/tenantUtils";
import { useEffect } from "react";

// Separate function to handle document title and favicon updates
const updateDocumentInfo = (data: Tenant) => {
  if (!data) return;

  if (data.info) {
    alert(data.info); // Replace with custom UI message if needed
    document.title = "Clinic SaaS Portal - Error";
  } else {
    if (data.title) document.title = data.title;

    if (data.favIcon) {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) favicon.setAttribute("href", data.favIcon);
    }
  }
};

export const useTenant = () => {
  const tenantId = getTenantId();

  const query = useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: () => TenantService.getPublicInfo(tenantId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Update document title and favicon whenever tenant info changes
  useEffect(() => {
    if (query.data) {
      updateDocumentInfo(query.data);
    }
  }, [query.data]);

  return {
    tenant: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};