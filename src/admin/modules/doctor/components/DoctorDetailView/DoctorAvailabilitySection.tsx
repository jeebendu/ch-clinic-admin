
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Doctor } from "../../types/Doctor";
import { Clock, Calendar } from "lucide-react";
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
        <div className="text-center py-6">
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <Clock className="mx-auto h-10 w-10 mb-4 text-muted-foreground/50" />
              <h3 className="text-sm font-medium mb-1">Working Hours</h3>
              <p className="text-xs text-muted-foreground">Weekly schedule</p>
            </div>
            <div className="text-center">
              <Calendar className="mx-auto h-10 w-10 mb-4 text-muted-foreground/50" />
              <h3 className="text-sm font-medium mb-1">Leave Calendar</h3>
              <p className="text-xs text-muted-foreground">Manage time off</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-6 mb-4">Configure doctor's availability, breaks, and leaves</p>
          <Button onClick={handleViewAvailabilityClick} variant="default" className="mt-2">
            Manage Doctor's Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAvailabilitySection;
