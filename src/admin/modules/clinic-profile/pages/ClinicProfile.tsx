
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ClinicProfileView from '../components/ClinicProfileView';
import ClinicProfileForm from '../components/ClinicProfileForm';
import ClinicProfileService from '../services/clinicProfileService';
import { ClinicProfile } from '../types/ClinicProfile';

const ClinicProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<ClinicProfile>>({});
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['clinic-profile'],
    queryFn: ClinicProfileService.getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<ClinicProfile>) => ClinicProfileService.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-profile'] });
      setIsEditing(false);
      setEditedProfile({});
      toast({
        title: "Success",
        description: "Clinic profile updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update clinic profile",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (profile) {
      setEditedProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (Object.keys(editedProfile).length > 0) {
      updateMutation.mutate(editedProfile);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading clinic profile</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No profile data found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Profile</h1>
          <p className="text-gray-600">Manage your clinic's public profile information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={updateMutation.isPending}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="view" value={isEditing ? "edit" : "view"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="view" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Profile
          </TabsTrigger>
          <TabsTrigger value="edit" disabled={!isEditing} className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="mt-6">
          <ClinicProfileView profile={profile} />
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          {isEditing && (
            <ClinicProfileForm 
              profile={editedProfile}
              onChange={handleFieldChange}
              isLoading={updateMutation.isPending}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicProfilePage;
