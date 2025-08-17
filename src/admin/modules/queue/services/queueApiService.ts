
import http from "@/lib/JwtInterceptor";
import { QueueResponseDto, QueueApiParams } from '../types/QueueApi';
import { getEnvVariable } from '@/utils/envUtils';

const API_BASE_URL = getEnvVariable('API_URL');

class QueueApiService {


  async getLiveQueue(params: QueueApiParams = {}): Promise<QueueResponseDto> {
    const { branch_id, date, sort_by = 'actual_sequence', limit } = params;
    
    const queryParams = new URLSearchParams();
    if (branch_id) queryParams.append('branch_id', branch_id.toString());
    if (date) queryParams.append('date', date);
    if (sort_by) queryParams.append('sort_by', sort_by);
    if (limit) queryParams.append('limit', limit.toString());

    const response = await http.get<QueueResponseDto>(
      `${API_BASE_URL}/v1/queue/live?${queryParams.toString()}`
    );

    return response.data;
  }

  async getQueuePreview(params: QueueApiParams = {}): Promise<QueueResponseDto> {
    const { branch_id, date } = params;
    
    const queryParams = new URLSearchParams();
    if (branch_id) queryParams.append('branch_id', branch_id.toString());
    if (date) queryParams.append('date', date);

    const response = await http.get<QueueResponseDto>(
      `${API_BASE_URL}/v1/queue/preview?${queryParams.toString()}`
    );

    return response.data;
  }

  async getQueueCount(params: QueueApiParams = {}): Promise<number> {
    const { branch_id, date } = params;
    
    const queryParams = new URLSearchParams();
    if (branch_id) queryParams.append('branch_id', branch_id.toString());
    if (date) queryParams.append('date', date);

    const response = await http.get<number>(
      `${API_BASE_URL}/v1/queue/count?${queryParams.toString()}`
    );

    return response.data;
  }
}

export const queueApiService = new QueueApiService();
