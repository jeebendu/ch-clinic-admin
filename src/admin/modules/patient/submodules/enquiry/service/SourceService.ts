import http from "@/lib/JwtInterceptor";

const SourceService = {

  list: async()=> {
    const response = await http.get<any>("/api/source/list");
    return response.data;
  },

};

export default SourceService;