import http from "@/lib/JwtInterceptor";

const StatusService = {

  list: async()=> {
    const response = await http.get<any>("/v1/status/list");
    return response.data;
  },

};

export default StatusService;