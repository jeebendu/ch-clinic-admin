
export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  qualification: string;
  expYear: number;
  online: boolean;
  imageUrl?: string;
  gender: string;
  specializationList: {
    id: number;
    name: string;
  }[];
}
