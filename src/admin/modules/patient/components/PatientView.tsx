
import React from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from "@/admin/components/AdminLayout";

const PatientView = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Patient View</h1>
        <p>Viewing patient ID: {id}</p>
      </div>
    </AdminLayout>
  );
};

export default PatientView;
