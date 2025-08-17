import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, CheckCircle, Clock, User, Phone, Mail, CreditCard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Appointment } from '@/admin/modules/appointments/types/Appointment';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { CheckInDialog } from '@/admin/components/dialogs/CheckInDialog';
import { PaymentProcessDialog } from '@/admin/components/dialogs/PaymentProcessDialog';
import { AppointmentDetailDialog } from '@/admin/components/dialogs/AppointmentDetailDialog';
import { PaymentSummary } from '@/admin/components/widgets/PaymentSummary';
import { invoiceService } from '@/admin/modules/appointments/services/invoiceService';
import { PaymentSummary as PaymentSummaryType } from '@/admin/modules/appointments/types/Invoice';

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange?: (appointmentId: number, newStatus: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onStatusChange }) => {
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryType | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleStatusUpdate = (newStatus: string) => {
    onStatusChange?.(appointment.id, newStatus);
  };

  useEffect(() => {
    if (appointment?.id) {
      invoiceService.getPaymentSummary(appointment.id)
        .then(setPaymentSummary)
        .catch(console.error);
    }
  }, [appointment?.id]);

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{appointment.doctor.firstname} {appointment.doctor.lastname}</h2>
            <p className="text-sm text-muted-foreground">{appointment.doctorBranch.name}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {dayjs(appointment.appointmentDate).format('MMM DD, YYYY')}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowDetailDialog(true)}>
                <Edit className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NextLink href={`/admin/modules/appointments/edit/${appointment.id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Appointment
                </NextLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusUpdate('cancelled')}>
                Cancel Appointment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <Avatar>
            <AvatarImage src={appointment.patient.image} />
            <AvatarFallback>{appointment.patient.firstname[0]}{appointment.patient.lastname[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-md font-semibold">{appointment.patient.firstname} {appointment.patient.lastname}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {appointment.patient.age} years
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {appointment.patient.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {appointment.patient.email}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Badge variant="secondary">{appointment.status}</Badge>
        </div>

        {/* Payment Summary Section */}
        <div className="mt-4 pt-4 border-t">
          {paymentSummary && (
            <PaymentSummary
              summary={paymentSummary}
              onViewInvoices={() => setShowInvoiceModal(true)}
              onAddPayment={() => setShowPaymentDialog(true)}
              className="w-full"
            />
          )}
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          {appointment.status === 'confirmed' && (
            <Button size="sm" onClick={() => setShowCheckInDialog(true)}>
              Check In
            </Button>
          )}
          {appointment.status === 'checked_in' && (
            <Button size="sm" onClick={() => handleStatusUpdate('in_consultation')}>
              Start Consultation
            </Button>
          )}
          {appointment.status === 'in_consultation' && (
            <Button size="sm" onClick={() => handleStatusUpdate('completed')}>
              Complete Consultation
            </Button>
          )}
          {appointment.status === 'completed' && (
            <Button size="sm" onClick={() => setShowPaymentDialog(true)}>
              Process Payment
            </Button>
          )}
        </div>
      </CardContent>

      <CheckInDialog
        appointment={appointment}
        open={showCheckInDialog}
        onClose={() => setShowCheckInDialog(false)}
        onCheckIn={(status, notes) => {
          handleStatusUpdate(status);
          setShowCheckInDialog(false);
        }}
      />

      <PaymentProcessDialog
        appointment={appointment}
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onPaymentComplete={(paymentInfo) => {
          console.log('Payment Info:', paymentInfo);
          setShowPaymentDialog(false);
        }}
      />

      <AppointmentDetailDialog
        appointment={appointment}
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        onUpdateStatus={handleStatusUpdate}
        onCheckIn={() => setShowCheckInDialog(true)}
        onPaymentComplete={(paymentInfo) => {
          console.log('Payment Info:', paymentInfo);
          setShowPaymentDialog(false);
        }}
      />
    </Card>
  );
};

export default AppointmentCard;
