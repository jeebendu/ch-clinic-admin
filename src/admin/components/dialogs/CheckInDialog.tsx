
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckInStatus } from '@/admin/modules/appointments/types/PaymentFlow';

interface CheckInDialogProps {
  appointment: any;
  open: boolean;
  onClose: () => void;
  onCheckIn: (status: CheckInStatus, notes?: string) => void;
}

const CheckInDialog: React.FC<CheckInDialogProps> = ({
  appointment,
  open,
  onClose,
  onCheckIn
}) => {
  const [notes, setNotes] = useState('');

  const handleCheckIn = () => {
    onCheckIn('checked_in', notes);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Check In Patient</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Patient: {appointment?.patient?.firstname} {appointment?.patient?.lastname}
            </p>
            <p className="text-sm text-muted-foreground">
              Time: {appointment?.slot?.startTime} - {appointment?.slot?.endTime}
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes for check-in"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCheckIn} className="flex-1">
              Check In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;
