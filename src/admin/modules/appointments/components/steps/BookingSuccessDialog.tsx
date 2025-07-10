import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Check, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Branch } from "../../types/Doctor";
import { Slot } from "../../types/Slot";
import { downloadAppointment } from "../../services/appointmentService";

interface BookingSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDoctor: string | null;
  selectedClinic: Branch | null;
  date: Date | undefined;
  selectedSlot: Slot | null;
  doctors: any[];
  appointmentId: number | null
  bookingId: String 
}


export function BookingSuccessDialog({
  open,
  onOpenChange,
  selectedDoctor,
  selectedClinic,
  date,
  selectedSlot,
  doctors,
  appointmentId,
  bookingId
}: BookingSuccessDialogProps) {
  const doctor = doctors.find(d => d.name === selectedDoctor);
  // const appointmentId = "APT123456"; // Replace with dynamic ID if available
  const handleAppointmentDownload = async () => {
    if (appointmentId != null) {

      const response=await downloadAppointment(appointmentId);
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `appointment-${bookingId}.pdf`; // Set the file name

    link.click();
    window.URL.revokeObjectURL(link.href);

      toast({
        title: "Appointment Form Downloaded",
        description: "Your Appointment Form Downloaded"
      });
    } else {
      toast({
        title: "Error loading branches",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white max-w-md mx-auto pointer-events-auto">
        <AlertDialogHeader>
          <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
          </div>
          <AlertDialogTitle className="text-center text-xl text-green-600">Appointment Confirmed!</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your appointment has been successfully booked
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="bg-gray-50 p-4 rounded-lg w-full max-w-sm mx-auto">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Appointment ID</span>
              <span className="text-sm font-medium">{bookingId}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Doctor</span>
              <span className="text-sm font-medium">{selectedDoctor}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Date & Time</span>
              <span className="text-sm font-medium">
                {selectedSlot?.date ? new Date(selectedSlot.date).toLocaleDateString() : ""}{" "}
                {
                  new Date(`1970-01-01T${selectedSlot?.startTime}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                }
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Clinic</span>
              <span className="text-sm font-medium">{selectedClinic?.name}</span>
            </div>
          </div>

          <div className="my-4 bg-white p-2 border rounded-lg">
 
            {/* <QRCode
              value={String(bookingId)} 
              size={128} // Size of the QR code
              bgColor="#ffffff" // Background color
              fgColor="#000000" // Foreground color
              className="mx-auto"
            /> */}

          </div>

          <p className="text-sm text-center text-muted-foreground">
            Show this QR code at the clinic reception
          </p>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="sm:mt-0">Close</AlertDialogCancel>
          <Button className="sky-button flex items-center justify-center" onClick={handleAppointmentDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}