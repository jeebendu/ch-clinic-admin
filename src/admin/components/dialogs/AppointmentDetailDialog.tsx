
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Building2, 
  Phone, 
  Mail,
  MapPin,
  Hash,
  Edit,
  CheckCircle,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import DoctorProfileDialog from './DoctorProfileDialog';
import PatientProfileDialog from './PatientProfileDialog';
import ClinicProfileDialog from './ClinicProfileDialog';
import BranchProfileDialog from './BranchProfileDialog';
import PaymentProcessDialog from './PaymentProcessDialog';
import CheckInDialog from './CheckInDialog';
import { AppointmentWorkflow, PaymentInfo, CheckInStatus } from '../../modules/appointments/types/PaymentFlow';
import { getAppointmentById } from '../../modules/appointments/services/appointmentService';

interface AppointmentDetailDialogProps {
  appointmentId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentDetailDialog: React.FC<AppointmentDetailDialogProps> = ({
  appointmentId,
  isOpen,
  onClose
}) => {
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [showClinicProfile, setShowClinicProfile] = useState(false);
  const [showBranchProfile, setShowBranchProfile] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  
  // Workflow state
  const [workflow, setWorkflow] = useState<AppointmentWorkflow>({
    appointmentId: appointmentId || 0,
    checkInStatus: 'not_checked_in'
  });

  useEffect(() => {
    if (appointmentId && isOpen) {
      fetchAppointmentData();
    }
  }, [appointmentId, isOpen]);

  const fetchAppointmentData = async () => {
    if (!appointmentId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getAppointmentById(appointmentId);
      setAppointment(response.data);
      setWorkflow(prev => ({ ...prev, appointmentId }));
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      case 'in_progress':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCheckInStatusBadge = (status: CheckInStatus) => {
    switch (status) {
      case 'not_checked_in':
        return <Badge variant="outline" className="text-gray-600">Not Checked In</Badge>;
      case 'checked_in':
        return <Badge className="bg-blue-100 text-blue-800">Checked In</Badge>;
      case 'in_consultation':
        return <Badge className="bg-orange-100 text-orange-800">In Consultation</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(`1970-01-01T${timeString}`), "hh:mm a");
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const getFullLocation = () => {
    if (!appointment?.doctorBranch?.branch) return '';
    
    const parts = [
      appointment.doctorBranch?.branch?.location,
      appointment.doctorBranch?.branch?.district?.name,
      appointment.doctorBranch?.branch?.state?.name,
      appointment.doctorBranch?.branch?.country?.name
    ].filter(Boolean);
    
    if (appointment.doctorBranch?.branch?.pincode) {
      parts.push(`${appointment.doctorBranch.branch.pincode}`);
    }
    
    return parts.join(', ');
  };

  const handlePaymentComplete = (paymentInfo: PaymentInfo) => {
    setWorkflow(prev => ({ ...prev, paymentInfo }));
  };

  const handleCheckInUpdate = (status: CheckInStatus, notes?: string) => {
    setWorkflow(prev => ({
      ...prev,
      checkInStatus: status,
      checkInTime: status === 'checked_in' ? new Date() : prev.checkInTime,
      consultationStartTime: status === 'in_consultation' ? new Date() : prev.consultationStartTime,
      consultationEndTime: status === 'completed' ? new Date() : prev.consultationEndTime,
      notes
    }));
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-clinic-primary" />
            <span className="ml-2">Loading appointment details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchAppointmentData()}>Retry</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Appointment Details - {appointment.bookingId}
              </DialogTitle>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </DialogHeader>

          {/* Appointment Header */}
          <div className="bg-gradient-to-r from-clinic-primary to-clinic-secondary text-white p-4 rounded-lg -mx-6 mx-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  <span className="font-semibold text-xl">{appointment.bookingId}</span>
                </div>
                <Badge className={cn("text-sm", getStatusBadgeStyle(appointment.status))}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Badge>
                {getCheckInStatusBadge(workflow.checkInStatus)}
              </div>
              
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formatDate(appointment.slot?.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    {formatTime(appointment.slot?.startTime)} - {formatTime(appointment.slot?.endTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="overflow-y-auto max-h-[60vh]">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Patient Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-clinic-primary">
                        <User className="h-5 w-5" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <button 
                          onClick={() => setShowPatientProfile(true)}
                          className="font-semibold text-lg text-clinic-primary hover:text-clinic-secondary transition-colors"
                        >
                          {appointment.patient?.firstname} {appointment.patient?.lastname}
                        </button>
                        <p className="text-sm text-gray-500">UHID: {appointment.patient?.uid}</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium">{appointment.patient?.gender}</span>
                        </div>
                        {appointment.patient?.age && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Age:</span>
                            <span className="font-medium">{appointment.patient.age} years</span>
                          </div>
                        )}
                        {appointment.patient?.user?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{appointment.patient.user.email}</span>
                          </div>
                        )}
                        {appointment.patient?.user?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{appointment.patient.user.phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Doctor Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-clinic-primary">
                        <Stethoscope className="h-5 w-5" />
                        Doctor Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <button
                          onClick={() => setShowDoctorProfile(true)}
                          className="font-semibold text-lg text-clinic-primary hover:text-clinic-secondary transition-colors"
                        >
                          Dr. {appointment.doctor?.firstname} {appointment.doctor?.lastname}
                        </button>
                        <p className="text-sm text-gray-500">{appointment.doctor?.qualification}</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3 text-sm">
                        {appointment.doctor?.expYear && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Experience:</span>
                            <span className="font-medium">{appointment.doctor.expYear} years</span>
                          </div>
                        )}
                        {appointment.doctorBranch?.consultationFee && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Consultation Fee:</span>
                            <span className="font-medium text-green-600">₹{appointment.doctorBranch.consultationFee}</span>
                          </div>
                        )}
                        {appointment.doctor?.specializationList && (
                          <div>
                            <span className="text-gray-600 text-sm">Specializations:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {appointment.doctor.specializationList.map((spec: any) => (
                                <Badge key={spec.id} variant="outline" className="text-xs">
                                  {spec.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Clinic & Branch Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-clinic-primary">
                        <Building2 className="h-5 w-5" />
                        Clinic & Branch
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <button 
                          onClick={() => setShowClinicProfile(true)}
                          className="font-semibold text-lg text-clinic-primary hover:text-clinic-secondary transition-colors"
                        >
                          {appointment.doctorBranch?.branch?.clinic?.name}
                        </button>
                        <button
                          onClick={() => setShowBranchProfile(true)}
                          className="block text-sm text-gray-600 hover:text-clinic-primary transition-colors mt-1"
                        >
                          {appointment.doctorBranch?.branch?.name} ({appointment.doctorBranch?.branch?.code})
                        </button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span className="text-sm">{getFullLocation()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Workflow Tab */}
              <TabsContent value="workflow" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Check-in Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Check-in Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Current Status:</span>
                        {getCheckInStatusBadge(workflow.checkInStatus)}
                      </div>
                      
                      {workflow.checkInTime && (
                        <div className="text-sm text-gray-600">
                          Checked in at: {format(workflow.checkInTime, 'MMM d, yyyy hh:mm a')}
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => setShowCheckInDialog(true)}
                        className="w-full"
                        variant="outline"
                      >
                        Update Check-in Status
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Payment Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Payment Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {workflow.paymentInfo ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Status:</span>
                            <Badge className="bg-green-100 text-green-800">Payment Received</Badge>
                          </div>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium">₹{workflow.paymentInfo.amount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Method:</span>
                              <span className="font-medium capitalize">{workflow.paymentInfo.paymentType.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium">{format(workflow.paymentInfo.paymentDate, 'MMM d, yyyy')}</span>
                            </div>
                            {workflow.paymentInfo.transactionId && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Transaction ID:</span>
                                <span className="font-medium">{workflow.paymentInfo.transactionId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Status:</span>
                            <Badge variant="outline" className="text-red-600">Payment Pending</Badge>
                          </div>
                          <Button 
                            onClick={() => setShowPaymentDialog(true)}
                            className="w-full"
                          >
                            Process Payment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Appointment Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">No notes available for this appointment.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Documents & Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">No documents uploaded for this appointment.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialogs */}
      <DoctorProfileDialog
        doctor={appointment.doctor || null}
        isOpen={showDoctorProfile}
        onClose={() => setShowDoctorProfile(false)}
      />

      <PatientProfileDialog
        patient={appointment.patient || null}
        isOpen={showPatientProfile}
        onClose={() => setShowPatientProfile(false)}
      />

      <ClinicProfileDialog
        clinic={appointment.doctorBranch?.branch?.clinic || null}
        isOpen={showClinicProfile}
        onClose={() => setShowClinicProfile(false)}
      />

      <BranchProfileDialog
        branch={appointment.doctorBranch?.branch || null}
        isOpen={showBranchProfile}
        onClose={() => setShowBranchProfile(false)}
      />

      {/* Workflow Dialogs */}
      <PaymentProcessDialog
        appointment={appointment}
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onPaymentComplete={handlePaymentComplete}
      />

      <CheckInDialog
        appointment={appointment}
        isOpen={showCheckInDialog}
        onClose={() => setShowCheckInDialog(false)}
        onCheckIn={handleCheckInUpdate}
      />
    </>
  );
};

export default AppointmentDetailDialog;
