
import React from 'react';
import { Doctor } from '../../types/Doctor';
import DoctorHorizontalCard from '../DoctorHorizontalCard';
import { RowAction } from '@/components/ui/RowActions';

interface DoctorCardGridProps {
  doctors: Doctor[];
  onDelete: (id: number) => void;
  onEdit: (doctor: Doctor) => void;
  getRowActions: (doctor: Doctor) => RowAction[];
}

const DoctorCardGrid: React.FC<DoctorCardGridProps> = ({
  doctors,
  onDelete,
  onEdit,
  getRowActions,
}) => {
  const handleDoctorClick = (doctor: Doctor) => {
    // Handle doctor click - could open view dialog
    console.log('Doctor clicked:', doctor);
  };

  const handleVisibilityToggle = (doctor: Doctor, isVisible: boolean) => {
    // Handle visibility toggle
    console.log('Visibility toggle:', doctor, isVisible);
  };

  return (
    <div className="space-y-4">
      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No doctors found</p>
        </div>
      ) : (
        doctors.map((doctor) => (
          <DoctorHorizontalCard
            key={doctor.id}
            doctor={doctor}
            onDoctorClick={handleDoctorClick}
            onEditClick={onEdit}
            onVisibilityToggle={handleVisibilityToggle}
            getRowActions={getRowActions}
          />
        ))
      )}
    </div>
  );
};

export default DoctorCardGrid;
