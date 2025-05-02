
import React from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useParams } from 'react-router-dom';

const CreatePrescription = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create Prescription</h1>
        <p>Creating prescription for patient ID: {id}</p>
      </div>
    </AdminLayout>
  );
};

export default CreatePrescription;
