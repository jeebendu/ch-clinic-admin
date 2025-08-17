import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, CreditCard, User, Clock, MapPin, CheckCheck, Check, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from '@/admin/modules/appointments/types/Appointment';
import { CheckInDialog } from './CheckInDialog';
import { PaymentProcessDialog } from './PaymentProcessDialog';
import { CheckInStatus } from '@/admin/modules/appointments/types/PaymentFlow';
import { PaymentSummary } from '@/admin/components/widgets/PaymentSummary';
import { InvoiceModal } from '@/admin/components/dialogs/InvoiceModal';
import { invoiceService } from '@/admin/modules/appointments/services/invoiceService';
import { PaymentSummary as PaymentSummaryType } from '@/admin/modules/appointments/types/Invoice';

interface AppointmentDetailDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
  onCheckIn: (status: CheckInStatus, notes?: string) => void;
  onPaymentComplete: (paymentInfo: any) => void;
}

const AppointmentDetailDialog: React.FC<AppointmentDetailDialogProps> = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus,
  onCheckIn,
  onPaymentComplete
}) => {
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>('not_checked_in');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryType | null>(null);
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (appointment) {
      setCheckInStatus(appointment.status as CheckInStatus);
    }
  }, [appointment]);

  useEffect(() => {
    if (appointment?.id) {
      setCheckInStatus(appointment.status as CheckInStatus);
    }
  }, [appointment?.id, appointment?.status]);

  const loadPaymentData = async () => {
    if (appointment?.id) {
      try {
        const [summary, invoiceList] = await Promise.all([
          invoiceService.getPaymentSummary(appointment.id),
          invoiceService.getInvoicesByVisitId(appointment.id)
        ]);
        setPaymentSummary(summary);
        setInvoices(invoiceList);
      } catch (error) {
        console.error('Failed to load payment data:', error);
      }
    }
  };

  useEffect(() => {
    if (isOpen && appointment) {
      loadPaymentData();
    }
  }, [isOpen, appointment]);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true);
    try {
      onUpdateStatus(newStatus);
      setCheckInStatus(newStatus as CheckInStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (status: CheckInStatus, notes?: string) => {
    setIsLoading(true);
    try {
      await onCheckIn(status, notes);
      setCheckInStatus(status);
    } catch (error) {
      console.error('Failed to check in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = async (paymentInfo: any) => {
    setIsLoading(true);
    try {
      await onPaymentComplete(paymentInfo);
      loadPaymentData();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canCheckIn = appointment?.status === 'confirmed' && checkInStatus === 'not_checked_in';
  const canStartConsultation = checkInStatus === 'checked_in';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        {appointment && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="font-medium">
                      {appointment?.patient?.firstname} {appointment?.patient?.lastname}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{appointment?.patient?.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">{appointment?.patient?.phone}</p>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <p className="font-medium">{appointment?.patient?.gender}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Appointment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <p className="font-medium">
                      {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <Label>Time</Label>
                    <p className="font-medium">
                      {appointment?.slot?.startTime} - {appointment?.slot?.endTime}
                    </p>
                  </div>
                  <div>
                    <Label>Doctor</Label>
                    <p className="font-medium">
                      {appointment?.doctor?.firstname} {appointment?.doctor?.lastname}
                    </p>
                  </div>
                  <div>
                    <Label>Branch</Label>
                    <p className="font-medium">{appointment?.doctorBranch?.name}</p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment & Billing
                </h3>
                
                {paymentSummary && (
                  <PaymentSummary
                    summary={paymentSummary}
                    onViewInvoices={() => setShowInvoiceModal(true)}
                    onAddPayment={() => setShowPaymentDialog(true)}
                    className="w-full"
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h3>
                <div>
                  <Label>Address</Label>
                  <p className="font-medium">{appointment?.doctorBranch?.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="space-y-2">
                {canCheckIn && (
                  <Button onClick={() => setShowCheckInDialog(true)} className="w-full">
                    {isLoading ? (
                      <>
                        Checking In <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Check In <CheckCheck className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}

                {canStartConsultation && (
                  <Button onClick={() => handleStatusUpdate('in_consultation')} className="w-full">
                    {isLoading ? (
                      <>
                        Starting Consultation <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Start Consultation <CheckCheck className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}

                {checkInStatus === 'in_consultation' && (
                  <Button onClick={() => handleStatusUpdate('completed')} className="w-full">
                    {isLoading ? (
                      <>
                        Completing Consultation <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Complete Consultation <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}

                {appointment.status !== 'completed' && (
                  <Button onClick={() => handleStatusUpdate('cancelled')} variant="destructive" className="w-full">
                    {isLoading ? (
                      <>
                        Cancelling Appointment <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Cancel Appointment
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <CheckInDialog
          appointment={appointment}
          open={showCheckInDialog}
          onClose={() => setShowCheckInDialog(false)}
          onCheckIn={handleCheckIn}
        />

        <PaymentProcessDialog
          appointment={appointment}
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          onPaymentComplete={handlePaymentComplete}
        />

        <InvoiceModal
          open={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          invoices={invoices}
          onCreateInvoice={() => {
            // Handle invoice creation
            console.log('Create new invoice');
          }}
          onAddPayment={(invoiceId) => {
            setShowPaymentDialog(true);
            setShowInvoiceModal(false);
          }}
          onDownloadInvoice={(invoiceId) => {
            // Handle invoice download
            console.log('Download invoice:', invoiceId);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailDialog;
