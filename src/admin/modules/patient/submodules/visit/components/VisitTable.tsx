
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
import { format } from "date-fns";
import { Visit } from "../types/Visit";
import RowActions from "@/components/ui/RowActions";
import { useVisitActions } from "../hooks/useVisitActions";

interface VisitTableProps {
  visits: Visit[];
  loading?: boolean;
  onEditVisit?: (visit: Visit) => void;
  onViewDetails?: (visit: Visit) => void;
  onMarkPayment?: (visit: Visit) => void;
}

export const VisitTable: React.FC<VisitTableProps> = ({ 
  visits, 
  loading = false,
  onEditVisit,
  onViewDetails,
  onMarkPayment
}) => {
  const { getPrimaryVisitActions, getSecondaryVisitActions } = useVisitActions();

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

    // Override payment action if page-level handler provided
    if (onMarkPayment) {
      const paymentIndex = primaryActions.findIndex(action => action.label === "Mark/Add Payment");
      if (paymentIndex !== -1) {
        primaryActions[paymentIndex] = {
          ...primaryActions[paymentIndex],
          onClick: () => onMarkPayment(visit)
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

    return [...primaryActions, ...secondaryActions];
  };

  if (loading) {
    return (
      <div className="space-y-3 p-6">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <div key={`skeleton-${idx}`} className="animate-pulse h-12 bg-gray-200 rounded" />
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

  return (
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
              <div>
                <div className="font-medium">
                  {visit.patient?.firstname} {visit.patient?.lastname}
                </div>
                <div className="text-sm text-muted-foreground">
                  {visit.patient?.age}y, {visit.patient?.gender}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">
                  Dr. {visit.consultingDoctor?.firstname} {visit.consultingDoctor?.lastname}
                </div>
                <div className="text-sm text-muted-foreground">
                  {visit.consultingDoctor?.specializationList?.join(", ")}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div>{format(new Date(visit.createdTime), 'MMM dd, yyyy')}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(visit.createdTime), 'HH:mm')}
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
              <div>
                <div className="font-medium">₹{visit.paymentPaid || 0}</div>
                {visit.paymentAmount > 0 && (
                  <div className="text-sm text-muted-foreground">
                    / ₹{visit.paymentAmount}
                  </div>
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
  );
};
