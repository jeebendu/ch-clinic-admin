
export interface Country {
  id: number;
  name: string;
  code: string;
  status: boolean;
  iso?: string; // Added to fix type errors
}
