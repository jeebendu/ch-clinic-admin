
export interface Audiogram {
  id: number;
  patientId: number;
  date: string;
  rightEarResults: any[];
  leftEarResults: any[];
  tester: string;
  notes: string;
  additionalTests: string[];
  diagnosis: string;
}
