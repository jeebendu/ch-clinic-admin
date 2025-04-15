
export interface Clinic {
  id: number;
  uid?: string;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
  plan?: {
    features?: {
      id: number;
      module: {
        id: number;
        name: string;
      };
      print: boolean;
    };
  };
}
