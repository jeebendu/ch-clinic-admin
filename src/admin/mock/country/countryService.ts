import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const CountryService = {
  list: () => {
    return http.get(`${apiUrl}/v1/country/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/country/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/country/id/${id}`);
  },

  saveOrUpdate: (country: any) => {
    return http.post(`${apiUrl}/v1/country/saveOrUpdate`, country);
  },

  paginatedList: (pageNumber: number, pageSize: number, search: string) => {
    const url = `${apiUrl}/v1/country/list/${pageNumber}/${pageSize}${search ? '/' + search : ''}`;
    return http.get(url);
  },
};

export default CountryService;