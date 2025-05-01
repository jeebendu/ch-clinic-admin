
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/admin/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Edit } from "lucide-react";
import { Doctor } from "../types/Doctor";
import doctorService from "../services/doctorService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorProfileSection from "../components/DoctorDetailView/DoctorProfileSection";
import DoctorProfessionalSection from "../components/DoctorDetailView/DoctorProfessionalSection";
import DoctorAvailabilitySection from "../components/DoctorDetailView/DoctorAvailabilitySection";
import DoctorStatsSection from "../components/DoctorDetailView/DoctorStatsSection";
import DoctorForm from "../components/DoctorForm";

const DoctorDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const fetchedDoctor = await doctorService.getById(parseInt(id));
        setDoctor(fetchedDoctor);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error("Failed to load doctor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleFormClose = () => {
    setShowEditForm(false);
  };

  const handleFormSubmit = async (updatedDoctor: Doctor) => {
    try {
      const resp = await doctorService.saveOrUpdateDoctor(updatedDoctor);
      if (resp.status) {
        toast.success("Doctor updated successfully!");
        setDoctor(updatedDoctor);
      } else {
        toast.error("Error updating doctor!");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error("Failed to update doctor!");
    } finally {
      setShowEditForm(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="space-y-2 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading doctor details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!doctor) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-destructive font-medium">Doctor not found</p>
          <Button variant="outline" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to doctors
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Doctor Details</h2>
          </div>
          <Button onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Doctor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DoctorProfileSection doctor={doctor} />
          
          <div className="col-span-1 md:col-span-2">
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-4">
                <DoctorProfileSection doctor={doctor} detailed />
              </TabsContent>
              
              <TabsContent value="professional" className="mt-4">
                <DoctorProfessionalSection doctor={doctor} />
              </TabsContent>
              
              <TabsContent value="availability" className="mt-4">
                <DoctorAvailabilitySection doctor={doctor} />
              </TabsContent>
              
              <TabsContent value="stats" className="mt-4">
                <DoctorStatsSection doctor={doctor} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {showEditForm && (
        <DoctorForm
          isOpen={showEditForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          doctor={doctor}
        />
      )}
    </AdminLayout>
  );
};

export default DoctorDetailView;
