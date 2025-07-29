
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash } from "lucide-react";
import { breakService } from "../services/breakService";
import { TimePicker } from "@/admin/components/TimePicker";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { Doctor } from "../../../types/Doctor";
import BranchService from "@/admin/modules/branch/services/branchService";
import DoctorService from "../../../services/doctorService";
import { DoctorBreak } from "../types/DoctorAvailability";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";

interface BreaksTabProps {
  doctorBranch: DoctorBranch;
}



const weekDays = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" }
];

const BreaksTab: React.FC<BreaksTabProps> = ({ doctorBranch }) => {
  const [loading, setLoading] = useState(true);
  const [breaks, setBreaks] = useState<DoctorBreak[]>([]);


  useEffect(() => {
    if (doctorBranch && doctorBranch?.id ) {
      fetchBreaks();
    }
  }, [doctorBranch]);

  const fetchBreaks = async () => {
    setLoading(true);
    try {
      const doctorBreaks = await breakService.getByDoctorBranchId(doctorBranch.id);
      setBreaks(doctorBreaks.data);
    } catch (error) {
      toast.error('Failed to load break schedule');
    } finally {
      setLoading(false);
    }
  };



  const handleAddBreak = () => {
    setBreaks([
      ...breaks,
      { dayOfWeek: "Sunday", breakStart: "12:00", breakEnd: "13:00", description: "Lunch Break", doctorBranch: null }
    ]);
  };

  const handleRemoveBreak = async (id: number) => {
    try {
      const res = await breakService.deleteById(id);
      if (res.data.status) {
        toast.error('Delete sucessfuly');
      } else {
        toast.error('Fail to delete break');
      }
    } catch (e) {
      toast.error('Fail to delete break');
    } finally {
      fetchBreaks();
    }

  };

  const handleBreakChange = (index: number, field: keyof DoctorBreak, value: any) => {
    const newBreaks = [...breaks];
    newBreaks[index] = {
      ...newBreaks[index],
      [field]: field === 'dayOfWeek' ? parseInt(value) : value
    };
    setBreaks(newBreaks);
  };

  const handleSaveBreaks = async () => {
    try {
      const res = await breakService.saveBreaks(breaks, doctorBranch.id);
      if (res.data.status) {
        toast.success('Break schedule saved successfully');
      } else {
        toast.error('Failed to save break schedule');
      }
    } catch (error) {
      console.error('Error saving breaks:', error);
      toast.error('Failed to save break schedule');
    } finally {
      fetchBreaks();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Break Schedule</CardTitle>
        <CardDescription>Configure breaks in doctor's working hours</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {breaks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No breaks configured. Add breaks to doctor's schedule.
                </div>
              )}

              {breaks.map((breakItem, index) => (
                <div key={index} className="grid md:grid-cols-5 gap-4 items-center p-4 border rounded-md bg-muted/10">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Day</label>
                    <Select
                      value={breakItem.dayOfWeek.toString()}
                      onValueChange={(value) => handleBreakChange(index, 'dayOfWeek', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {weekDays.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Start Time</label>
                    <TimePicker
                      value={breakItem.breakStart}
                      onChange={(value) => handleBreakChange(index, 'breakStart', value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">End Time</label>
                    <TimePicker
                      value={breakItem.breakEnd}
                      onChange={(value) => handleBreakChange(index, 'breakEnd', value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Input
                      placeholder="Break description"
                      value={breakItem.description}
                      onChange={(e) => handleBreakChange(index, 'description', e.target.value)}
                    />
                  </div>

                  <div className="flex items-end justify-center">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveBreak(breakItem.id)} className="text-red-500">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <Button variant="outline" onClick={handleAddBreak} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Break
                </Button>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveBreaks}>
                  Save Break Schedule
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BreaksTab;
