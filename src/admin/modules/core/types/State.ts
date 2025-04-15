
export interface State {
  id: number;
  name: string;
  country: {
    id: number;
    name?: string;
    code?: string;
    iso?: string;
    status?: boolean;
  };
}
