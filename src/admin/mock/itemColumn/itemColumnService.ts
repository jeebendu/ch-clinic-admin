import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const ItemColumnService = {
  columnPositionNo: () => {
    return [
      { id: 1, name: 1 }, { id: 2, name: 2 }, { id: 3, name: 3 }, { id: 4, name: 4 }, { id: 5, name: 5 },
      { id: 6, name: 6 }, { id: 7, name: 7 }, { id: 8, name: 8 }, { id: 9, name: 9 }, { id: 10, name: 10 },
      { id: 11, name: 11 }, { id: 12, name: 12 }, { id: 13, name: 13 }, { id: 14, name: 14 }, { id: 15, name: 15 },
      { id: 16, name: 16 }
    ];
  },

  list: () => {
    return http.get(`${apiUrl}/v1/item-position/list`);
  },

  deleteAllByVendorId: (id: number) => {
    return http.get(`${apiUrl}/v1/item-position/delete/all/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/item-position/id/${id}`);
  },

  saveOrUpdate: (itemColumn: any) => {
    return http.post(`${apiUrl}/v1/item-position/saveOrUpdate`, itemColumn);
  },

  getByVendorId: (id: number) => {
    return http.get(`${apiUrl}/v1/item-position/vendor/id/${id}`);
  },
};

export default ItemColumnService;