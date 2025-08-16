
import { useState } from "react";
import { Edit, Eye, Trash2, UserCheck, Calendar, FileText } from "lucide-react";
import { RowAction } from "@/components/ui/RowActions";
import { Visit } from "../types/Visit";

export const useVisitActions = () => {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleViewDetails = (visit: Visit) => {
    console.log('Viewing visit details:', visit);
    setSelectedVisit(visit);
    // Add your view details logic here
  };

  const handleEditVisit = (visit: Visit) => {
    console.log('Editing visit:', visit);
    setSelectedVisit(visit);
    setEditDialogOpen(true);
  };

  const handleDeleteVisit = (visit: Visit) => {
    console.log('Deleting visit:', visit);
    // Add your delete logic here
  };

  const handleCheckIn = (visit: Visit) => {
    console.log('Checking in visit:', visit);
    // Add your check-in logic here
  };

  const handleReschedule = (visit: Visit) => {
    console.log('Rescheduling visit:', visit);
    // Add your reschedule logic here
  };

  const handleViewPrescription = (visit: Visit) => {
    console.log('Viewing prescription:', visit);
    // Add your prescription view logic here
  };

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
    getVisitActions,
    handleViewDetails,
    handleEditVisit,
    handleDeleteVisit,
    handleCheckIn,
    handleReschedule,
    handleViewPrescription
  };
};
