
import { useState } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Visit } from '../types/Visit';

export function useVisitActions() {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const handleView = (visit: Visit) => {
    setSelectedVisit(visit);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (visit: Visit) => {
    console.log('Edit visit:', visit);
    // TODO: Implement edit functionality
  };

  const handleDelete = (visit: Visit) => {
    console.log('Delete visit:', visit);
    // TODO: Implement delete functionality
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'scheduled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'in_progress':
        return <Clock className="h-3 w-3" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3" />;
      case 'scheduled':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return {
    detailsDialogOpen,
    setDetailsDialogOpen,
    selectedVisit,
    setSelectedVisit,
    handleView,
    handleEdit,
    handleDelete,
    getStatusColor,
    getStatusIcon,
  };
}
