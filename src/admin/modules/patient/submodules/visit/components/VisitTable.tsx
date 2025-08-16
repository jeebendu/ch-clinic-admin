
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VisitItem } from "../types/VisitItem";

interface VisitTableProps {
  visits: VisitItem[];
}

export const VisitTable = ({ visits }: VisitTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <TableHead className="text-right">Actions</TableHead>
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
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(visit)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(visit)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

