
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QueuePage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Queue Management</h1>
        <p className="text-muted-foreground">Manage patient queue and workflow</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Patient Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Queue management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueuePage;
