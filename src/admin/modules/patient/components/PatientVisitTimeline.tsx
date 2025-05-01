
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PatientVisits from './tabs/PatientVisits';

interface PatientVisitTimelineProps {
  patientId: string;
}

const PatientVisitTimeline: React.FC<PatientVisitTimelineProps> = ({ patientId }) => {
  const navigate = useNavigate();
  
  const handleViewVisitDetails = (visitId: string) => {
    navigate(`/admin/patients/visit/${visitId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Visit History</CardTitle>
              <CardDescription>Patient visit records</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PatientVisits patientId={patientId} onViewDetails={handleViewVisitDetails} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientVisitTimeline;
