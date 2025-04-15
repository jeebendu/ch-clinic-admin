
export interface District {
  id: number;
  name: string;
  state: {
    id: number;
    name: string;
    country: {
      id: number;
      name?: string;
      code?: string;
      iso?: string;
      status?: boolean;
    };
  };
}
