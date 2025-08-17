
import { Visit } from "../types/Visit";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Clock, User, FileText, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { DataTableRowActions, RowAction } from "@/components/ui/data-table-row-actions";

interface VisitListProps {
  visits: Visit[];
  getPrimaryActions: (visit: Visit) => RowAction[];
  getSecondaryActions: (visit: Visit) => RowAction[];
}

export const VisitList = ({ visits, getPrimaryActions, getSecondaryActions }: VisitListProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'follow-up':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'routine':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'follow-up':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'emergency':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'partial':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'unpaid':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <Card key={visit.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Visit #{visit.id}</h3>
                  <p className="text-sm text-muted-foreground">Patient ID: {visit.patientId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={getStatusColor(visit.status)}
                >
                  {visit.status}
                </Badge>
                <DataTableRowActions
                  primaryActions={getPrimaryActions(visit)}
                  secondaryActions={getSecondaryActions(visit)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Visit Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <Badge 
                    variant="outline" 
                    className={getTypeColor(visit.visitType)}
                  >
                    {visit.visitType}
                  </Badge>
                </div>
              </div>

              {visit.paymentStatus && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment</p>
                    <Badge 
                      variant="outline" 
                      className={getPaymentStatusColor(visit.paymentStatus)}
                    >
                      {visit.paymentStatus}
                    </Badge>
                  </div>
                </div>
              )}

              {visit.doctorId && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Doctor</p>
                    <p className="text-sm text-muted-foreground">Dr. {visit.doctorId}</p>
                  </div>
                </div>
              )}
            </div>

            {visit.reasonForVisit && (
              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Reason for Visit</p>
                  <p className="text-sm text-muted-foreground">{visit.reasonForVisit}</p>
                </div>
              </div>
            )}

            {visit.notes && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{visit.notes}</p>
              </div>
            )}

            {visit.paymentAmount && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">${visit.paymentAmount.toFixed(2)}</span>
                {visit.paymentPaid && (
                  <>
                    <span className="text-muted-foreground">Paid:</span>
                    <span className="font-medium text-green-600">${visit.paymentPaid.toFixed(2)}</span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
