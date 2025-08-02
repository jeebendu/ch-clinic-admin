
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/admin/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Doctor } from '../types/Doctor';
import { toast } from 'sonner';
import DoctorProfileSection from '../components/DoctorDetailView/DoctorProfileSection';
import DoctorStatsSection from '../components/DoctorDetailView/DoctorStatsSection';
import DoctorAvailabilitySection from '../components/DoctorDetailView/DoctorAvailabilitySection';
import DoctorInfoCard from '../components/DoctorDetailView/DoctorInfoCard';
import DoctorService from '../services/doctorService';
import { 
  ArrowLeft, 
  User,
  BarChart3,
  Clock,
  Edit
} from 'lucide-react';

const DoctorDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedDoctor = await DoctorService.getById(Number(id));
        setDoctor(fetchedDoctor);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        toast.error('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleSaveDoctor = async (updatedDoctor: Doctor) => {
    try {
      setLoading(true);
      const response = await DoctorService.saveOrUpdateDoctor(updatedDoctor);
      if (response) {
        setDoctor(response);
        toast.success('Doctor information updated successfully');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error('Failed to update doctor information');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    navigate(`/admin/doctor/edit/${id}`);
  };

  const getInitials = (firstname: string = '', lastname: string = '') => {
    return `${firstname.charAt(0) || ''}${lastname.charAt(0) || ''}`.toUpperCase();
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
        {/* Header with Back and Edit buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Doctor Details</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleEditClick} 
              variant="default"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Doctor
            </Button>
          </div>
        </div>

        {/* Doctor Info Card */}
        <DoctorInfoCard doctor={doctor} getInitials={getInitials} />

        {/* Tabs Section */}
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Stats</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Availability</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-4">
            <DoctorProfileSection doctor={doctor} onSave={handleSaveDoctor} loading={loading} />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <DoctorStatsSection doctor={doctor} />
          </TabsContent>
          
          <TabsContent value="availability" className="mt-4">
            <DoctorAvailabilitySection doctor={doctor} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default DoctorDetailView;
