import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

const LoginHistoryService = {
    filter: (pageNumber: number, pageSize: number, search: any) => {
        const url = `${apiUrl}/v1/login/filter/${pageNumber}/${pageSize}`;
        return http.post(url, search);
    },
};
export default LoginHistoryService;