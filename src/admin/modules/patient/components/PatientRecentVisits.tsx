
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Visit {
  id: number;
  date: Date;
  reason: string;
  doctor: {
    id: number;
    firstname: string;
    lastname: string;
  };
  status: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

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
            id: 1,
            date: new Date(),
            reason: 'Regular check-up',
            doctor: {
              id: 1,
              firstname: 'John',
              lastname: 'Smith'
            },
            status: 'Completed',
            followUpRequired: true,
            followUpDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          },
          {
            id: 2,
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            reason: 'Flu symptoms',
            doctor: {
              id: 2,
              firstname: 'Sarah',
              lastname: 'Johnson'
            },
            status: 'Completed',
            followUpRequired: false
          },
          {
            id: 3,
            date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
            reason: 'Annual physical',
            doctor: {
              id: 1,
              firstname: 'John',
              lastname: 'Smith'
            },
            status: 'Completed',
            followUpRequired: false
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

  const handleViewAllClick = () => {
    // Navigate to visits tab
    navigate(`/admin/patients/view/${patientId}`, { state: { activeTab: 'visits' } });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
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
            <div>
              <div className="font-medium">{visit.reason}</div>
              <div className="flex items-center text-sm">
                <User className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                <span>Dr. {visit.doctor.firstname} {visit.doctor.lastname}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {formatDate(visit.date)}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-between items-center">
            <Badge variant={visit.status === 'Completed' ? 'outline' : 'secondary'}>
              {visit.status}
            </Badge>
            {visit.followUpRequired && visit.followUpDate && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Follow-up: {formatDate(visit.followUpDate)}
              </div>
            )}
          </div>
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
