import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

const LoginHistoryService = {

    filter: (pageNumber:any, pageSize:any, search:any) => {
        const url = `${apiUrl}/v1/login/filter/${0}/${10}`;
        return http.post(url, search);
      },
};
export default LoginHistoryService;