
import { useState } from 'react';
import { Visit } from '../types/Visit';

export const useReportsActions = () => {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);

  const openReportsDialog = (visit: Visit) => {
    setSelectedVisit(visit);
    setReportsDialogOpen(true);
  };

  const closeReportsDialog = () => {
    setSelectedVisit(null);
    setReportsDialogOpen(false);
  };

  return {
    selectedVisit,
    reportsDialogOpen,
    openReportsDialog,
    closeReportsDialog,
    setReportsDialogOpen
  };
};
