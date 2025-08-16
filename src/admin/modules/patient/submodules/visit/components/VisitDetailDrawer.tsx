
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Calendar, Clock, DollarSign, FileText, User, Stethoscope, MapPin, Phone, Mail, X } from 'lucide-react';
import { format } from 'date-fns';

interface VisitDetailDrawerProps {
  visit: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (visit: any) => void;
  onClose?: (visit: any) => void;
  onTakePayment?: (visit: any) => void;
  onScheduleFollowUp?: (visit: any) => void;
  onViewTests?: (visit: any) => void;
  onPrintReceipt?: (visit: any) => void;
}

const VisitDetailDrawer: React.FC<VisitDetailDrawerProps> = ({
  visit,
  isOpen,
  onClose,
  onEdit,
  onClose: onCloseVisit,
  onTakePayment,
  onScheduleFollowUp,
  onViewTests,
  onPrintReceipt
}) => {
  if (!visit) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'unpaid': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span>Visit Details</span>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{visit.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span>{visit.patientAge || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span>{visit.patientGender || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UID:</span>
                <span className="font-mono text-xs">{visit.patientUid}</span>
              </div>
            </div>
          </div>

          {/* Visit Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Visit Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Date & Time:</span>
                <span className="text-sm font-medium">
                  {format(new Date(visit.visitDate), 'PPP p')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Type:</span>
                <Badge variant="outline" className="text-xs">
                  {visit.visitType}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Status:</span>
                <Badge className={`text-xs ${getStatusColor(visit.status)}`}>
                  {visit.status}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-600 text-sm">Reason:</span>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {visit.reasonForVisit || 'No reason specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Doctor Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{visit.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialization:</span>
                <span>{visit.doctorSpecialization}</span>
              </div>
              {visit.referralDoctorName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Referred by:</span>
                  <span>{visit.referralDoctorName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className={`text-xs ${getPaymentStatusColor(visit.paymentStatus)}`}>
                  {visit.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">₹{visit.paymentAmount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid Amount:</span>
                <span className="font-medium">₹{visit.paymentPaid || 0}</span>
              </div>
              {visit.paymentStatus === 'partial' && (
                <div className="flex justify-between text-red-600">
                  <span>Remaining:</span>
                  <span className="font-medium">
                    ₹{(visit.paymentAmount || 0) - (visit.paymentPaid || 0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {visit.notes && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </h3>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">
                {visit.notes}
              </p>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit?.(visit)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Edit
              </Button>
              {visit.status === 'open' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onCloseVisit?.(visit)}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Close
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {(visit.paymentStatus === 'unpaid' || visit.paymentStatus === 'partial') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onTakePayment?.(visit)}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Payment
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onScheduleFollowUp?.(visit)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Follow-up
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewTests?.(visit)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Tests
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPrintReceipt?.(visit)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Receipt
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VisitDetailDrawer;
