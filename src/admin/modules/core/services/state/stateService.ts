import http from "@/lib/JwtInterceptor";
import { State } from "../../types/State";



const StateService = {
  list: () => {
    return http.get(`/v1/state/list`);
  },

  deleteById: (id: number) => {
    return http.get(`/v1/state/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`/v1/state/id/${id}`);
  },

  saveOrUpdate: (state: State) => {
    return http.post(`/v1/state/saveOrUpdate`, state);
  },

  listByCountryId: (countryId: number) => {
    return http.get(`/v1/state/listByCountryId/${countryId}`);
  },
};

export default StateService;