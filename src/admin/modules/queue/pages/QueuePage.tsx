
import React from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import QueueBoard from '../components/QueueBoard';

const QueuePage: React.FC = () => {
  return (
    <AdminLayout>
      <QueueBoard />
    </AdminLayout>
  );
};

export default QueuePage;
