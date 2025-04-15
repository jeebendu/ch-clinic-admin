
import http from "@/lib/JwtInterceptor";
import { Tenant } from "../../types/Tenant";

const TenantService = {
  getPublicInfo: (tenantId: string): Promise<Tenant> => {
    return http.get(`/tenants/public/info/${tenantId}`).then(response => response.data);
  }
};

export default TenantService;
