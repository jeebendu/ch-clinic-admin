
import React from 'react';
import { Visit } from '../../types/Visit';
import { useVisitActions } from '../../hooks/useVisitActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import VisitEditDialog from '../dialogs/VisitEditDialog';
import PaymentDialog from '../dialogs/PaymentDialog';
import VisitReportDialog from '../dialogs/VisitReportDialog';

interface VisitTableProps {
  visits: Visit[];
  onUpdate?: () => void;
}

const VisitTable: React.FC<VisitTableProps> = ({ visits, onUpdate }) => {
  const {
    selectedVisit,
    editDialogOpen,
    setEditDialogOpen,
    paymentDialogOpen,
    setPaymentDialogOpen,
    reportDialogOpen,
    setReportDialogOpen,
    getPrimaryVisitActions,
    getSecondaryVisitActions
  } = useVisitActions();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Visit Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Visit Type</TableHead>
            <TableHead>Actions</TableHead>
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
                  <div className="text-sm text-gray-500">
                    {visit.patient?.user?.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {visit.doctorBranch?.doctor?.firstname} {visit.doctorBranch?.doctor?.lastname}
                  </div>
                  <div className="text-sm text-gray-500">
                    {visit.doctorBranch?.doctor?.specializationList?.[0]?.name}
                  </div>
                </div>
              </TableCell>
              <TableCell>{visit.visitDate}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(visit.status)}>
                  {visit.status}
                </Badge>
              </TableCell>
              <TableCell>{visit.visitType}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getPrimaryVisitActions(visit).map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={action.onClick}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                  
                  {getSecondaryVisitActions(visit).length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {getSecondaryVisitActions(visit).map((action) => (
                          <DropdownMenuItem
                            key={action.label}
                            onClick={action.onClick}
                          >
                            {action.icon}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <VisitEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        visit={selectedVisit}
        onSave={() => {
          setEditDialogOpen(false);
          onUpdate?.();
        }}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        visit={selectedVisit}
        onPaymentComplete={() => {
          setPaymentDialogOpen(false);
          onUpdate?.();
        }}
      />

      <VisitReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        visit={selectedVisit}
      />
    </div>
  );
};

export default VisitTable;
