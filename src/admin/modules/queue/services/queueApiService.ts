
import axios from 'axios';
import { QueueResponseDto, QueueApiParams } from '../types/QueueApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class QueueApiService {
  private getHeaders(branchId?: number) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (branchId) {
      headers['X-Branch-ID'] = branchId.toString();
    }
    
    return headers;
  }

  async getLiveQueue(params: QueueApiParams = {}): Promise<QueueResponseDto> {
    const { branch_id, date, sort_by = 'actual_sequence', limit } = params;
    
    const queryParams = new URLSearchParams();
    if (branch_id) queryParams.append('branch_id', branch_id.toString());
    if (date) queryParams.append('date', date);
    if (sort_by) queryParams.append('sort_by', sort_by);
    if (limit) queryParams.append('limit', limit.toString());

    const response = await axios.get<QueueResponseDto>(
      `${API_BASE_URL}/api/queue/live?${queryParams.toString()}`,
      { headers: this.getHeaders(branch_id) }
    );

    return response.data;
  }

  async getQueuePreview(params: QueueApiParams = {}): Promise<QueueResponseDto> {
    const { branch_id, date } = params;
    
    const queryParams = new URLSearchParams();
    if (branch_id) queryParams.append('branch_id', branch_id.toString());
    if (date) queryParams.append('date', date);

    const response = await axios.get<QueueResponseDto>(
      `${API_BASE_URL}/api/queue/preview?${queryParams.toString()}`,
      { headers: this.getHeaders(branch_id) }
    );

    return response.data;
  }

  async getQueueCount(params: QueueApiParams = {}): Promise<number> {
    const { branch_id, date } = params;
    
    const queryParams = new URLSearchParams();
    if (branch_id) queryParams.append('branch_id', branch_id.toString());
    if (date) queryParams.append('date', date);

    const response = await axios.get<number>(
      `${API_BASE_URL}/api/queue/count?${queryParams.toString()}`,
      { headers: this.getHeaders(branch_id) }
    );

    return response.data;
  }
}

export const queueApiService = new QueueApiService();
