
export enum CheckInStatus {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  NO_SHOW = "NO_SHOW",
  CANCELLED = "CANCELLED"
}

export const CheckInStatusLabels = {
  [CheckInStatus.PENDING]: "Pending",
  [CheckInStatus.CHECKED_IN]: "Checked In",
  [CheckInStatus.NO_SHOW]: "No Show",
  [CheckInStatus.CANCELLED]: "Cancelled"
};
