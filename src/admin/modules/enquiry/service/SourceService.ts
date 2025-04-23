import http from "@/lib/JwtInterceptor";
import { Source } from "../../user/types/Source";

const SourceService = {

  list: async()=> {
    const response = await http.get<any>("/v1/source/list");
    return response.data;
  },

};

export default SourceService;