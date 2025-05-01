
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Doctor } from "../../types/Doctor";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DoctorAvailabilitySectionProps {
  doctor: Doctor;
}

const DoctorAvailabilitySection: React.FC<DoctorAvailabilitySectionProps> = ({ doctor }) => {
  const navigate = useNavigate();
  
  const handleViewAvailabilityClick = () => {
    navigate(`/admin/doctor/availability/${doctor.id}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule & Availability</CardTitle>
        <CardDescription>Doctor's working hours and availability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <Clock className="mx-auto h-10 w-10 mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">Schedule information is managed in the Availability section.</p>
          <Button onClick={handleViewAvailabilityClick} variant="outline" className="mt-4">
            View Doctor's Availability
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAvailabilitySection;
