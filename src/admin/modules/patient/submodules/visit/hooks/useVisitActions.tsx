
import { useState } from "react";
import {
  Edit,
  Eye,
  Trash2,
  UserCheck,
  Calendar,
  FileText,
  DollarSign,
  Receipt,
  FlaskConical,
  BarChart3,
  Pill,
  CalendarPlus,
  StickyNote,
  Share
} from "lucide-react";
import { RowAction } from "@/components/ui/RowActions";
import { Visit } from "../types/Visit";

export const useVisitActions = () => {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleViewDetails = (visit: Visit) => {
    console.log('Viewing visit details:', visit);
  };

  const handleMarkPayment = (visit: Visit) => {
    console.log('Mark/Add payment for visit:', visit);
    setSelectedVisit(visit);
    setPaymentDialogOpen(true);
  };

  const handleGenerateInvoice = (visit: Visit) => {
    console.log('Generating invoice for visit:', visit);
  };

  const handleAddLabOrder = (visit: Visit) => {
    console.log('Adding lab order for visit:', visit);
  };

  const handleViewReports = (visit: Visit) => {
    console.log('Viewing reports for visit:', visit);
    setSelectedVisit(visit);
    setReportDialogOpen(true);
  };

  const handleEditVisit = (visit: Visit) => {
    console.log('Editing visit:', visit);
    setSelectedVisit(visit);
    setEditDialogOpen(true);
  };

  const handlePrescription = (visit: Visit) => {
    console.log('Managing prescription for visit:', visit);
  };

  const handleFollowUpVisit = (visit: Visit) => {
    console.log('Creating follow-up visit:', visit);
  };

  const handleAddNotes = (visit: Visit) => {
    console.log('Adding notes to visit:', visit);
  };

  const handleShare = (visit: Visit) => {
    console.log('Sharing visit via WhatsApp/SMS/Email:', visit);
  };

  const handleDeleteVisit = (visit: Visit) => {
    console.log('Deleting visit:', visit);
  };

  const handleCheckIn = (visit: Visit) => {
    console.log('Checking in visit:', visit);
  };

  const handleReschedule = (visit: Visit) => {
    console.log('Rescheduling visit:', visit);
  };

  const handleViewPrescription = (visit: Visit) => {
    console.log('Viewing prescription:', visit);
  };

  // Primary actions (always visible - 5 actions)
  const getPrimaryVisitActions = (visit: Visit): RowAction[] => {
    return [
      {
        label: "View Details",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => handleViewDetails(visit),
        variant: "default"
      },
      {
        label: "Mark Payment",
        icon: <DollarSign className="h-4 w-4" />,
        onClick: () => handleMarkPayment(visit),
        variant: "default"
      },
      {
        label: "Generate Invoice",
        icon: <Receipt className="h-4 w-4" />,
        onClick: () => handleGenerateInvoice(visit),
        variant: "default"
      },
      {
        label: "Add Lab Order",
        icon: <FlaskConical className="h-4 w-4" />,
        onClick: () => handleAddLabOrder(visit),
        variant: "default"
      },
      {
        label: "View Reports",
        icon: <BarChart3 className="h-4 w-4" />,
        onClick: () => handleViewReports(visit),
        variant: "default"
      }
    ];
  };

  // Secondary actions (in More menu)
  const getSecondaryVisitActions = (visit: Visit): RowAction[] => {
    const secondaryActions: RowAction[] = [
      {
        label: "Edit Visit",
        icon: <Edit className="h-4 w-4" />,
        onClick: () => handleEditVisit(visit),
        variant: "default"
      },
      {
        label: "Follow-up Visit",
        icon: <CalendarPlus className="h-4 w-4" />,
        onClick: () => handleFollowUpVisit(visit),
        variant: "default"
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => handleDeleteVisit(visit),
        variant: "destructive",
        confirm: true,
        confirmTitle: "Delete Visit",
        confirmDescription: `Are you sure you want to delete the visit for ${visit.patient?.firstname} ${visit.patient?.lastname}? This action cannot be undone.`
      }
    ];

    return secondaryActions;
  };

  // Legacy method for backward compatibility
  const getVisitActions = (visit: Visit): RowAction[] => {
    const baseActions: RowAction[] = [
      {
        label: "View Details",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => handleViewDetails(visit),
        variant: "default"
      },
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: () => handleEditVisit(visit),
        variant: "default"
      }
    ];

    // Add conditional actions based on visit status
    if (visit.status === 'scheduled') {
      baseActions.push({
        label: "Check In",
        icon: <UserCheck className="h-4 w-4" />,
        onClick: () => handleCheckIn(visit),
        variant: "default"
      });
      
      baseActions.push({
        label: "Reschedule",
        icon: <Calendar className="h-4 w-4" />,
        onClick: () => handleReschedule(visit),
        variant: "default"
      });
    }

    if (visit.status === 'completed') {
      baseActions.push({
        label: "View Prescription",
        icon: <FileText className="h-4 w-4" />,
        onClick: () => handleViewPrescription(visit),
        variant: "default"
      });
    }

    // Delete action (always last)
    baseActions.push({
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => handleDeleteVisit(visit),
      variant: "destructive",
      confirm: true,
      confirmTitle: "Delete Visit",
      confirmDescription: `Are you sure you want to delete the visit for ${visit.patient?.firstname} ${visit.patient?.lastname}? This action cannot be undone.`
    });

    return baseActions;
  };

  return {
    selectedVisit,
    setSelectedVisit,
    editDialogOpen,
    setEditDialogOpen,
    paymentDialogOpen,
    setPaymentDialogOpen,
    reportDialogOpen,
    setReportDialogOpen,
    getPrimaryVisitActions,
    getSecondaryVisitActions,
    getVisitActions,
    handleViewDetails,
    handleMarkPayment,
    handleGenerateInvoice,
    handleAddLabOrder,
    handleViewReports,
    handleEditVisit,
    handlePrescription,
    handleFollowUpVisit,
    handleAddNotes,
    handleShare,
    handleDeleteVisit,
    handleCheckIn,
    handleReschedule,
    handleViewPrescription
  };
};
