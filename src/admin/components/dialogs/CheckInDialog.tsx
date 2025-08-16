
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, MapPin } from 'lucide-react';
import { CheckInStatus } from '@/admin/modules/appointments/types/Appointment';

export interface CheckInDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: any;
  onCheckIn: (status: CheckInStatus, notes?: string) => void;
}

const CheckInDialog = ({ open, onClose, appointment, onCheckIn }: CheckInDialogProps) => {
  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CheckInStatus>('checked_in');

  const handleCheckIn = () => {
    onCheckIn(selectedStatus, notes);
    setNotes('');
    onClose();
  };

  const statusOptions = [
    { value: 'checked_in' as CheckInStatus, label: 'Check In', color: 'bg-green-500' },
    { value: 'no_show' as CheckInStatus, label: 'No Show', color: 'bg-red-500' },
    { value: 'cancelled' as CheckInStatus, label: 'Cancel', color: 'bg-gray-500' }
  ];

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Check-in Patient</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Appointment Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{appointment.patient?.firstname} {appointment.patient?.lastname}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{appointment.slot?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{appointment.slot?.startTime} - {appointment.slot?.endTime}</span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Status</label>
            <div className="flex gap-2">
              {statusOptions.map(option => (
                <Button
                  key={option.value}
                  variant={selectedStatus === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(option.value)}
                  className={selectedStatus === option.value ? option.color : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              placeholder="Add any notes about the check-in..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCheckIn} className="flex-1">
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;
