
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "../../types/Doctor";
import { Award, Briefcase, Languages, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DoctorProfessionalSectionProps {
  doctor: Doctor;
}

const DoctorProfessionalSection: React.FC<DoctorProfessionalSectionProps> = ({ doctor }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Qualifications & Experience</h4>
          <div className="flex items-start space-x-2">
            <Award className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">{doctor.qualification || "Not specified"}</p>
              <p className="text-sm text-muted-foreground">{doctor.expYear} years experience</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Biography</h4>
          <p className="whitespace-pre-line">{doctor.biography || "No biography provided."}</p>
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
              doctor.branchList.map((branch) => (
                <Badge key={branch.id} className="bg-brand-primary/10 text-brand-primary border-brand-primary/30">
                  {branch.name}
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
            <div className="font-medium">
              ${doctor.consultationFee || "0"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfessionalSection;
