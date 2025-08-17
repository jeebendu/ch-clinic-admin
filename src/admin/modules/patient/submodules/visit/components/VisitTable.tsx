
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Visit } from "../types/Visit";
import RowActions from "@/components/ui/RowActions";
import { useVisitActions } from "../hooks/useVisitActions";
import PaymentDialog from "./PaymentDialog";

interface VisitTableProps {
  visits: Visit[];
  loading?: boolean;
  onView?: (visit: Visit) => void;
  onEdit?: (visit: Visit) => void;
  onEditVisit?: (visit: Visit) => void; // Page-level edit handler
  onViewDetails?: (visit: Visit) => void; // Page-level view details handler
  onMarkPayment?: (visit: Visit) => void; // Page-level payment handler
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
      <div className="space-y-2">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <div key={`skeleton-${idx}`} className="bg-white rounded-lg border p-4">
              <div className="animate-pulse h-4 w-full bg-gray-200 rounded" />
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
      const paymentActionIndex = primaryActions.findIndex(action => action.label === "Mark/Add Payment");
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">
                        {visit.patient.firstname} {visit.patient.lastname}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {visit.patient.age}y • {visit.patient.gender}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      Dr. {visit.consultingDoctor.firstname} {visit.consultingDoctor.lastname}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {visit.consultingDoctor.specializationList?.join(", ")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <div>{format(new Date(visit.createdTime), 'MMM dd, yyyy')}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(visit.createdTime), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {visit.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${getPaymentStatusColor(visit.paymentStatus)}`}>
                    {visit.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">₹{visit.paymentPaid || 0}</span>
                    {visit.paymentAmount > 0 && (
                      <span className="text-muted-foreground">/ ₹{visit.paymentAmount}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions 
                    actions={getCustomizedActions(visit)} 
                    maxVisibleActions={3}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
