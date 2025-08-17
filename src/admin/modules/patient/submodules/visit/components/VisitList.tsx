
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Clock, DollarSign, FileText } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Visit } from "../types/Visit";
import RowActions from "@/components/ui/RowActions";
import { useVisitActions } from "../hooks/useVisitActions";
import { useReportsActions } from "../hooks/useReportsActions";
import PaymentDialog from "./PaymentDialog";
import ReportsDialog from "./ReportsDialog";

interface VisitListProps {
  visits: Visit[];
  loading?: boolean;
  onView?: (visit: Visit) => void;
  onEdit?: (visit: Visit) => void;
  onEditVisit?: (visit: Visit) => void;
  onViewDetails?: (visit: Visit) => void;
  onMarkPayment?: (visit: Visit) => void;
  onViewReports?: (visit: Visit) => void;
}

export const VisitList: React.FC<VisitListProps> = ({ 
  visits, 
  loading = false, 
  onView, 
  onEdit,
  onEditVisit,
  onViewDetails,
  onMarkPayment,
  onViewReports
}) => {

  const { 
    getPrimaryVisitActions, 
    getSecondaryVisitActions,
    selectedVisit,
    paymentDialogOpen,
    setPaymentDialogOpen
  } = useVisitActions();

  const {
    selectedVisit: selectedReportsVisit,
    reportsDialogOpen,
    openReportsDialog,
    closeReportsDialog
  } = useReportsActions();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "follow-up":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "partial":
        return "bg-orange-100 text-orange-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleVisitClick = (visit: Visit) => {
    // Handle visit click
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <div key={`skeleton-${idx}`} className="bg-white rounded-lg border p-4">
              <div className="animate-pulse h-4 w-40 bg-gray-200 rounded mb-2" />
              <div className="animate-pulse h-3 w-64 bg-gray-200 rounded mb-2" />
              <div className="animate-pulse h-3 w-32 bg-gray-200 rounded" />
            </div>
          ))}
      </div>
    );
  }

  if (!visits.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No visits found
      </div>
    );
  }

  // Override actions based on page-level handlers
  const getCustomizedActions = (visit: Visit) => {
    const primaryActions = getPrimaryVisitActions(visit);
    const secondaryActions = getSecondaryVisitActions(visit);

    // Add Reports action to primary actions
    const reportsAction = {
      label: "View Reports",
      icon: FileText,
      onClick: () => {
        if (onViewReports) {
          onViewReports(visit);
        } else {
          openReportsDialog(visit);
        }
      }
    };

    // Override view details action if page-level handler provided
    if (onViewDetails) {
      const viewDetailsIndex = primaryActions.findIndex(action => action.label === "View Details");
      if (viewDetailsIndex !== -1) {
        primaryActions[viewDetailsIndex] = {
          ...primaryActions[viewDetailsIndex],
          onClick: () => onViewDetails(visit)
        };
      }
    }

    // Override edit action if page-level handler provided
    if (onEditVisit) {
      const editActionIndex = secondaryActions.findIndex(action => action.label === "Edit Visit");
      if (editActionIndex !== -1) {
        secondaryActions[editActionIndex] = {
          ...secondaryActions[editActionIndex],
          onClick: () => onEditVisit(visit)
        };
      }
    }

    // Override payment action if page-level handler provided
    if (onMarkPayment) {
      const paymentActionIndex = primaryActions.findIndex(action => action.label === "Mark Payment");
      if (paymentActionIndex !== -1) {
        primaryActions[paymentActionIndex] = {
          ...primaryActions[paymentActionIndex],
          onClick: () => onMarkPayment(visit)
        };
      }
    }

    return [reportsAction, ...primaryActions, ...secondaryActions];
  };

  return (
    <>
      <div className="space-y-3">
        {visits.map((visit) => (
          <Card 
              key={visit.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleVisitClick(visit)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-md">{visit.patient?.firstname } {visit.patient?.lastname }</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>{visit.patient?.age}y</span>
                          <span>•</span>
                          <span>{visit.patient?.gender}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(visit.status || '')}`}>
                          {visit.status}
                        </Badge>
                        <Badge className={`text-xs ${getPaymentStatusColor(visit.paymentStatus)}`}>
                          {visit.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Second Row - Doctor & Date */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(visit.createdTime || new Date()), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(visit.createdTime || new Date()), 'HH:mm')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>Dr. {visit.consultingDoctor?.firstname} {visit.consultingDoctor?.lastname}</span>
                        <span>•</span>
                        <span>{visit.consultingDoctor?.specializationList?.join(", ")}</span>
                      </div>
                    </div>

                    {/* Third Row - Visit Details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {visit.type}
                        </Badge>
                        <span className="text-muted-foreground max-w-xs">
                          {visit.complaints}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">₹{visit.paymentPaid || 0}</span>
                        {(visit.paymentAmount || 0) > 0 && (
                          <span className="text-muted-foreground">/ ₹{visit.paymentAmount}</span>
                        )}
                      </div>
                    </div>

                    {/* Reference Doctor if exists */}
                    {visit.referralDoctorName && (
                      <div className="text-xs text-muted-foreground">
                        Referred by: {visit.referralDoctorName}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-4">
                    <RowActions 
                      actions={getCustomizedActions(visit)} 
                      maxVisibleActions={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        visit={selectedVisit}
      />

      {/* Reports Dialog */}
      <ReportsDialog
        isOpen={reportsDialogOpen}
        onClose={closeReportsDialog}
        visit={selectedReportsVisit}
      />
    </>
  );
};
