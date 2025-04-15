import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const AppointmentRequestService = {
  getApproveList: () => {
    return [
      {
        id: 1,
        name: "Approved",
      },
      {
        id: 0,
        name: "Not Approved",
      },
    ];
  },

  getStartOfMonth: () => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  },

  getLast7Days: () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    date.setHours(0, 0, 0, 0);
    return date;
  },

  getTodayDate: () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  },

  dateFilterList: () => {
    return [
      {
        id: AppointmentRequestService.getTodayDate(),
        name: "Today",
      },
      {
        id: AppointmentRequestService.getLast7Days(),
        name: "Last 7 days",
      },
      {
        id: AppointmentRequestService.getStartOfMonth(),
        name: "This Month",
      },
    ];
  },

  list: () => {
    return http.get(`${apiUrl}/v1/request/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/request/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/request/id/${id}`);
  },

  saveOrUpdate: (request: any) => {
    return http.post(`${apiUrl}/v1/request/saveOrUpdate`, request);
  },

  reSchedule: (request: any) => {
    return http.post(`${apiUrl}/v1/request/re-schedule`, request);
  },

  updateAcceptOrReject: (status: any, id: number) => {
    return http.post(`${apiUrl}/v1/request/status/id/${id}`, status);
  },

  filter: (pageNumber: number, pageSize: number, search: any) => {
    return http.post(`${apiUrl}/v1/request/filter/${pageNumber}/${pageSize}`, search);
  },
};

export default AppointmentRequestService;