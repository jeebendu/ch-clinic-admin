
import React, { useState } from 'react';
import { Users, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { QueueDrawer } from './QueueDrawer';
import { useQuery } from '@tanstack/react-query';
import { QueueItem, QueueStats } from '@/admin/modules/queue/types/Queue';

// Mock service for queue data - replace with actual service
const mockQueueData: QueueItem[] = [
  {
    id: '1',
    tokenNumber: 'A001',
    patient: {
      id: 1,
      uid: 'P001',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@email.com',
      mobile: '1234567890',
      gender: 'male',
      dob: '1990-01-01',
      age: 34,
      address: '123 Main St',
      state: 'CA',
      district: 'Los Angeles',
      country: 'USA',
      photoUrl: null,
      refDoctor: null,
      user: {
        email: 'john.doe@email.com',
        phone: '1234567890'
      }
    },
    doctor: {
      id: 1,
      uid: 'D001',
      firstname: 'Dr. Sarah',
      lastname: 'Wilson',
      qualification: 'MBBS, MD',
      expYear: 15,
      online: true,
      imageUrl: null,
      gender: 'female',
      specializationList: []
    },
    branch: {
      id: 1,
      name: 'Main Branch',
      code: 'MB001',
      location: 'Downtown',
      pincode: '12345',
      city: 'Los Angeles',
      district: { name: 'LA District' },
      state: { name: 'California' },
      country: { name: 'USA' },
      clinic: { id: 1, name: 'City Clinic', email: '', contact: '', address: '', plan: 'basic' }
    },
    status: 'waiting',
    source: 'online_appointment',
    priority: 1,
    estimatedWaitTime: 12,
    checkedInTime: new Date(Date.now() - 12 * 60 * 1000),
    createdTime: new Date(Date.now() - 15 * 60 * 1000),
    modifiedTime: new Date()
  },
  {
    id: '2',
    tokenNumber: 'A002',
    patient: {
      id: 2,
      uid: 'P002',
      firstname: 'Emily',
      lastname: 'Johnson',
      email: 'emily.j@email.com',
      mobile: '1234567891',
      gender: 'female',
      dob: '1985-05-15',
      age: 39,
      address: '456 Oak St',
      state: 'CA',
      district: 'Los Angeles',
      country: 'USA',
      photoUrl: null,
      refDoctor: null,
      user: {
        email: 'emily.j@email.com',
        phone: '1234567891'
      }
    },
    doctor: {
      id: 1,
      uid: 'D001',
      firstname: 'Dr. Sarah',
      lastname: 'Wilson',
      qualification: 'MBBS, MD',
      expYear: 15,
      online: true,
      imageUrl: null,
      gender: 'female',
      specializationList: []
    },
    branch: {
      id: 1,
      name: 'Main Branch',
      code: 'MB001',
      location: 'Downtown',
      pincode: '12345',
      city: 'Los Angeles',
      district: { name: 'LA District' },
      state: { name: 'California' },
      country: { name: 'USA' },
      clinic: { id: 1, name: 'City Clinic', email: '', contact: '', address: '', plan: 'basic' }
    },
    status: 'in_consultation',
    source: 'walk_in',
    priority: 2,
    estimatedWaitTime: 8,
    checkedInTime: new Date(Date.now() - 8 * 60 * 1000),
    calledTime: new Date(Date.now() - 2 * 60 * 1000),
    consultationStartTime: new Date(),
    createdTime: new Date(Date.now() - 10 * 60 * 1000),
    modifiedTime: new Date()
  },
  {
    id: '3',
    tokenNumber: 'A003',
    patient: {
      id: 3,
      uid: 'P003',
      firstname: 'Michael',
      lastname: 'Brown',
      email: 'michael.b@email.com',
      mobile: '1234567892',
      gender: 'male',
      dob: '1978-12-03',
      age: 45,
      address: '789 Pine St',
      state: 'CA',
      district: 'Los Angeles',
      country: 'USA',
      photoUrl: null,
      refDoctor: null,
      user: {
        email: 'michael.b@email.com',
        phone: '1234567892'
      }
    },
    doctor: {
      id: 2,
      uid: 'D002',
      firstname: 'Dr. James',
      lastname: 'Smith',
      qualification: 'MBBS, MS',
      expYear: 20,
      online: true,
      imageUrl: null,
      gender: 'male',
      specializationList: []
    },
    branch: {
      id: 1,
      name: 'Main Branch',
      code: 'MB001',
      location: 'Downtown',
      pincode: '12345',
      city: 'Los Angeles',
      district: { name: 'LA District' },
      state: { name: 'California' },
      country: { name: 'USA' },
      clinic: { id: 1, name: 'City Clinic', email: '', contact: '', address: '', plan: 'basic' }
    },
    status: 'waiting',
    source: 'staff_added',
    priority: 3,
    estimatedWaitTime: 25,
    checkedInTime: new Date(Date.now() - 5 * 60 * 1000),
    createdTime: new Date(Date.now() - 5 * 60 * 1000),
    modifiedTime: new Date()
  },
  {
    id: '4',
    tokenNumber: 'A004',
    patient: {
      id: 4,
      uid: 'P004',
      firstname: 'Lisa',
      lastname: 'Anderson',
      email: 'lisa.a@email.com',
      mobile: '1234567893',
      gender: 'female',
      dob: '1992-08-20',
      age: 31,
      address: '321 Elm St',
      state: 'CA',
      district: 'Los Angeles',
      country: 'USA',
      photoUrl: null,
      refDoctor: null,
      user: {
        email: 'lisa.a@email.com',
        phone: '1234567893'
      }
    },
    doctor: {
      id: 1,
      uid: 'D001',
      firstname: 'Dr. Sarah',
      lastname: 'Wilson',
      qualification: 'MBBS, MD',
      expYear: 15,
      online: true,
      imageUrl: null,
      gender: 'female',
      specializationList: []
    },
    branch: {
      id: 1,
      name: 'Main Branch',
      code: 'MB001',
      location: 'Downtown',
      pincode: '12345',
      city: 'Los Angeles',
      district: { name: 'LA District' },
      state: { name: 'California' },
      country: { name: 'USA' },
      clinic: { id: 1, name: 'City Clinic', email: '', contact: '', address: '', plan: 'basic' }
    },
    status: 'no_show',
    source: 'online_appointment',
    priority: 4,
    estimatedWaitTime: 0,
    checkedInTime: new Date(Date.now() - 30 * 60 * 1000),
    createdTime: new Date(Date.now() - 35 * 60 * 1000),
    modifiedTime: new Date()
  }
];

const fetchQueueData = async (): Promise<QueueItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockQueueData;
};

const FloatingQueueButton: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: queueItems = [], isLoading } = useQuery({
    queryKey: ['queue-data'],
    queryFn: fetchQueueData,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });

  const waitingCount = queueItems.filter(item => item.status === 'waiting').length;
  const inConsultationCount = queueItems.filter(item => item.status === 'in_consultation').length;

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsDrawerOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-clinic-primary hover:bg-clinic-secondary text-white",
          "transition-all duration-300 hover:scale-110",
          "md:h-16 md:w-16"
        )}
      >
        <div className="flex flex-col items-center">
          <Users className="h-5 w-5 md:h-6 md:w-6" />
          {waitingCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {waitingCount}
            </Badge>
          )}
        </div>
      </Button>

      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        queueItems={queueItems}
        isLoading={isLoading}
        waitingCount={waitingCount}
        inConsultationCount={inConsultationCount}
      />
    </>
  );
};

export default FloatingQueueButton;
