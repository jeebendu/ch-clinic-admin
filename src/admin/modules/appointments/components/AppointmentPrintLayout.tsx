
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import { Printer, Calendar, User, Phone, MapPin, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Appointment } from "../types/Appointment";
import { toast } from "sonner";

interface AppointmentPrintLayoutProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentPrintLayout: React.FC<AppointmentPrintLayoutProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Appointment_${appointment.id}`,
    onAfterPrint: () => {
      toast.success("Appointment details printed successfully");
      onClose();
    },
    onPrintError: () => {
      toast.error("Failed to print. Please try again.");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Appointment Details</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Printable content */}
        <div ref={componentRef} className="p-8 bg-white">
          <div className="print-container">
            {/* Header with Logo and Clinic Info */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-clinic-primary">
                {appointment.doctorClinic?.clinic?.name || "Medical Clinic"}
              </h1>
              <p className="text-sm text-gray-500">
                {appointment.doctorClinic?.clinic?.address || "123 Medical Street, City"}
              </p>
              {/* <p className="text-sm text-gray-500">
                Phone: {appointment.doctorClinic?.phoneNumber || "(123) 456-7890"}
              </p> */}
            </div>

            <Separator className="my-4" />

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Appointment Information</h2>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-gray-700">
                        {format(new Date(appointment.appointmentDate), "PPP")} at{" "}
                        {format(new Date(appointment.appointmentDate), "p")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Appointment ID</p>
                      <p className="text-gray-700">#{appointment.id}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-gray-700 capitalize">{appointment.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Doctor Information</h2>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Doctor</p>
                      <p className="text-gray-700">
                        Dr. {appointment.doctor?.firstname || ""} {appointment.doctor?.lastname || ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Specialization</p>
                      <p className="text-gray-700">
                        {/* {appointment.doctor?.specialization?.name || "General Medicine"} */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Patient Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Patient Information</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Patient Name</p>
                          <p className="text-gray-700">
                            {appointment.patient?.firstname || ""} {appointment.patient?.lastname || ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-gray-700">{appointment.patient?.user?.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-gray-700">{appointment.patient?.address || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-clinic-primary mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Patient ID</p>
                          <p className="text-gray-700">{appointment.patient?.id || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visit Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Visit Information</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 whitespace-pre-line">
                    This is to confirm your appointment with Dr. {appointment.doctor?.firstname || ""} {appointment.doctor?.lastname || ""} 
                    on {format(new Date(appointment.appointmentDate), "PPPP")} at {format(new Date(appointment.appointmentDate), "p")}.
                    Please arrive 15 minutes before your scheduled appointment time.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="font-medium">Important Notes:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Please bring any relevant medical records or test results.</li>
                      <li>Inform us 24 hours in advance if you need to cancel or reschedule.</li>
                      <li>Face masks are required for all in-person visits.</li>
                      <li>Payment is due at the time of service.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
              <p>Thank you for choosing our services.</p>
              <p className="mt-1">This is a computer-generated document and does not require a signature.</p>
              <p className="mt-1">Printed on: {format(new Date(), "PPP 'at' p")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPrintLayout;
