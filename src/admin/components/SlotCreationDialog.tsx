import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { SearchableSelect } from "./SearchableSelect";
import { format, parse } from "date-fns";
import { Doctor } from "@/admin/modules/doctors/types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { AllAppointment } from "@/admin/modules/appointments/types/AllAppointment";

interface SlotCreationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  doctors: Doctor[];
  branches: Branch[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  onSlotCreate: (slot: any) => void;
  appointments: AllAppointment[];
}

const SlotCreationDialog: React.FC<SlotCreationDialogProps> = ({
  open,
  setOpen,
  doctors,
  branches,
  selectedDate,
  setSelectedDate,
  onSlotCreate,
  appointments,
}) => {
  const [slotType, setSlotType] = useState("regular");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [recurringDays, setRecurringDays] = useState<string[]>([]);

  const handleCreateSlot = () => {
    if (!selectedDoctor || !selectedBranch || !startTime || !endTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const newSlot = {
      slotType: slotType,
      isRecurring: isRecurring,
      selectedDoctor: selectedDoctor,
      selectedBranch: selectedBranch,
      startTime: startTime,
      endTime: endTime,
      capacity: capacity,
      recurringDays: recurringDays,
      selectedDate: selectedDate,
    };

    onSlotCreate(newSlot);
    setOpen(false);
  };

  const handleDayToggle = (day: string) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter((d) => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      setSelectedDoctor(doctors[0]);
    }
    if (branches.length > 0) {
      setSelectedBranch(branches[0]);
    }
  }, [doctors, branches]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Appointment Slot</DialogTitle>
          <DialogDescription>
            Create a new appointment slot for booking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs defaultValue="regular" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="regular" onClick={() => setSlotType("regular")}>
                Regular
              </TabsTrigger>
              <TabsTrigger value="recurring" onClick={() => setSlotType("recurring")}>
                Recurring
              </TabsTrigger>
            </TabsList>
            <TabsContent value="regular">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <SearchableSelect
                    options={doctors.map((doctor) => ({
                      label: doctor.name,
                      value: doctor.id.toString(),
                    }))}
                    onChange={(value: string) => {
                      const doctor = doctors.find(
                        (doctor) => doctor.id.toString() === value
                      );
                      setSelectedDoctor(doctor || null);
                    }}
                    placeholder="Select a doctor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <SearchableSelect
                    options={branches.map((branch) => ({
                      label: branch.name,
                      value: branch.id.toString(),
                    }))}
                    onChange={(value: string) => {
                      const branch = branches.find(
                        (branch) => branch.id.toString() === value
                      );
                      setSelectedBranch(branch || null);
                    }}
                    placeholder="Select a branch"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="Enter start time"
                    type="time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="Enter end time"
                    type="time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Enter capacity"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="recurring">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Recurring Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <Button
                          key={day}
                          variant={recurringDays.includes(day) ? "default" : "outline"}
                          onClick={() => handleDayToggle(day)}
                        >
                          {day}
                        </Button>
                      )
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="Enter start time"
                    type="time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="Enter end time"
                    type="time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Enter capacity"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Start Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateSlot}>
            Create slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlotCreationDialog;
