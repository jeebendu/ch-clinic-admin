
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PatientVisits from './tabs/PatientVisits';

interface PatientVisitTimelineProps {
  patientId: string;
}

const PatientVisitTimeline: React.FC<PatientVisitTimelineProps> = ({ patientId }) => {
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(Date.now());
  
  const handleViewVisitDetails = (visitId: string) => {
    navigate(`/admin/patients/visit/${visitId}`);
  };

  // Listen for branch changes to reload data
  useEffect(() => {
    const handleBranchChange = () => {
      // Force re-render when branch changes
      setReloadKey(Date.now());
    };
    
    // Listen for the custom event
    document.addEventListener('branch-change', handleBranchChange);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('branch-change', handleBranchChange);
    };
  }, []);

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
          <PatientVisits 
            key={reloadKey} 
            patientId={patientId} 
            onViewDetails={handleViewVisitDetails} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientVisitTimeline;
