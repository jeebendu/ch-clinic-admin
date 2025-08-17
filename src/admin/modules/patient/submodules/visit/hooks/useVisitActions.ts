
import { useState } from 'react';
import { Visit } from '../types/Visit';
import { Eye, Edit, DollarSign, FileText, Trash } from 'lucide-react';

export const useVisitActions = () => {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const getPrimaryVisitActions = (visit: Visit) => [
    {
      label: "View Details",
      icon: Eye,
      onClick: () => {
        setSelectedVisit(visit);
        // This will be overridden by parent component if needed
      }
    },
    {
      label: "Mark Payment",
      icon: DollarSign,
      onClick: () => {
        setSelectedVisit(visit);
        setPaymentDialogOpen(true);
      }
    },
    {
      label: "View Reports",
      icon: FileText,
      onClick: () => {
        setSelectedVisit(visit);
        setReportDialogOpen(true);
      }
    }
  ];

  const getSecondaryVisitActions = (visit: Visit) => [
    {
      label: "Edit Visit",
      icon: Edit,
      onClick: () => {
        setSelectedVisit(visit);
        // This will be overridden by parent component if needed
      }
    },
    {
      label: "Delete",
      icon: Trash,
      onClick: () => {
        setSelectedVisit(visit);
        // Handle delete action
      }
    }
  ];

  return {
    selectedVisit,
    setSelectedVisit,
    paymentDialogOpen,
    setPaymentDialogOpen,
    reportDialogOpen,
    setReportDialogOpen,
    getPrimaryVisitActions,
    getSecondaryVisitActions
  };
};
