
import React from 'react';
import { Doctor } from '../types/Doctor';
import DoctorHorizontalCard from './DoctorHorizontalCard';
import DoctorCardSkeleton from '@/admin/components/skeletons/DoctorCardSkeleton';

interface DoctorListCardProps {
  doctors: Doctor[];
  loading: boolean;
  onEditClick: (doctor: Doctor) => void;
  onPublishClick: (doctor: Doctor) => void;
  onVerifyClick: (doctor: Doctor) => void;
  onVisibilityToggle: (doctor: Doctor, active: boolean) => void;
  onDoctorClick: (doctor: Doctor) => void;
}

const DoctorListCard: React.FC<DoctorListCardProps> = ({
  doctors,
  loading,
  onEditClick,
  onPublishClick,
  onVerifyClick,
  onVisibilityToggle,
  onDoctorClick
}) => {
  if (loading && doctors.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <DoctorCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {doctors.map((doctor) => (
        <DoctorHorizontalCard
          key={doctor.id}
          doctor={doctor}
          onEditClick={onEditClick}
          onPublishClick={onPublishClick}
          onVerifyClick={onVerifyClick}
          onVisibilityToggle={onVisibilityToggle}
          onDoctorClick={onDoctorClick}
        />
      ))}
      
      {loading && doctors.length > 0 && (
        <div className="flex justify-center my-4">
          <div className="animate-pulse bg-gray-200 h-8 w-40 rounded-md"></div>
        </div>
      )}
    </div>
  );
};

export default DoctorListCard;
