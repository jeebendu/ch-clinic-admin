import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Doctor } from "../types/Doctor";
import { Appointment } from "../types/Appointment";
import { Slot } from "../types/Slot";
import { Patient } from "../types/Patient";
import { isTakenTodayAppointent, saveAppointment, slotByDrAndBranchId, validateCurrentStep } from "../services/appointmentService";
import { DoctorBranch } from "../types/DoctorClinic";
import { toast } from "@/hooks/use-toast";
import { CombinedStepIndicator } from "./CombinedStepIndicator";
import { NavigationButtons } from "./NavigationButtons";
import { BookingSuccessDialog } from "./steps/BookingSuccessDialog";
import { ReviewStep } from "./steps/ReviewStep";
import { PatientSelectionStep } from "./steps/PatientSelectionStep";
import { DateTimeSelectionStep } from "./steps/DateTimeSelectionStep";
import { ClinicSelectionStep } from "./steps/ClinicSelectionStep";

interface BookAppointmentModalProps {
  doctor?: Doctor;
  initialStep?: number;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ResponseStatus {
  message: String,
  status: boolean
}

export function BookAppointmentModal({
  doctor,
  initialStep = 1,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: BookAppointmentModalProps) {
  const [step, setStep] = useState(initialStep);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("clinic"); // Changed default to clinic
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [slotList, setSlotList] = useState<Slot[]>([]);
  const [patientObj, setPatientObj] = useState<Patient>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slotBookedStatus, setSlotBookedStatus] = useState<ResponseStatus>({
    message: "can book appointment",
    status: true
  });

  const [appointment, setAppointment] = useState<Appointment>({
    id: null,
    appointmentDate: null,
    bookingId: null,
    status: null,
    patient: null,
    slot: null,
    familyMember: null,
    doctorBranch: null,
    doctor: null
  });

  const stepLabels = ["Patient", "Doctor", "Date", "Review"];

  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;

  const getOpenState = () => {
    return isControlled ? controlledOpen : open;
  };

  const setOpenState = (newState: boolean) => {
    if (isControlled) {
      setControlledOpen(newState);
    } else {
      setOpen(newState);
    }
  };


  useEffect(() => {
    if (appointment && appointment?.patient && appointment.patient.id && appointment.doctorBranch) {
      verifyIsTodayAppointmentTaken(appointment);
    }
  }, [appointment?.slot?.id, appointment?.familyMember]);

  const verifyIsTodayAppointmentTaken = async (appointment: Appointment) => {
    try {
      const res = await isTakenTodayAppointent(appointment);
      setSlotBookedStatus(res.data);
    } catch (error) {
      setSlotBookedStatus({
        status: true,
        message: "can book appointment"
      });
    }
  }



  // Set initial clinic when modal opens if provided
  useEffect(() => {
    if (getOpenState()) {
      setStep(initialStep);
    }
  }, [getOpenState(), initialStep]);

  useEffect(() => {
    if (appointment?.doctorBranch) {
      fetchSlotData(appointment?.slot?.date ? new Date(appointment?.slot?.date) : new Date());
    }
  }, [appointment?.doctorBranch])

  // const updateselectedBranch = async (doctorBranch: DoctorBranch) => {

  //   if (!doctorBranch) return;
  //   setAppointment((prev) => ({ ...prev, branch: doctorBranch.branch }));
  //   setAppointment((prev) => ({ ...prev, doctorBranch: doctorBranch }));
  //   setAppointment((prev) => ({ ...prev, doctorBranch: { ...prev.doctorBranch, doctor: doctor } }));

  // }

  const validateCurrentStepWithErrorHandling = (autoAdvance = false) => {
    setErrorMessage(null);

    const isValid = validateCurrentStep(step, appointment, {
      toast: () => ({} as any),
      dismiss: () => { },
      toasts: []
    });

    if (!isValid) {
      switch (step) {
        case 1:
          setErrorMessage("Please select a clinic to proceed");
          break;
        case 2:
          setErrorMessage("Please select both date and time for your appointment");
          break;
        case 3:
          setErrorMessage("Please select a patient for this appointment");
          break;
        default:
          setErrorMessage("Please complete all required fields");
      }
      return false;
    }

    if (autoAdvance && step < 5) {
      setStep(step + 1);
    }

    return true;
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber <= step || validateCurrentStepWithErrorHandling()) {
      setStep(stepNumber);
      setErrorMessage(null);
    }
  };

  const nextStep = () => {
    console.log(appointment?.patient)
    if (!appointment?.patient || !appointment?.patient?.id) {
      toast({
        title: "Validation Error",
        description: "Please select patient from drop down",
        variant: "destructive"
      });
      return;
    }
    if (step === 3 && !slotBookedStatus.status) {
      toast({
        title: "Appointment Booked Today",
        description: slotBookedStatus.message,
        variant: "destructive"
      });
      return;
    }

    if (validateCurrentStepWithErrorHandling() && step < 5) {
      setStep(step + 1);
      setErrorMessage(null);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrorMessage(null);
    }
  };

  const handleBookAppointment = async () => {
    try {

      setIsLoading(true);
      const response = await saveAppointment(appointment);
      if (response.data != null) {
        setIsLoading(false);
        setAppointment(response.data);
        setOpenState(false);
        setSuccessDialogOpen(true);
        toast({
          title: "Appointment Booked",
          description: "Your appointment has been booked successfully.",
          variant: "default"
        });
      } else {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Fail to book appointment please try again!",
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Fail to book appointment please try again!",
        variant: "destructive"
      });
    }

  };

  const handleSlotClick = (slot: Slot) => {
    setAppointment((prev) => ({ ...prev, slot: slot }));
  }

  const onDateSelectHandler = (date: Date) => {
    fetchSlotData(date);
  }





  const fetchSlotData = async (date: Date) => {
    const filterData = {
      doctorBranchDto: appointment.doctorBranch,
      date: date
    }
    const response = await slotByDrAndBranchId(filterData);
    setSlotList(response.data);
  }


  const resetForm = () => {
    setStep(initialStep);
    // setSelectedClinicId(initialClinicId || "");
    setSelectedDate("");
    setSelectedTime("");
    setPaymentMethod("clinic");
    setErrorMessage(null);
  };

  const handlePatientSelection = async (patient: Patient) => {
    setPatientObj(patient);
    setAppointment((prev) => ({ ...prev, patient: patient }));
  }

  const onDoctorBranchSelect = async (drbranch: DoctorBranch) => {
    setAppointment((prev) => ({ ...prev, doctorBranch: drbranch }));
  }


  // Step content rendering with proper titles
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <PatientSelectionStep
            appointmentObj={appointment}
            handlePatientSelection={handlePatientSelection}
          />
        );
      case 2:
        return (
          <ClinicSelectionStep
            appointment={appointment}
            onDoctorBranchSelect={onDoctorBranchSelect}
          />
        );
      case 3:
        return (
          <DateTimeSelectionStep
            slotList={slotList}
            appointmentObj={appointment}
            handleSlotClick={handleSlotClick}
            onDateSelectHandler={onDateSelectHandler}
          />
        );
      case 4:
        return (
          <ReviewStep
            appointmentObj={appointment}
          />
        );
      default:
        return null;
    }
  };

  // Get step icon and title based on current step
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Patient Details";
      case 2:
        return "Select Doctor";
      case 3:
        return "Select Date & Time";
      case 4:
        return "Review Appointment";
      default:
        return "Book Appointment";
    }
  };

  return (
    <>
      <Dialog
        open={getOpenState()}
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            setOpenState(false);
            resetForm();
            setAppointment({
              id: null,
              appointmentDate: null,
              bookingId: null,
              status: null,
              patient: null,
              slot: null,
              familyMember: null,
              doctorBranch: null,
              doctor: null
            })
          } else {
            setOpenState(true);
          }
        }}
      >
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[800px] p-0 overflow-hidden bg-white pointer-events-auto"
          onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing on outside click
          onEscapeKeyDown={(e) => e.preventDefault()} // Prevent closing on escape key
        >
          <DialogHeader className="p-6 pb-2 sticky top-0 bg-white z-10 border-b">
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setOpenState(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogTitle>{getStepTitle()}</DialogTitle>
          </DialogHeader>

          <div className="px-6 pt-4 pb-0">
            {/* Combined step indicator */}
            <div className="sticky top-16 bg-white z-10 pb-4">
              <CombinedStepIndicator
                currentStep={step}
                totalSteps={4}
                stepLabels={stepLabels}
                onStepClick={goToStep}
                validateCurrentStep={validateCurrentStepWithErrorHandling}
              />
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Step content - made scrollable with padding to prevent content being hidden by buttons */}
          <div className="px-6 pb-28 max-h-[60vh] overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons - fixed at bottom with shadow */}
          <div className="sticky bottom-0 bg-white z-10 border-t shadow-md">

            <NavigationButtons
              step={step}
              totalSteps={4}
              onNext={nextStep}
              onPrev={prevStep}
              onConfirm={handleBookAppointment}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <BookingSuccessDialog
        open={successDialogOpen}
        bookingId={appointment?.bookingId}
        appointmentId={appointment?.id != null ? appointment?.id : null}
        onOpenChange={(res) => { setSuccessDialogOpen(res), window.location.reload() }}
        selectedDoctor={null}
        selectedClinic={appointment?.doctorBranch?.branch || null}
        date={appointment?.slot?.date ? new Date(appointment?.slot?.date) : undefined}
        selectedSlot={appointment?.slot}
        doctors={[
        ]}
      />
    </>
  );
}
