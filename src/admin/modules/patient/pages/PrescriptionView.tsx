
import React from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useParams } from 'react-router-dom';

const PrescriptionView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Prescription View</h1>
        <p>Viewing prescription for patient ID: {id}</p>
      </div>
    </AdminLayout>
  );
};

export default PrescriptionView;
