
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, Stethoscope, CreditCard } from "lucide-react";
import { VisitItem } from "../types/VisitItem";

interface VisitListProps {
  visits: VisitItem[];
}

export const VisitList = ({ visits }: VisitListProps) => {
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
    <div className="space-y-4">
      {visits.map((visit) => (
        <Card key={visit.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-lg">{visit.patientName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {visit.patientAge} years • {visit.patientGender} • UID: {visit.patientUid}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge className={getStatusColor(visit.status)}>
                  {visit.status}
                </Badge>
                {visit.paymentStatus && (
                  <Badge className={getPaymentColor(visit.paymentStatus)}>
                    {visit.paymentStatus}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{visit.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{visit.doctorSpecialization}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{new Date(visit.visitDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">{visit.visitType}</p>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm">
                <span className="font-medium">Reason:</span> {visit.reasonForVisit}
              </p>
            </div>

            {visit.paymentAmount && (
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Amount: ${visit.paymentAmount}</span>
                {visit.paymentPaid && (
                  <span>• Paid: ${visit.paymentPaid}</span>
                )}
              </div>
            )}

            {visit.referralDoctorName && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Referred to:</span> {visit.referralDoctorName}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
