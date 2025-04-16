
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { Visit } from '@/admin/modules/appointments/types/visit';
import { useNavigate } from 'react-router-dom';

interface PatientRecentVisitsProps {
  patientId: string;
  limit?: number;
}

const PatientRecentVisits: React.FC<PatientRecentVisitsProps> = ({ patientId, limit = 3 }) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration
        const mockVisits: Visit[] = [
          {
            id: '1',
            patientId,
            visitDate: new Date().toISOString(),
            visitType: 'routine',
            reasonForVisit: 'Annual check-up',
            createdBy: 'staff-1',
            notes: 'Patient reported no issues. Vitals normal.',
            doctorId: 'doctor-1',
            status: 'closed'
          },
          {
            id: '2',
            patientId,
            visitDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            visitType: 'follow-up',
            reasonForVisit: 'Follow-up on previous treatment',
            createdBy: 'staff-2',
            notes: 'Treatment showing positive results. Continue medication.',
            doctorId: 'doctor-2',
            status: 'follow-up'
          },
          {
            id: '3',
            patientId,
            visitDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            visitType: 'emergency',
            reasonForVisit: 'Sudden sharp pain',
            createdBy: 'staff-1',
            notes: 'Emergency treatment provided. Pain subsided after medication.',
            doctorId: 'doctor-1',
            status: 'closed'
          }
        ];
        
        // Take only the number specified by limit
        setVisits(mockVisits.slice(0, limit));
      } catch (error) {
        console.error('Error fetching patient visits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [patientId, limit]);

  const getVisitTypeColor = (type: string) => {
    switch (type) {
      case 'routine': return 'bg-green-100 text-green-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewAllClick = () => {
    // Navigate to visits tab
    navigate(`/admin/patients/view/${patientId}`, { state: { activeTab: 'visits' } });
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-md animate-pulse">
            <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
            <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (visits.length === 0) {
    return <p className="text-muted-foreground text-sm">No recent visits found.</p>;
  }

  return (
    <div className="space-y-3">
      {visits.map(visit => (
        <div key={visit.id} className="p-3 border rounded-md hover:bg-muted/30 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge className={`${getVisitTypeColor(visit.visitType)}`}>
                {visit.visitType.charAt(0).toUpperCase() + visit.visitType.slice(1)}
              </Badge>
              <span className="font-medium">{visit.reasonForVisit}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
              <Clock className="ml-2 mr-1 h-3.5 w-3.5" />
              {format(new Date(visit.visitDate), 'h:mm a')}
            </div>
          </div>
          {visit.notes && (
            <div className="mt-2 text-sm text-muted-foreground line-clamp-1">
              {visit.notes}
            </div>
          )}
        </div>
      ))}
      {limit && visits.length >= limit && (
        <button 
          onClick={handleViewAllClick}
          className="text-sm text-primary hover:underline w-full text-center mt-2"
        >
          View all visits
        </button>
      )}
    </div>
  );
};

export default PatientRecentVisits;
