
// Define the audiometry test types

export interface AudiogramPoint {
  frequency: number;
  threshold: number;
}

export interface AudiogramData {
  rightEar: Record<number, number | null>;
  leftEar: Record<number, number | null>;
  testDate: string;
  testType: string;
  notes: string;
}

export interface AudiogramTest {
  id: number;
  patientId: number;
  testDate: string;
  testType: string;
  audiogramData: AudiogramData;
  notes: string;
  createdAt: string;
  updatedBy: string;
}

export type TestType = 'Pure Tone Audiometry' | 'Speech Audiometry' | 'Impedance Audiometry';
