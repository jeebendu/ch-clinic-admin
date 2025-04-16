
import React, { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "../types/Appointment";
import AppointmentPrintLayout from "./AppointmentPrintLayout";

interface PrintAppointmentButtonProps {
  appointment: Appointment;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const PrintAppointmentButton: React.FC<PrintAppointmentButtonProps> = ({
  appointment,
  variant = "outline",
  size = "sm",
}) => {
  const [isPrintLayoutOpen, setIsPrintLayoutOpen] = useState(false);

  const handleOpenPrintLayout = () => {
    setIsPrintLayoutOpen(true);
  };

  const handleClosePrintLayout = () => {
    setIsPrintLayoutOpen(false);
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={handleOpenPrintLayout}
        className="flex items-center gap-1"
      >
        <Printer className="h-4 w-4" />
        <span>Print</span>
      </Button>

      <AppointmentPrintLayout
        appointment={appointment}
        isOpen={isPrintLayoutOpen}
        onClose={handleClosePrintLayout}
      />
    </>
  );
};

export default PrintAppointmentButton;
