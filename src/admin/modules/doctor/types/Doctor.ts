
export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  qualification: string;
  expYear: number;
  online: boolean;
  gender: string;
  specializationList: {
    id: number;
    name: string;
  }[];
}
