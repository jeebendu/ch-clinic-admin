import http from "@/lib/JwtInterceptor";

const RelationshipService = {

  list: async()=> {
    const response = await http.get<any>("/v1/relationship/list");
    return response.data;
  },

};

export default RelationshipService;