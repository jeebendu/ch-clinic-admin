import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL;

export const ReportSpeechService = {
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

      return await http.post(`${api}/v1/patient/report/speech/print/id/${id}`,  options);
    } catch (e) {
      console.error(e);
      throw new Error('Failed to get PDF');
    }
  },

  list: () => {
    return http.get(`${api}/v1/patient/report/speech/list`);
  },

  paginatedList: (pageNumber:any, pageSize:any, reportno:any, search:any) => {
    const searchPath = search ? `/${search}` : '';
    return http.get(`${api}/v1/patient/report/speech/list/${pageNumber}/${pageSize}/${reportno}${searchPath}`);
  },

  reportListByPatientId: (patientId:any, reportId:any) => {
    return http.get(`${api}/v1/patient/report/speech/patientId/${patientId}/reportId/${reportId}`);
  },

  deleteById: (id:number) => {
    return http.get(`${api}/v1/patient/report/speech/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${api}/v1/patient/report/speech/id/${id}`);
  },

  saveOrUpdate: (speechReport:any) => {
    return http.post(`${api}/v1/patient/report/speech/saveOrUpdate`, speechReport);
  },
};