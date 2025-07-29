
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, Plus, Trash } from "lucide-react";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { leaveService } from "../services/leaveService";
import { DoctorLeave } from "../types/DoctorAvailability";
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import BranchService from "@/admin/modules/branch/services/branchService";
import DoctorService from "../../../services/doctorService";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";

interface LeavesTabProps {
  doctorBranch: DoctorBranch;
}

const LeavesTab: React.FC<LeavesTabProps> = ({ doctorBranch }) => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // const [doctor, setDoctor] = useState<Doctor>(null);
  // const [branch, setBranch] = useState<Branch>(null);

  const [newLeave, setNewLeave] = useState<DoctorLeave>({
    id: null,
    doctorBranch: doctorBranch,
    leaveEnd: new Date(),
    leaveStart: new Date(),
    reason: "",
    approved: false
  });
  leaveStart: Date;

  useEffect(() => {
    if (doctorBranch && doctorBranch?.id) {
      setNewLeave((prev) => ({ ...prev, doctorBranch: doctorBranch }))
      fetchLeaves();
    }
  }, [doctorBranch]);


  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const doctorLeaves = await leaveService.getAllByDoctorBranchId(doctorBranch.id);
      setLeaves(doctorLeaves.data);
    } catch (error) {
      console.error('Error fetching doctor leaves:', error);
      toast.error('Failed to load leave information');
    } finally {
      setLoading(false);
    }
  };




  const handleAddLeave = async () => {
    try {
      // Validation
      if (!newLeave.leaveStart || !newLeave.leaveEnd) {
        toast.error("Please select start and end dates");
        return;
      }

      if (isAfter(new Date(newLeave.leaveStart), new Date(newLeave.leaveEnd))) {
        toast.error("End date must be after start date");
        return;
      }

      const res = await leaveService.saveLeave(newLeave);
      if (res.data.status) {
        toast.success('Leave added successfully');
      } else {
        toast.error('Failed to add leave');
      }
      setIsAddDialogOpen(false);

    } catch (error) {
      console.error('Error adding leave:', error);
      toast.error('Failed to add leave');
    } finally {
      fetchLeaves();
    }
  };

  const handleDeleteLeave = async (id: number) => {
    try {
      const res = await leaveService.deleteLeave(id);
      if (res.data.status) {
        toast.success('Leave deleted successfully');
      } else {
        toast.error('Failed to delete leave');
      }
    } catch (error) {
      toast.error('Failed to delete leave');
    } finally {
      fetchLeaves();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Leave Management</CardTitle>
            <CardDescription>Schedule doctor's leaves and time off</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Leave
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {leaves.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No leaves scheduled</p>
                  <p className="text-xs text-muted-foreground mt-1">Add leaves when the doctor is unavailable</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaves.map((leave) => (
                    <div key={leave.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">
                          {format(new Date(leave.leaveStart), "dd MMM yyyy")} - {format(new Date(leave.leaveEnd), "dd MMM yyyy")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{leave.reason || "No reason provided"}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLeave(leave.id)} className="text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Leave Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Leave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <DatePicker
                  date={newLeave.leaveStart ? new Date(newLeave.leaveStart) : undefined}
                  onDateChange={(date) => setNewLeave({ ...newLeave, leaveStart: date })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <DatePicker
                  date={newLeave.leaveEnd ? new Date(newLeave.leaveEnd) : undefined}
                  onDateChange={(date) => setNewLeave({ ...newLeave, leaveEnd: date })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason</label>
              <Textarea
                placeholder="Reason for leave"
                value={newLeave.reason || ""}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLeave}>Add Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeavesTab;
