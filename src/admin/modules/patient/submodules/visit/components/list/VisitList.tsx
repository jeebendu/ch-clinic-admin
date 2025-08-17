
import React from 'react';
import { Visit } from '../../types/Visit';
import { useVisitActions } from '../../hooks/useVisitActions';
import VisitCard from '../card/VisitCard';
import VisitEditDialog from '../dialogs/VisitEditDialog';
import PaymentDialog from '../dialogs/PaymentDialog';
import VisitReportDialog from '../dialogs/VisitReportDialog';

interface VisitListProps {
  visits: Visit[];
  onUpdate?: () => void;
}

const VisitList: React.FC<VisitListProps> = ({ visits, onUpdate }) => {
  const {
    selectedVisit,
    editDialogOpen,
    setEditDialogOpen,
    paymentDialogOpen,
    setPaymentDialogOpen,
    reportDialogOpen,
    setReportDialogOpen,
    getVisitActions
  } = useVisitActions();

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <VisitCard
          key={visit.id}
          visit={visit}
          actions={getVisitActions(visit)}
        />
      ))}

      <VisitEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        visit={selectedVisit}
        onSave={() => {
          setEditDialogOpen(false);
          onUpdate?.();
        }}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        visit={selectedVisit}
        onPaymentComplete={() => {
          setPaymentDialogOpen(false);
          onUpdate?.();
        }}
      />

      <VisitReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        visit={selectedVisit}
      />
    </div>
  );
};

export default VisitList;
