import http from "@/lib/JwtInterceptor";

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface Dental {
  id: number;
  name: string;
}

class DentalService {
  list() {
    return http.get(`${api}/v1/dental/list`);
  }

  deleteById(id: number) {
    return http.get(`${api}/v1/dental/delete/id/${id}`);
  }

  listByPID(id: number) {
    return http.get(`${api}/v1/dental/list/PID/${id}`);
  }

  getById(id: number) {
    return http.get(`${api}/v1/dental/id/${id}`);
  }

  saveOrUpdate(dental: Dental) {
    return http.post(`${api}/v1/dental/saveOrUpdate`, dental);
  }

  teethImgList: any[] = [
    [
      {
        id: 18,
        image1: "https://www.dentee.com/manage/Theme/images/tooth-image/upper-teeth/11-18/18-tooth/18-tooth-upper.png",
        image2: "https://www.dentee.com/manage/Theme/images/tooth-image/upper-teeth/11-18/18-tooth/18-tooth-front.png",
      },
      {
        id: 17,
        image1: "https://www.dentee.com/manage/Theme/images/tooth-image/upper-teeth/11-18/17-tooth/17-tooth-upper.png",
        image2: "https://www.dentee.com/manage/Theme/images/tooth-image/upper-teeth/11-18/17-tooth/17-tooth-front.png",
      },
      // ...other teeth data
    ],
    // ...other teeth groups
  ];

  teethExaminationList: any[] = [
    { id: 1, name: "Buccal" },
    { id: 2, name: "Ligual/Palatal" },
    { id: 3, name: "Occlusal" },
    { id: 4, name: "Root" },
    { id: 5, name: "Crown" },
    // ...other examination types
  ];

  treatmentType: any[] = [
    { id: 1, name: "Advance Surgical Procedure" },
    { id: 2, name: "Braces" },
    { id: 3, name: "Consultation" },
    { id: 4, name: "Crowns" },
    { id: 5, name: "Dental Implant" },
    // ...other treatment types
  ];
}

export default new DentalService();