import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserCheck } from 'lucide-react';
import { CheckInStatus } from '../../modules/appointments/types/PaymentFlow';

interface CheckInDialogProps {
  appointment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { status: CheckInStatus; notes?: string }) => void;
}

const CheckInDialog: React.FC<CheckInDialogProps> = ({ appointment, open, onOpenChange, onConfirm }) => {
  const [status, setStatus] = useState<CheckInStatus>('not_checked_in');
  const [notes, setNotes] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Check-In
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={status === 'not_checked_in' ? 'default' : 'outline'}
                onClick={() => setStatus('not_checked_in')}
              >
                Not Checked In
              </Button>
              <Button
                variant={status === 'CHECKEDIN' ? 'default' : 'outline'}
                onClick={() => setStatus('CHECKEDIN')}
              >
                Checked In
              </Button>
              <Button
                variant={status === 'in_consultation' ? 'default' : 'outline'}
                onClick={() => setStatus('in_consultation')}
              >
                In Consultation
              </Button>
              <Button
                variant={status === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatus('completed')}
              >
                Completed
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm({ status, notes: notes || undefined })}
              className="bg-clinic-primary text-white hover:bg-clinic-primary/90"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;
