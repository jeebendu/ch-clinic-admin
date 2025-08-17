
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VisitList } from '../components/VisitList';
import { VisitTable } from '../components/VisitTable';
import { PaymentDialog } from '../components/PaymentDialog';
import { Visit } from '../types/Visit';

export function VisitListPage() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const handleMarkPayment = (visit: Visit) => {
    setSelectedVisit(visit);
    setPaymentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Patient Visits</h1>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <VisitList onMarkPayment={handleMarkPayment} />
        </TabsContent>
        <TabsContent value="table">
          <VisitTable onMarkPayment={handleMarkPayment} />
        </TabsContent>
      </Tabs>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        visit={selectedVisit}
      />
    </div>
  );
}
