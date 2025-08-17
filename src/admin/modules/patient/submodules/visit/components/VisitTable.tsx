import React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Visit } from "../types/Visit";
import RowActions from "@/components/ui/RowActions";
import { useVisitActions } from "../hooks/useVisitActions";
import PaymentDialog from "@/admin/components/dialogs/PaymentDialog";
import {
  Eye,
  Calendar,
  Clock,
  DollarSign,
} from "lucide-react";

interface VisitTableProps {
  visits: Visit[];
  loading?: boolean;
  onView?: (visit: Visit) => void;
  onEdit?: (visit: Visit) => void;
  onEditVisit?: (visit: Visit) => void;
  onViewDetails?: (visit: Visit) => void;
  onMarkPayment?: (visit: Visit) => void;
}

export const VisitTable: React.FC<VisitTableProps> = ({
  visits,
  loading = false,
  onView,
  onEdit,
  onEditVisit,
  onViewDetails,
  onMarkPayment
}) => {
  const {
    getPrimaryVisitActions,
    getSecondaryVisitActions,
    selectedVisit,
    paymentDialogOpen,
    setPaymentDialogOpen
  } = useVisitActions();

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

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4" />
          {Array(5)
            .fill(0)
            .map((_, idx) => (
              <div key={`skeleton-${idx}`} className="h-16 bg-gray-100 rounded mb-2" />
            ))}
        </div>
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

    return [...primaryActions, ...secondaryActions];
  };

  return (
    <>
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Patient</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Doctor</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Complaints</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {visit.patient.firstname} {visit.patient.lastname}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {visit.patient.age}y • {visit.patient.gender}
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(visit.createdTime), "MMM dd, yyyy")}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {format(new Date(visit.createdTime), "HH:mm")}
                  </div>
                </td>
                <td className="p-2">
                  Dr. {visit.consultingDoctor.firstname} {visit.consultingDoctor.lastname}
                  <div className="text-xs text-muted-foreground">
                    {visit.consultingDoctor.specializationList?.join(", ")}
                  </div>
                </td>
                <td className="p-2">{visit.type}</td>
                <td className="p-2">{visit.complaints}</td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {visit.paymentPaid || 0}
                  </div>
                  {visit.paymentAmount > 0 && (
                    <div className="text-xs text-muted-foreground">
                      / ₹{visit.paymentAmount}
                    </div>
                  )}
                </td>
                <td className="p-2">
                  <Badge className={`text-xs ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </Badge>
                  <Badge className={`text-xs ${getPaymentStatusColor(visit.paymentStatus)}`}>
                    {visit.paymentStatus}
                  </Badge>
                </td>
                <td className="p-2">
                  <RowActions
                    actions={getCustomizedActions(visit)}
                    maxVisibleActions={5}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        visit={selectedVisit}
      />
    </>
  );
};
