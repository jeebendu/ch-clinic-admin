import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/admin/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Doctor } from '../types/Doctor';
import doctorService from '../services/doctorService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import DoctorProfileSection from '../components/DoctorDetailView/DoctorProfileSection';
import DoctorProfessionalSection from '../components/DoctorDetailView/DoctorProfessionalSection';
import DoctorStatsSection from '../components/DoctorDetailView/DoctorStatsSection';
import DoctorAvailabilitySection from '../components/DoctorDetailView/DoctorAvailabilitySection';

const DoctorDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedDoctor = await doctorService.getById(id);
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
      const response = await doctorService.saveOrUpdate(updatedDoctor);
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

  return (
    <AdminLayout>
      <div className="container mx-auto mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="professional">Professional Details</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          <div className="border p-4 rounded-md mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            ) : doctor ? (
              <>
                <TabsContent value="profile">
                  <DoctorProfileSection doctor={doctor} onSave={handleSaveDoctor} loading={loading} />
                </TabsContent>
                <TabsContent value="professional">
                  <DoctorProfessionalSection doctor={doctor} onSave={handleSaveDoctor} loading={loading} />
                </TabsContent>
                <TabsContent value="stats">
                  <DoctorStatsSection doctor={doctor} />
                </TabsContent>
                <TabsContent value="availability">
                  <DoctorAvailabilitySection doctor={doctor} />
                </TabsContent>
              </>
            ) : (
              <div className="text-red-500">Doctor not found.</div>
            )}
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default DoctorDetailView;
