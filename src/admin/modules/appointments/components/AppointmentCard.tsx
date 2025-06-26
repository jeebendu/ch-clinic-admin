import React, { useState } from 'react';
import { Appointment } from '../types/Appointment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { 
  Eye,
  Phone, 
  Calendar,
  Monitor,
  Building2,
  Mail,
  Stethoscope,
  GraduationCap,
  Award,
  DollarSign,
  Users,
  PersonStanding,
  User,
  Edit,
  UserCheck,
  Settings,
  PlayCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DoctorProfileDialog from '@/admin/components/dialogs/DoctorProfileDialog';
import PatientProfileDialog from '@/admin/components/dialogs/PatientProfileDialog';
import PaymentProcessDialog from '@/admin/components/dialogs/PaymentProcessDialog';
import CheckInDialog from '@/admin/components/dialogs/CheckInDialog';
import AppointmentDetailDialog from '@/admin/components/dialogs/AppointmentDetailDialog';
import { PaymentInfo, CheckInStatus, AppointmentWorkflow } from '../types/PaymentFlow';
import { toast } from '@/hooks/use-toast';
import { getAppointmentCheckIn } from '../services/appointmentService';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onView: (appointment: Appointment) => void;
  onStart?: (appointment: Appointment) => void;
  onPayment?: (appointment: Appointment) => void;
  onProcess?: (appointment: Appointment) => void;
  onPatientClick?: (appointment: Appointment) => void;
  // onUpdate?:(appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onView,
  onStart,
  onPayment,
  // onUpdate,
  onProcess,
  onPatientClick
}) => {
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  
  // Mock workflow state - in real app this would come from the appointment data
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  
  // const [showCheckInDialog, setShowCheckInDialog] = useState(false);


  const [workflow, setWorkflow] = useState<AppointmentWorkflow>({
    appointmentId: appointment.id,
    checkInStatus: 'not_checked_in'
  });

    const canStart = appointment.status.toString().toLowerCase() === 'upcoming';
  const canProcess = appointment.status.toString().toLowerCase() === 'upcoming';

  
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
      case 'completed':
        return 'bg-green-500 text-white border-green-500 hover:bg-green-600';
      case 'cancelled':
        return 'bg-red-500 text-white border-red-500 hover:bg-red-600';
      case 'in_progress':
        return 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600';
      default:
        return 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600';
    }
  };

  const getCheckInStatusBadge = (status: CheckInStatus) => {
    switch (status) {
      case 'not_checked_in':
        return <Badge variant="outline" className="text-xs">Not Checked In</Badge>;
      case 'checked_in':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Checked In</Badge>;
      case 'in_consultation':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">In Consultation</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Completed</Badge>;
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (paymentInfo?: PaymentInfo) => {
    if (!paymentInfo) {
      return <Badge variant="outline" className="text-red-600 text-xs">Payment Pending</Badge>;
    }
    
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
        Paid
      </Badge>
    );
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return "Time not available";
    try {
      return format(parseISO(`1970-01-01T${timeString}`), "hh:mm a");
    } catch (error) {
      return "Time not available";
    }
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "Date not available";
    try {
      if (typeof dateString === 'object') {
        return format(dateString, "MMM d");
      }
      return format(new Date(dateString), "MMM d");
    } catch (error) {
      return "Date not available";
    }
  };

  const handlePatientClick = () => {
    setShowPatientProfile(true);
    onPatientClick?.(appointment);
  };

  const handleDoctorClick = () => {
    setShowDoctorProfile(true);
  };

  const handleViewClick = () => {
    setShowAppointmentDetail(true);
  };

  const handlePaymentComplete = (paymentInfo: PaymentInfo) => {
    setWorkflow(prev => ({
      ...prev,
      paymentInfo
    }));
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

  function capitalizeName(name: string) {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const getPaymentTypeIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'upi': return '📱';
      case 'bank_transfer': return '🏦';
      case 'insurance': return '🛡️';
      default: return '💰';
    }
  };

  // Calculate age from DOB
  const calculateAge = (dob: string | Date) => {
    if (!dob) return '';
    try {
      const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return '';
    }
  };

  const statusUpdate = async (appointment :Appointment) => {
    try {
      const response = await  getAppointmentCheckIn(appointment.id); 
  
      if (response?.data?.status) {
        toast({
          title: "Checked In",
          description: `Appointment with ${appointment.id} has been checked in.`,
        });

  
      } else {
        toast({
          variant: "destructive",
          title: "Check-In Failed",
          description: response.data.status || "Something went wrong.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Server error during check-in.",
      });
    }
  };
  

  // Get gender icon
  const getGenderIcon = (gender: string) => {
    if (gender?.toLowerCase() === 'male') {
      return <User className="h-3 w-3 text-blue-600" />;
    } else if (gender?.toLowerCase() === 'female') {
      return <Users className="h-3 w-3 text-pink-600" />;
    }
    return <PersonStanding className="h-3 w-3 text-gray-500" />;
  };

  // Determine primary person details (family member or patient)
  const getPrimaryPersonDetails = () => {
    if (appointment?.familyMember) {
      return {
        name: `${capitalizeName(appointment.familyMember.name || '')}`,
        gender: appointment.familyMember.gender,
        age: calculateAge(appointment.familyMember.dob || ''),
        relationship: appointment.familyMember.relationship ? `(${capitalizeName(appointment.familyMember.relationship)})` : '',
        bookedBy: `${capitalizeName(appointment.patient.firstname)} ${capitalizeName(appointment.patient.lastname)}`
      };
    } else {
      return {
        name: `${capitalizeName(appointment?.patient?.firstname)} ${capitalizeName(appointment?.patient?.lastname)}`,
        gender: appointment?.patient?.gender,
        age: calculateAge(appointment?.patient?.dob || ''),
        relationship: '',
        bookedBy: null
      };
    }
  };

  const primaryPerson = getPrimaryPersonDetails();

  return (
    <>
      <Card className="overflow-hidden border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col sm:flex-row">
          {/* Appointment Section - First Column */}
          <div className="flex items-center p-3 sm:p-4 gap-3 w-full sm:w-[320px] bg-gradient-to-br from-primary/5 to-primary/10 flex-shrink-0 border-l-4 border-l-primary">
            <div className="bg-primary text-white p-3 rounded-full">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-lg text-primary mb-1">
                #{appointment.bookingId}
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-1">
                {formatDate(appointment.slot?.date)} • {formatTime(appointment.slot?.startTime)}–{formatTime(appointment.slot?.endTime)}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs font-medium", getStatusBadgeStyle(appointment.status.toString()))}>
                  {appointment.status.toString().charAt(0).toUpperCase() + appointment.status.toString().slice(1).toLowerCase()}
                </Badge>
                {getCheckInStatusBadge(workflow.checkInStatus)}
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 mb-3 sm:mb-0 flex-1">
              
              {/* Patient Info */}
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Patient</div>
                {appointment?.familyMember ? (
                  <div className="font-semibold text-base text-gray-900">
                    {primaryPerson.name} {primaryPerson.relationship}
                  </div>
                ) : (
                  <button
                    onClick={handlePatientClick}
                    className="font-semibold text-base text-primary hover:text-primary/80 transition-colors cursor-pointer text-left"
                  >
                    {primaryPerson.name}
                  </button>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getGenderIcon(primaryPerson.gender || '')}
                  <span>{primaryPerson.gender} • {primaryPerson.age} yrs</span>
                </div>

                {primaryPerson.bookedBy && (
                  <div className="text-xs text-gray-500">
                    Booked by: {primaryPerson.bookedBy}
                  </div>
                )}

                {appointment?.patient?.user?.phone && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="h-3 w-3" />
                    {appointment.patient.user.phone}
                  </div>
                )}
              </div>

              {/* Doctor & Clinic Info */}
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Doctor & Clinic</div>
                <button
                  onClick={handleDoctorClick}
                  className="font-semibold text-base text-primary hover:text-primary/80 transition-colors cursor-pointer block text-left"
                >
                  Dr. {appointment.doctorBranch?.doctor?.firstname} {appointment?.doctorBranch?.doctor?.lastname}
                </button>
                <div className="text-sm text-gray-600">
                  <div className="font-medium">
                    {appointment.doctorBranch?.branch?.clinic?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appointment.doctorBranch?.branch?.name}
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Payment</div>
                {appointment.doctorBranch?.consultationFee && (
                  <div className="text-lg font-bold text-green-600">
                    ₹{appointment.doctorBranch.consultationFee}
                  </div>
                )}
                
                {getPaymentStatusBadge(workflow.paymentInfo)}

                {/* Payment Details Display */}
                {workflow.paymentInfo && (
                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center gap-1 text-xs">
                      <span>{getPaymentTypeIcon(workflow.paymentInfo.paymentType)}</span>
                      <span className="font-medium capitalize">{workflow.paymentInfo.paymentType.replace('_', ' ')}</span>
                    </div>
                    {workflow.paymentInfo.transactionId && (
                      <div className="text-xs text-gray-600 mt-1">
                        ID: {workflow.paymentInfo.transactionId}
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Flow for Pending */}
                {!workflow.paymentInfo && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-xs h-7 mt-1"
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    Process Payment
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end items-start mt-2 sm:mt-0 sm:w-[100px] flex-shrink-0">
              {/* <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={handleViewClick}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View Details</span>
                </Button>
              </div> */}

               <div className="flex flex-col items-end gap-1">
              <div className="flex flex-wrap justify-end gap-2 mb-1">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={handleViewClick}>
                  <Eye className="h-3 w-3" />
                  <span className="sr-only md:not-sr-only md:inline-block md:ml-1 text-xs">View</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => onEdit(appointment)}>
                  <Edit className="h-3 w-3" />
                  <span className="sr-only md:not-sr-only md:inline-block md:ml-1 text-xs">Edit</span>
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-end gap-2">
                {/* Check-In Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-xs"
                  onClick={() => statusUpdate(appointment)}
                >
                  <UserCheck className="h-3 w-3" />
                  <span className="sr-only md:not-sr-only md:inline-block md:ml-1 text-xs">Check-In</span>
                </Button>

                {/* Payment Button */}
                {!workflow.paymentInfo && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-xs"
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <DollarSign className="h-3 w-3" />
                    <span className="sr-only md:not-sr-only md:inline-block md:ml-1 text-xs">Payment</span>
                  </Button>
                )}

                {canProcess && onProcess && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 border-clinic-primary text-clinic-primary hover:bg-clinic-primary hover:text-white text-xs"
                    onClick={() => onProcess(appointment)}
                  >
                    <Settings className="h-3 w-3" />
                    <span className="sr-only md:not-sr-only md:inline-block md:ml-1 text-xs">Process</span>
                  </Button>
                )}
                {canStart && onStart && (
                  <Button 
                    size="sm" 
                    className="h-8 bg-clinic-primary hover:bg-clinic-secondary text-xs"
                    onClick={() => onStart(appointment)}
                  >
                    <PlayCircle className="h-3 w-3" />
                    <span className="sr-only md:not-sr-only md:inline-block md:ml-1 text-xs">Start</span>
                  </Button>
                )}
              </div>
              </div>
              </div>


           
          </div>
        </div>
      </Card>

      {/* Profile Dialogs */}
      <DoctorProfileDialog
        doctor={appointment?.doctorBranch?.doctor || null}
        isOpen={showDoctorProfile}
        onClose={() => setShowDoctorProfile(false)}
      />

      <PatientProfileDialog
        patient={appointment.patient || null}
        isOpen={showPatientProfile}
        onClose={() => setShowPatientProfile(false)}
      />

      {/* Payment Process Dialog */}
      <PaymentProcessDialog
        appointment={appointment}
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Check-In Dialog */}
      {/* <CheckInDialog
        appointment={appointment}
        isOpen={showCheckInDialog}
        onClose={() => setShowCheckInDialog(false)}
        onCheckIn={handleCheckInUpdate}
      /> */}

      {/* Appointment Detail Dialog */}
      <AppointmentDetailDialog
        appointmentId={appointment.id}
        isOpen={showAppointmentDetail}
        onClose={() => setShowAppointmentDetail(false)}
      />
    </>
  );
};

export default AppointmentCard;
