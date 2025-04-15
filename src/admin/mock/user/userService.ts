import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const UserService = {
  paginatedList: (pageNumber:any, pageSize:any, search:any) => {
    const url = `${apiUrl}/v1/staff/list/${pageNumber}/${pageSize}${search ? '/' + search : ''}`;
    return http.get(url);
  },

  getStaff: () => {
    return http.get(`${apiUrl}/v1/users/getstaff`);
  },

  list: () => {
    return http.get(`${apiUrl}/v1/staff/list`);
  },

  deleteById: (id:number) => {
    return http.get(`${apiUrl}/v1/staff/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${apiUrl}/v1/staff/id/${id}`);
  },

  saveOrUpdate: (staff:any) => {
    return http.post(`${apiUrl}/v1/staff/saveOrUpdate`, staff);
  },

  filter: (pageNumber:any, pageSize:any, search:any) => {
    const url = `${apiUrl}/v1/staff/filter/${pageNumber}/${pageSize}`;
    return http.post(url, search);
  },

  getStatus: () => {
    return [
      { id: '1', name: 'Active' },
      { id: '2', name: 'Inactive' },
    ];
  },
};

export default UserService;