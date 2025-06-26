
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/admin/components/AdminLayout';
import ClinicProfileForm from './clinic-profile/ClinicProfileForm';
import ClinicService from '@/admin/modules/clinics/services/clinic/clinicService';
import { Clinic } from '@/admin/modules/clinics/types/Clinic';

const ClinicProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Partial<Clinic>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchClinicData();
  }, []);

  const fetchClinicData = async () => {
    try {
      setIsLoading(true);
      const clinicData: Clinic = await ClinicService.getById(1);
      setProfile(clinicData);
    } catch (error) {
      console.error('Error fetching clinic data:', error);
      toast({
        title: "Error",
        description: "Failed to load clinic data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Transform ClinicProfile data back to Clinic format
      const clinicData: Partial<Clinic> = {
        id: 1, // Assuming we're editing clinic with ID 1
        name: profile.name || '',
        email: profile.email || '',
        contact: profile.contact || '',
        address: profile.address || '',
        city: profile.city || '',
        pincode: profile.pincode,
        // Add other mappings as needed
      };

      await ClinicService.saveOrUpdate(clinicData);

      toast({
        title: "Success",
        description: "Clinic profile updated successfully."
      });

      navigate('/clinic-profile');
    } catch (error) {
      console.error('Error saving clinic:', error);
      toast({
        title: "Error",
        description: "Failed to update clinic profile.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading clinic profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/clinic-profile')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Clinic Profile</h1>
              <p className="text-gray-600 mt-1">Update your clinic information</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Form */}
        {/* <ClinicProfileForm
          profile={profile}
          onChange={handleFieldChange}
          isLoading={isSaving}
        /> */}
      </div>
    </AdminLayout>
  );
};

export default ClinicProfileEdit;
