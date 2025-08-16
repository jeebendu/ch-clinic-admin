
export interface VisitFilter {
  patientName?: string;
  doctorName?: string;
  visitDate?: string;
  status?: string[];
  visitType?: string[];
  branch?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export interface VisitFilterState {
  searchTerm: string;
  selectedFilters: Record<string, string[]>;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export const VISIT_STATUS_OPTIONS = [
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'no_show', label: 'No Show' }
];

export const VISIT_TYPE_OPTIONS = [
  { id: 'consultation', label: 'Consultation' },
  { id: 'follow_up', label: 'Follow Up' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'routine_checkup', label: 'Routine Checkup' }
];
