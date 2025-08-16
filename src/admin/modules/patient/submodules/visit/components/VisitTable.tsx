
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useVisitActions } from "../hooks/useVisitActions";
import RowActions from "@/components/ui/RowActions";
import { Visit } from "../types/Visit";

interface VisitTableProps {
  visits: Visit[];
  loading?: boolean;
  onView?: (visit: Visit) => void;
  onEdit?: (visit: Visit) => void;
}

export const VisitTable = ({ visits, loading = false, onView, onEdit }: VisitTableProps) => {

  const { getVisitActions } = useVisitActions();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (type.toLowerCase()) {
      case 'routine': return 'bg-blue-100 text-blue-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'follow-up': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-auto max-h-[calc(100vh-200px)]">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
            <TableRow>
              <TableHead className="bg-white">Visit ID</TableHead>
              <TableHead className="bg-white">Patient</TableHead>
              <TableHead className="bg-white">Doctor</TableHead>
              <TableHead className="bg-white">Date</TableHead>
              <TableHead className="bg-white">Type</TableHead>
              <TableHead className="bg-white">Reason</TableHead>
              <TableHead className="bg-white">Status</TableHead>
              <TableHead className="bg-white">Payment</TableHead>
              <TableHead className="text-right bg-white">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <div className="animate-pulse bg-gray-200 h-4 w-16 ml-auto rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : visits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  No visits found
                </TableCell>
              </TableRow>
            ) : (
              visits.map((visit) => (
                <TableRow key={visit.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{visit.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{visit.patientName}</p>
                      <p className="text-sm text-gray-500">
                        {visit.patientAge}y, {visit.patientGender} • {visit.patientUid}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{visit.doctorName}</p>
                      <p className="text-sm text-gray-500">{visit.doctorSpecialization}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge className={getVisitTypeColor(visit.visitType)}>
                      {visit.visitType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="truncate" title={visit.reasonForVisit}>
                        {visit.reasonForVisit}
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
                  <TableCell className="text-right space-x-2">
                     <RowActions 
                        actions={getVisitActions(visit)} 
                        maxVisibleActions={2}
                      />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
