
import React from 'react';
import { Visit } from '../types/Visit';
import { Calendar, User, DollarSign, Clock, MapPin, Stethoscope, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface VisitListProps {
  visits: Visit[];
  onVisitClick?: (visit: Visit) => void;
  showPaymentStatus?: boolean;
}

const VisitList: React.FC<VisitListProps> = ({ 
  visits, 
  onVisitClick,
  showPaymentStatus = false 
}) => {
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'partial': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'unpaid': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVisitStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!visits.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No visits found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visits.map((visit) => (
        <Card 
          key={visit.id} 
          className="p-3 hover:shadow-md transition-shadow cursor-pointer border border-border/50"
          onClick={() => onVisitClick?.(visit)}
        >
          <div className="flex items-center justify-between gap-4 text-sm">
            {/* Left Section: Date & Time */}
            <div className="flex items-center gap-2 min-w-[140px]">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {visit.visitTime}
                </span>
              </div>
            </div>

            {/* Middle Section: Doctor Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Consulting Doctor */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <Stethoscope className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground truncate text-xs">
                    Dr. {visit.doctor?.firstname} {visit.doctor?.lastname}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {visit.doctor?.specializationList?.[0]?.name || 'General'}
                  </span>
                </div>
              </div>

              {/* Referral Doctor */}
              {visit.refDoctor && (
                <div className="flex items-center gap-2 min-w-[120px]">
                  <UserCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-foreground truncate text-xs">
                      Dr. {visit.refDoctor.firstname} {visit.refDoctor.lastname}
                    </span>
                    <span className="text-xs text-muted-foreground">Ref. Doctor</span>
                  </div>
                </div>
              )}

              {/* Branch */}
              {visit.branch && (
                <div className="flex items-center gap-2 min-w-[100px]">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">
                    {visit.branch.name}
                  </span>
                </div>
              )}
            </div>

            {/* Right Section: Status & Payment */}
            <div className="flex items-center gap-3">
              {/* Visit Status */}
              <Badge 
                variant="outline" 
                className={`${getVisitStatusColor(visit.status)} text-xs px-2 py-1`}
              >
                {visit.status}
              </Badge>

              {/* Payment Info */}
              {showPaymentStatus && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-foreground text-xs">
                      ₹{visit.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`${getPaymentStatusColor(visit.paymentStatus)} text-xs px-1 py-0`}
                    >
                      {visit.paymentStatus || 'Unpaid'}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Visit Type */}
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {visit.visitType || 'Consultation'}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VisitList;
