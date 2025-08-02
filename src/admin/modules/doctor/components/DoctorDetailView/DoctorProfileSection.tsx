
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Doctor } from "../../types/Doctor";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Award, 
  Languages, 
  GraduationCap, 
  Edit,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Briefcase
} from "lucide-react";

export interface DoctorProfileSectionProps {
  doctor: Doctor;
  onSave?: (updatedDoctor: Doctor) => Promise<void>;
  loading?: boolean;
}

const DoctorProfileSection: React.FC<DoctorProfileSectionProps> = ({ doctor, onSave, loading }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleQuickEdit = () => {
    setIsEditing(true);
    // For now, just show a toast - you can implement inline editing later
    console.log('Quick edit mode activated');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleQuickEdit}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Quick Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Basic Details</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">Dr. {doctor.firstname} {doctor.lastname}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{doctor.gender === 1 ? 'Male' : doctor.gender === 2 ? 'Female' : 'Other'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joining Date</p>
                    <p className="font-medium">{doctor.joiningDate ? new Date(doctor.joiningDate).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{doctor.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{doctor.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{doctor.city || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Qualifications & Experience</h4>
            <div className="flex items-start space-x-2">
              <Award className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{doctor.qualification || "Not specified"}</p>
                <p className="text-sm text-muted-foreground">{doctor.expYear || 0} years experience</p>
                {doctor.desgination && (
                  <p className="text-sm text-muted-foreground">Designation: {doctor.desgination}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">About</h4>
            <p className="whitespace-pre-line">{doctor.about || doctor.biography || "No information provided."}</p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.specializationList?.length > 0 ? (
                doctor.specializationList.map((specialization) => (
                  <Badge key={specialization.id} variant="secondary">
                    {specialization.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specializations listed.</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Services</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.serviceList?.length > 0 ? (
                doctor.serviceList.map((service) => (
                  <Badge key={service.id} variant="outline">
                    {service.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No services listed.</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Languages</h4>
            <div className="flex items-start space-x-2">
              <Languages className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {doctor.languageList?.length > 0 ? (
                  doctor.languageList.map((language) => (
                    <Badge key={language.id} variant="outline">
                      {language.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No languages listed.</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Associated Branches</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.branchList?.length > 0 ? (
                doctor.branchList.map((drBranch) => (
                  <Badge key={drBranch?.branch?.id} className="bg-brand-primary/10 text-brand-primary border-brand-primary/30">
                    {drBranch.branch.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No branches assigned.</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Consultation Fee</h4>
            <div className="flex items-start space-x-2">
              <DollarSign className="h-5 w-5 text-primary mt-0.5" />
              <div className="font-medium">
                ${doctor.consultationFee || doctor.feesAmount || "0"}
                {doctor.followupAmount && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (Follow-up: ${doctor.followupAmount})
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfileSection;
