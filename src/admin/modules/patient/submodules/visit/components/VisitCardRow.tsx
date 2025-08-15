
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Clock, User, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface VisitCardRowProps {
  visit: any;
  onView?: (visit: any) => void;
  onEdit?: (visit: any) => void;
}

const VisitCardRow: React.FC<VisitCardRowProps> = ({ visit, onView, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVisitTypeColor = (type: string) => {
    switch (type) {
      case 'routine': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'follow-up': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'emergency': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'partial': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'unpaid': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg text-gray-900">
                Visit #{visit.id}
              </h3>
              <Badge className={getStatusColor(visit.status)}>
                {visit.status}
              </Badge>
              <Badge className={getVisitTypeColor(visit.visitType)}>
                {visit.visitType}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
            </div>
          </div>

          {/* Patient Info Row */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-900">{visit.patientName}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({visit.patientAge}y, {visit.patientGender})
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              UID: {visit.patientUid}
            </div>
          </div>

          {/* Doctor & Reason Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500">Doctor:</span>
                <span className="font-medium text-gray-900 ml-1">{visit.doctorName}</span>
                <span className="text-gray-500 ml-1">({visit.doctorSpecialization})</span>
              </div>
            </div>
            {visit.paymentStatus && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <Badge className={getPaymentStatusColor(visit.paymentStatus)}>
                  {visit.paymentStatus}
                </Badge>
                {visit.paymentAmount && (
                  <span className="text-sm text-gray-600">
                    ₹{visit.paymentPaid || 0}/{visit.paymentAmount}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Reason for Visit */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm">
              <span className="text-gray-500">Reason:</span>
              <span className="text-gray-900 ml-1 font-medium">{visit.reasonForVisit}</span>
            </div>
            {visit.notes && (
              <div className="text-sm mt-1">
                <span className="text-gray-500">Notes:</span>
                <span className="text-gray-700 ml-1">{visit.notes}</span>
              </div>
            )}
          </div>

          {/* Referral Info */}
          {visit.referralDoctorName && (
            <div className="text-sm text-gray-600">
              <span className="text-gray-500">Referred to:</span>
              <span className="font-medium ml-1">{visit.referralDoctorName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(visit)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(visit)}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitCardRow;
