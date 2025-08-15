import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type CheckInStatus = "pending" | "checkedIn" | "completed" | "cancelled";

interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any; // Replace 'any' with your appointment type
}

const CheckInDialog = ({ isOpen, onClose, appointment }: CheckInDialogProps) => {
  const [status, setStatus] = useState<CheckInStatus>("checkedIn");

  const handleStatusChange = (newStatus: CheckInStatus) => {
    setStatus(newStatus);
  };

  const handleCheckIn = () => {
    // Implement your check-in logic here, e.g., API call
    console.log("Checking in appointment:", appointment.id, "with status:", status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Check-In</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Appointment Details</h3>
              <p>Patient: {appointment.patientName}</p>
              <p>Doctor: {appointment.doctorName}</p>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Check-In Status</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="checkedIn"
                    checked={status === "checkedIn"}
                    onCheckedChange={(checked) => {
                      if (checked) handleStatusChange("checkedIn");
                    }}
                  />
                  <label
                    htmlFor="checkedIn"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Checked In
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="completed"
                    checked={status === "completed"}
                    onCheckedChange={(checked) => {
                      if (checked) handleStatusChange("completed");
                    }}
                  />
                  <label
                    htmlFor="completed"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Completed
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cancelled"
                    checked={status === "cancelled"}
                    onCheckedChange={(checked) => {
                      if (checked) handleStatusChange("cancelled");
                    }}
                  />
                  <label
                    htmlFor="cancelled"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Cancelled
                  </label>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCheckIn}>
            Confirm Check-In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;
