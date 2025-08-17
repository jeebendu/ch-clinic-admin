
export interface QueueItemDto {
  patient_schedule_id: number;
  consulting_doctor_id: number;
  branch_id: number;
  patient_id: number;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  patient_mobile?: string;
  checkin_time: string;
  planned_sequence: number;
  actual_sequence: number;
  estimated_consultation_time: string;
  waiting_minutes: number;
  status: string;
}

export interface QueueResponseDto {
  total_count: number;
  branch_id: number;
  date: string;
  sort_by: string;
  queue_items: QueueItemDto[];
}

export interface QueueApiParams {
  branch_id?: number;
  date?: string;
  sort_by?: 'actual_sequence' | 'checkin_time';
  limit?: number;
}
