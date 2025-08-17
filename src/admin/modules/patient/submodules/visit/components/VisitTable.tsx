
import React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Visit } from "../types/Visit";
import RowActions from "@/components/ui/RowActions";
import { useVisitActions } from "../hooks/useVisitActions";
import PaymentDialog from "./PaymentDialog";

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Doctors</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell className="py-4">
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse bg-gray-200 h-4 w-28 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="animate-pulse bg-gray-200 h-4 w-20 ml-auto rounded"></div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!visits.length) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Doctors</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No visits found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Doctors</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">
                      {visit.patient?.firstname} {visit.patient?.lastname}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {visit.patient?.age}y • {visit.patient?.gender}
                    </p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(visit.createdTime), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(visit.createdTime), 'HH:mm')}
                    </p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {visit.type}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    {/* Consulting Doctor */}
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Dr. {visit.consultingDoctor?.firstname} {visit.consultingDoctor?.lastname}
                      </p>
                      {visit.consultingDoctor?.specializationList && (
                        <p className="text-xs text-muted-foreground">
                          {visit.consultingDoctor.specializationList.map(s => s.name).join(", ")}
                        </p>
                      )}
                    </div>
                    
                    {/* Referral Doctor */}
                    {(visit.referByDoctor || visit.referralDoctorName) && (
                      <div className="pt-1 border-t border-gray-100">
                        <p className="text-xs text-green-600 font-medium">Referred by:</p>
                        <p className="text-sm text-green-700">
                          {visit.referByDoctor 
                            ? `Dr. ${visit.referByDoctor.firstname} ${visit.referByDoctor.lastname}`
                            : visit.referralDoctorName
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">₹{visit.paymentPaid || 0}</span>
                      {visit.paymentAmount > 0 && (
                        <span className="text-muted-foreground text-sm">/ ₹{visit.paymentAmount}</span>
                      )}
                    </div>
                    <Badge className={`text-xs ${getPaymentStatusColor(visit.paymentStatus)}`}>
                      {visit.paymentStatus || 'pending'}
                    </Badge>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={`text-xs ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </Badge>
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

