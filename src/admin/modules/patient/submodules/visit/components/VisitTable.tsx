
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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{visit.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {visit.patientAge}y • {visit.patientGender} • {visit.patientUid}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{visit.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{visit.doctorSpecialization}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{new Date(visit.visitDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">{new Date(visit.visitDate).toLocaleTimeString()}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{visit.visitType}</Badge>
              </TableCell>
              <TableCell>
                <p className="max-w-xs truncate" title={visit.reasonForVisit}>
                  {visit.reasonForVisit}
                </p>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(visit.status)}>
                  {visit.status}
                </Badge>
              </TableCell>
              <TableCell>
                {visit.paymentStatus && (
                  <Badge className={getPaymentColor(visit.paymentStatus)}>
                    {visit.paymentStatus}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {visit.paymentAmount && (
                  <div className="text-sm">
                    <p>${visit.paymentAmount}</p>
                    {visit.paymentPaid && (
                      <p className="text-muted-foreground">Paid: ${visit.paymentPaid}</p>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
