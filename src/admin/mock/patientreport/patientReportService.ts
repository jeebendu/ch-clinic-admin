import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL;

export const PatientReportService = {
  saveAndPrintPdf: async (id:number) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      const options = {
        headers: headers,
        responseType: 'arraybuffer',
      };

      return await http.post(`${api}/v1/patient/report/print/id/${id}`, options);
    } catch (e) {
      console.error(e);
      throw new Error('Failed to get PDF');
    }
  },

  list: () => {
    return http.get(`${api}/v1/patient/report/list`);
  },

  paginatedList: (pageNumber:any, pageSize:any, reportno:any, search:any) => {
    const searchPath = search ? `/${search}` : '';
    return http.get(`${api}/v1/patient/report/list/${pageNumber}/${pageSize}/${reportno}${searchPath}`);
  },

  reportListByPatientId: (patientId:any, reportId:any) => {
    return http.get(`${api}/v1/patient/report/patientId/${patientId}/reportId/${reportId}`);
  },

  deleteById: (id:number) => {
    return http.get(`${api}/v1/patient/report/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${api}/v1/patient/report/id/${id}`);
  },

  saveOrUpdate: (patientReport:any) => {
    return http.post(`${api}/v1/patient/report/saveOrUpdate`, patientReport);
  },
};