
import { useQuery } from '@tanstack/react-query';
import { queueApiService } from '@/admin/modules/queue/services/queueApiService';
import { QueueApiParams } from '@/admin/modules/queue/types/QueueApi';

export const useQueueData = (params: QueueApiParams & { enabled?: boolean } = {}) => {
  const { enabled = true, ...apiParams } = params;
  
  return useQuery({
    queryKey: ['queue-live', apiParams],
    queryFn: () => queueApiService.getLiveQueue(apiParams),
    enabled,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useQueuePreview = (params: QueueApiParams & { enabled?: boolean } = {}) => {
  const { enabled = true, ...apiParams } = params;
  
  return useQuery({
    queryKey: ['queue-preview', apiParams],
    queryFn: () => queueApiService.getQueuePreview(apiParams),
    enabled,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

export const useQueueCount = (params: QueueApiParams & { enabled?: boolean } = {}) => {
  const { enabled = true, ...apiParams } = params;
  
  return useQuery({
    queryKey: ['queue-count', apiParams],
    queryFn: () => queueApiService.getQueueCount(apiParams),
    enabled,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};
