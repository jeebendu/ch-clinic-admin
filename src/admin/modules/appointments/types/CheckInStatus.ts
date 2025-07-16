
export type CheckInStatus = 'pending' | 'checked_in' | 'completed' | 'cancelled';

export const CHECK_IN_STATUS = {
  PENDING: 'pending' as CheckInStatus,
  CHECKED_IN: 'checked_in' as CheckInStatus,
  COMPLETED: 'completed' as CheckInStatus,
  CANCELLED: 'cancelled' as CheckInStatus
} as const;
