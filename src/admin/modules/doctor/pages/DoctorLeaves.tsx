
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DoctorLeave {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export function DoctorLeaves() {
  const { toast } = useToast();
  const [leaves, setLeaves] = useState<DoctorLeave[]>([
    {
      id: "1",
      startDate: new Date(2025, 3, 20),
      endDate: new Date(2025, 3, 25),
      reason: "Personal leave"
    }
  ]);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [newLeave, setNewLeave] = useState<Partial<DoctorLeave>>({
    reason: ""
  });
  const [dateView, setDateView] = useState<"start" | "end">("start");

  const handleAddLeave = () => {
    if (!newLeave.startDate || !newLeave.endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates for your leave",
        variant: "destructive"
      });
      return;
    }
    
    if (newLeave.endDate < newLeave.startDate) {
      toast({
        title: "Invalid date range",
        description: "End date cannot be before start date",
        variant: "destructive"
      });
      return;
    }

    const leaveId = Date.now().toString();
    setLeaves(prev => [...prev, { ...newLeave, id: leaveId } as DoctorLeave]);
    
    setNewLeave({ reason: "" });
    setIsAddLeaveOpen(false);
    
    toast({
      title: "Leave added",
      description: "Your leave has been successfully added to your calendar."
    });
  };

  const handleDeleteLeave = (id: string) => {
    setLeaves(prev => prev.filter(leave => leave.id !== id));
    
    toast({
      title: "Leave removed",
      description: "The leave period has been removed from your calendar."
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (dateView === "start") {
      setNewLeave(prev => ({ ...prev, startDate: date }));
      setDateView("end");
    } else {
      setNewLeave(prev => ({ ...prev, endDate: date }));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Leaves</h2>
        <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Leave Period</DialogTitle>
              <DialogDescription>
                Set the dates when you'll be unavailable for appointments.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="dates" className="text-base font-medium">
                  {dateView === "start" ? "Select Start Date" : "Select End Date"}
                </Label>
                <div className="border rounded-md p-3">
                  <Calendar
                    mode="single"
                    selected={dateView === "start" ? newLeave.startDate : newLeave.endDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </div>
                
                {newLeave.startDate && (
                  <div className="text-sm text-gray-600">
                    Selected date range: {newLeave.startDate && format(newLeave.startDate, "MMM dd, yyyy")} 
                    {newLeave.endDate && ` to ${format(newLeave.endDate, "MMM dd, yyyy")}`}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="reason" className="text-base font-medium">
                  Reason (optional)
                </Label>
                <Textarea
                  id="reason"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Reason for leave"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddLeaveOpen(false);
                  setNewLeave({ reason: "" });
                  setDateView("start");
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddLeave}
                disabled={!newLeave.startDate || !newLeave.endDate}
              >
                Add Leave
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {leaves.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">You don't have any leaves scheduled.</p>
              <Button
                onClick={() => setIsAddLeaveOpen(true)}
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Leave
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {leaves.map(leave => (
                <div 
                  key={leave.id} 
                  className="flex justify-between items-center border rounded-lg p-4"
                >
                  <div>
                    <div className="font-medium">
                      {format(leave.startDate, "MMM dd, yyyy")} - {format(leave.endDate, "MMM dd, yyyy")}
                    </div>
                    {leave.reason && (
                      <div className="text-sm text-gray-500 mt-1">{leave.reason}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLeave(leave.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
