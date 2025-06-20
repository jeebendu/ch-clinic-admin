
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "@/admin/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import doctorService from "../../../services/doctorService";
import WeeklyScheduleTab from "../components/WeeklyScheduleTab";
import BreaksTab from "../components/BreaksTab";
import LeavesTab from "../components/LeavesTab";
import HolidaysTab from "../components/HolidaysTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import BranchService from "@/admin/modules/branch/services/branchService";

const DoctorScheduleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [branchObj, setBranchObj] = useState<Branch>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("weekly-schedule");

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const fetchedDoctor = await doctorService.getById(Number(id));
        setDoctor(fetchedDoctor);

        // Set the first branch as default if doctor has branches
        if (fetchedDoctor.branchList && fetchedDoctor.branchList.length > 0) {
          setSelectedBranch(fetchedDoctor.branchList[0]?.branch?.id);
          setBranchObj(fetchedDoctor.branchList[0]?.branch);
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        toast.error('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBranchChange = (branchId: string) => {
    if (branchId) {
      setSelectedBranch(parseInt(branchId));
    }
  };


  useEffect(() => {
    fetchingBranchById();
  }, [selectedBranch]);

    const fetchingBranchById = async () => {
    try {
      const res = await BranchService.getById(selectedBranch);
      setBranchObj(res.data);
    } catch (error) {
      console.log("Fail to fetching branch data");
    }
  }


  const handleBackClick = () => {
    navigate(`/admin/doctor/view/${id}`);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleBackClick} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Doctor
            </Button>
            <h1 className="text-2xl font-semibold">
              {doctor ? `${doctor.firstname} ${doctor.lastname}'s Schedule` : 'Doctor Schedule'}
            </h1>
          </div>
        </div>


        {loading ? (
          <Card>
            <CardContent className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading doctor information...</p>
              </div>
            </CardContent>
          </Card>
        ) : doctor ? (
          <>
            <Card className="mb-6">
              <CardContent className="py-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="col-span-3">
                    <h2 className="text-lg font-medium mb-1">Select Branch</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure availability for a specific branch
                    </p>
                    <Select
                      value={selectedBranch?.toString()}
                      onValueChange={handleBranchChange}
                    >
                      <SelectTrigger className="w-full md:w-[250px]">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctor.branchList && doctor.branchList.map((drBranch: DoctorBranch) => (
                          <SelectItem key={drBranch?.branch?.id} value={drBranch?.branch?.id.toString()}>
                            {drBranch?.branch?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex justify-end items-center">
                    <Button variant="default">
                      Save Configuration
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="weekly-schedule">Weekly Schedule</TabsTrigger>
                <TabsTrigger value="breaks">Breaks</TabsTrigger>
                <TabsTrigger value="leaves">Leaves</TabsTrigger>
                <TabsTrigger value="holidays">Holidays</TabsTrigger>
              </TabsList>

              {selectedBranch && branchObj ? (
                <>
                  <TabsContent value="weekly-schedule">
                    <WeeklyScheduleTab doctor={doctor} branchObj={branchObj} />
                  </TabsContent>
                  <TabsContent value="breaks">
                    <BreaksTab doctor={doctor} branchObj={branchObj} />
                  </TabsContent>
                  <TabsContent value="leaves">
                    <LeavesTab doctor={doctor} branchObj={branchObj} />
                  </TabsContent>
                  <TabsContent value="holidays">
                    <HolidaysTab doctor={doctor} branchObj={branchObj} />
                  </TabsContent>
                </>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Please select a branch to configure doctor's schedule
                    </p>
                  </CardContent>
                </Card>
              )}
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-red-500">Doctor not found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default DoctorScheduleView;
