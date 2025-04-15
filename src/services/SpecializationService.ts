
import http from "@/lib/JwtInterceptor";

export const fetchAllSpecializations = async () => {
  return await http.get('/v1/specializations');
};

export const fetchLanguageList = async () => {
  return await http.get('/v1/languages');
};
