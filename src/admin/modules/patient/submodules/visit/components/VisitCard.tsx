
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Calendar, User, Stethoscope, CreditCard } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface VisitCardProps {
  visit: any;
  onClick: () => void;
  onView: () => void;
  onEdit: () => void;
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, onClick, onView, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'pending': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'unpaid': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">{visit.patientName || 'Unknown Patient'}</h3>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(visit.status)}>
              {visit.status || 'open'}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(visit.visitDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Stethoscope className="h-3 w-3" />
            <span>{visit.doctorName || 'Unknown Doctor'}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-3 w-3" />
            <Badge className={getPaymentStatusColor(visit.paymentStatus)} variant="outline">
              {visit.paymentStatus || 'pending'}
            </Badge>
          </div>

          {visit.reasonForVisit && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {visit.reasonForVisit}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitCard;
