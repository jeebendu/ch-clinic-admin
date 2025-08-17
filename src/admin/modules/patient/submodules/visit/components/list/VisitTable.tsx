import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import RowActions from "@/components/ui/RowActions";
import { Visit } from "../../types/Visit";
import { useVisitActions } from "../../hooks/useVisitActions";
import PaymentDialog from "../payment/PaymentDialog";

interface VisitTableProps {
  visits: Visit[];
  loading?: boolean;
  onView?: (visit: Visit) => void;
  onEdit?: (visit: Visit) => void;
  onEditVisit?: (visit: Visit) => void; // Page-level edit handler
  onViewDetails?: (visit: Visit) => void; // Page-level view details handler
  onMarkPayment?: (visit: Visit) => void; // Page-level payment handler
}

export const VisitTable = ({ 
  visits, 
  loading = false, 
  onView, 
  onEdit,
  onEditVisit,
  onViewDetails,
  onMarkPayment
}: VisitTableProps) => {

  const { 
      getPrimaryVisitActions, 
      getSecondaryVisitActions,
      selectedVisit,
      paymentDialogOpen,
      setPaymentDialogOpen
    } = useVisitActions();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisitTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'routine': return 'bg-blue-100 text-blue-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'follow-up': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Override actions based on page-level handlers
  const getCustomizedPrimaryActions = (visit: Visit) => {
    const actions = getPrimaryVisitActions(visit);
    
    // Override view details action if page-level handler provided
    if (onViewDetails) {
      const viewDetailsIndex = actions.findIndex(action => action.label === "View Details");
      if (viewDetailsIndex !== -1) {
        actions[viewDetailsIndex] = {
          ...actions[viewDetailsIndex],
          onClick: () => onViewDetails(visit)
        };
      }
    }

    // Override payment action if page-level handler provided
    if (onMarkPayment) {
      const paymentActionIndex = actions.findIndex(action => action.label === "Mark Payment");
      if (paymentActionIndex !== -1) {
        actions[paymentActionIndex] = {
          ...actions[paymentActionIndex],
          onClick: () => onMarkPayment(visit)
        };
      }
    }
    
    return actions;
  };

  const getCustomizedSecondaryActions = (visit: Visit) => {
    const actions = getSecondaryVisitActions(visit);
    
    // Override edit action if page-level handler provided
    if (onEditVisit) {
      const editActionIndex = actions.findIndex(action => action.label === "Edit Visit");
      if (editActionIndex !== -1) {
        actions[editActionIndex] = {
          ...actions[editActionIndex],
          onClick: () => onEditVisit(visit)
        };
      }
    }
    
    return actions;
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Visit ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-center">Quick Actions</TableHead>
            <TableHead className="text-center">More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array(5).fill(0).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell className="py-4">
                  <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-28 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-36 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="animate-pulse bg-gray-200 h-4 w-32 mx-auto rounded"></div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="animate-pulse bg-gray-200 h-4 w-8 mx-auto rounded"></div>
                </TableCell>
              </TableRow>
            ))
          ) : visits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                No visits found
              </TableCell>
            </TableRow>
          ) : (
            visits.map((visit) => (
              <TableRow key={visit.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{visit.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{visit.patient.firstname} {visit.patient.lastname}</p>
                    <p className="text-sm text-gray-500">
                      {visit.patient.age}y, {visit.patient.gender} • {visit.patient.uid}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{visit.consultingDoctor.firstname} {visit.consultingDoctor.lastname}</p>
                    <p className="text-sm text-gray-500">{visit.consultingDoctor.specializationList?.join(", ")}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(visit.createdTime), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge className={getVisitTypeColor(visit.type)}>
                    {visit.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="" title={visit.complaints}>
                      {visit.complaints}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(visit.status)}>
                    {visit.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {visit.paymentStatus ? (
                    <div className="flex items-center gap-2">
                      <Badge className={getPaymentStatusColor(visit.paymentStatus)}>
                        {visit.paymentStatus}
                      </Badge>
                      {visit.paymentAmount && (
                        <span className="text-xs text-gray-500">
                          ₹{visit.paymentPaid || 0}/{visit.paymentAmount}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <RowActions 
                    actions={getCustomizedPrimaryActions(visit)} 
                    maxVisibleActions={5}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <RowActions 
                    actions={getCustomizedSecondaryActions(visit)} 
                    maxVisibleActions={0}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        visit={selectedVisit}
      />

    </div>

    
  );
};
