import React, { createContext, useContext, useMemo, useState } from "react";
import { Visit } from "../types/Visit";

type VisitActionsContextType = {
  selectedVisit: Visit | null;
  setSelectedVisit: (v: Visit | null) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  detailsModalOpen: boolean;
  setDetailsModalOpen: (open: boolean) => void;
  getPrimaryVisitActions: (visit: Visit) => any[]; // uses RowAction[] shape; kept as any to avoid cross-import
  getSecondaryVisitActions: (visit: Visit) => any[];
  getVisitActions: (visit: Visit) => any[];
  handleViewDetails: (visit: Visit) => void;
  handleMarkPayment: (visit: Visit) => void;
  handleGenerateInvoice: (visit: Visit) => void;
  handleAddLabOrder: (visit: Visit) => void;
  handleViewReports: (visit: Visit) => void;
  handleEditVisit: (visit: Visit) => void;
  handlePrescription: (visit: Visit) => void;
  handleFollowUpVisit: (visit: Visit) => void;
  handleAddNotes: (visit: Visit) => void;
  handleShare: (visit: Visit) => void;
  handleDeleteVisit: (visit: Visit) => void;
  handleCheckIn: (visit: Visit) => void;
  handleReschedule: (visit: Visit) => void;
  handleViewPrescription: (visit: Visit) => void;
};

// We intentionally avoid importing RowAction here to keep the provider lightweight and avoid deep import chains.
const VisitActionsContext = createContext<VisitActionsContextType | null>(null);

export const VisitActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Handler implementations mirror the existing useVisitActions to keep behavior consistent
  const handleViewDetails = (visit: Visit) => {
    console.log('Viewing visit details:', visit);
    setSelectedVisit(visit);
    setDetailsModalOpen(true);
  };

  const handleMarkPayment = (visit: Visit) => {
    console.log('Mark/Add payment for visit:', visit);
  };

  const handleGenerateInvoice = (visit: Visit) => {
    console.log('Generating invoice for visit:', visit);
  };

  const handleAddLabOrder = (visit: Visit) => {
    console.log('Adding lab order for visit:', visit);
  };

  const handleViewReports = (visit: Visit) => {
    console.log('Viewing reports for visit:', visit);
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

  // Primary actions builder (icons and RowAction type are provided by consumers)
  const getPrimaryVisitActions = (visit: Visit) => {
    return [
      {
        label: "View Details",
        icon: null,
        onClick: () => handleViewDetails(visit),
        variant: "default"
      },
      {
        label: "Mark/Add Payment",
        icon: null,
        onClick: () => handleMarkPayment(visit),
        variant: "default"
      },
      {
        label: "Generate Invoice",
        icon: null,
        onClick: () => handleGenerateInvoice(visit),
        variant: "default"
      },
      {
        label: "Add Lab Order",
        icon: null,
        onClick: () => handleAddLabOrder(visit),
        variant: "default"
      },
      {
        label: "View Reports",
        icon: null,
        onClick: () => handleViewReports(visit),
        variant: "default"
      }
    ];
  };

  const getSecondaryVisitActions = (visit: Visit) => {
    return [
      {
        label: "Edit Visit",
        icon: null,
        onClick: () => handleEditVisit(visit),
        variant: "default"
      },
      {
        label: "Prescription",
        icon: null,
        onClick: () => handlePrescription(visit),
        variant: "default"
      },
      {
        label: "Follow-up Visit",
        icon: null,
        onClick: () => handleFollowUpVisit(visit),
        variant: "default"
      },
      {
        label: "Add Notes",
        icon: null,
        onClick: () => handleAddNotes(visit),
        variant: "default"
      },
      {
        label: "Share",
        icon: null,
        onClick: () => handleShare(visit),
        variant: "default"
      },
      {
        label: "Delete",
        icon: null,
        onClick: () => handleDeleteVisit(visit),
        variant: "destructive",
        confirm: true,
        confirmTitle: "Delete Visit",
        confirmDescription: `Are you sure you want to delete the visit for ${visit.patient?.firstname} ${visit.patient?.lastname}? This action cannot be undone.`
      }
    ];
  };

  const getVisitActions = (visit: Visit) => {
    const baseActions: any[] = [
      {
        label: "View Details",
        icon: null,
        onClick: () => handleViewDetails(visit),
        variant: "default"
      },
      {
        label: "Edit",
        icon: null,
        onClick: () => handleEditVisit(visit),
        variant: "default"
      }
    ];

    if (visit.status === 'scheduled') {
      baseActions.push({
        label: "Check In",
        icon: null,
        onClick: () => handleCheckIn(visit),
        variant: "default"
      });
      
      baseActions.push({
        label: "Reschedule",
        icon: null,
        onClick: () => handleReschedule(visit),
        variant: "default"
      });
    }

    if (visit.status === 'completed') {
      baseActions.push({
        label: "View Prescription",
        icon: null,
        onClick: () => handleViewPrescription(visit),
        variant: "default"
      });
    }

    baseActions.push({
      label: "Delete",
      icon: null,
      onClick: () => handleDeleteVisit(visit),
      variant: "destructive",
      confirm: true,
      confirmTitle: "Delete Visit",
      confirmDescription: `Are you sure you want to delete the visit for ${visit.patient?.firstname} ${visit.patient?.lastname}? This action cannot be undone.`
    });

    return baseActions;
  };

  const value = useMemo<VisitActionsContextType>(() => ({
    selectedVisit,
    setSelectedVisit,
    editDialogOpen,
    setEditDialogOpen,
    detailsModalOpen,
    setDetailsModalOpen,
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
  }), [
    selectedVisit,
    editDialogOpen,
    detailsModalOpen
  ]);

  return (
    <VisitActionsContext.Provider value={value}>
      {children}
    </VisitActionsContext.Provider>
  );
};

export const useVisitActionsContext = () => useContext(VisitActionsContext);
