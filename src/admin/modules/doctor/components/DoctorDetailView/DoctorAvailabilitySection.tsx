
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doctor } from "../../types/Doctor";
import { Clock, Calendar, Coffee } from "lucide-react";
import WeeklyScheduleTab from "../../submodules/availability/components/WeeklyScheduleTab";
import BreaksTab from "../../submodules/availability/components/BreaksTab";
import LeavesTab from "../../submodules/availability/components/LeavesTab";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import DoctorService from "../../services/doctorService";
import { toast } from "sonner";

interface DoctorAvailabilitySectionProps {
  doctor: Doctor;
}

const DoctorAvailabilitySection: React.FC<DoctorAvailabilitySectionProps> = ({ doctor }) => {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [doctorBranchObj, setDoctorBranchObj] = useState<DoctorBranch | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");

  useEffect(() => {
    // Set the first branch as default if doctor has branches
    if (doctor.branchList && doctor.branchList.length > 0) {
      setSelectedBranch(doctor.branchList[0]?.branch?.id);
      setDoctorBranchObj(doctor.branchList[0]);
    }
  }, [doctor]);

  useEffect(() => {
    if (selectedBranch && doctor.id) {
      fetchDoctorBranch();
    }
  }, [selectedBranch, doctor.id]);

  const fetchDoctorBranch = async () => {
    if (!selectedBranch || !doctor.id) return;
    
    setLoading(true);
    try {
      const data = await DoctorService.getDoctorBranchByDoctorAndBranchId(doctor.id, selectedBranch);
      setDoctorBranchObj(data);
    } catch (error) {
      console.error("Failed to fetch doctor branch data:", error);
      toast.error("Failed to load branch data");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor.branchList || doctor.branchList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule & Availability</CardTitle>
          <CardDescription>Doctor's working hours and availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No branches assigned to this doctor</p>
            <p className="text-xs text-muted-foreground mt-1">Assign branches to manage availability</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading availability information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule & Availability</CardTitle>
        <CardDescription>Manage doctor's working hours, breaks, and leaves</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Branch Selection if multiple branches */}
        {/* {doctor.branchList && doctor.branchList.length > 1 && (
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Branch</label>
            <select
              value={selectedBranch || ''}
              onChange={(e) => setSelectedBranch(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {doctor.branchList.map((drBranch) => (
                <option key={drBranch.branch.id} value={drBranch.branch.id}>
                  {drBranch.branch.name}
                </option>
              ))}
            </select>
          </div>
        )} */}

        {doctorBranchObj ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Weekly Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="breaks" className="flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                <span>Breaks</span>
              </TabsTrigger>
              <TabsTrigger value="leaves" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Leaves</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="schedule">
                <WeeklyScheduleTab doctorBranch={doctorBranchObj} />
              </TabsContent>
              
              <TabsContent value="breaks">
                <BreaksTab doctorBranch={doctorBranchObj} />
              </TabsContent>
              
              <TabsContent value="leaves">
                <LeavesTab doctorBranch={doctorBranchObj} />
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="text-center py-6">
            <Clock className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Loading branch information...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorAvailabilitySection;
