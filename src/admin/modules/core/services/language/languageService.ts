import http from "@/lib/JwtInterceptor";

const languageService = {
  list: () => {
    return http.get(`/v1/language/list`);
  },

  
};

export default languageService;