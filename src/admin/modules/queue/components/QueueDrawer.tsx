import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  onDateChange: (date: string) => void;
}

export function QueueDrawer({ isOpen, onClose, selectedDate, onDateChange }: QueueDrawerProps) {
  return (
    <div className={cn(
      "fixed inset-y-0 right-0 z-50 w-80 bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Queue Management</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <label className="block text-sm font-medium mb-2">Date</label>
        <div className="flex gap-2">
          <DatePicker
            value={selectedDate ? new Date(selectedDate) : undefined}
            onChange={(date) => {
              if (date) {
                onDateChange(format(date, 'yyyy-MM-dd'));
              }
            }}
            placeholder="Select date"
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(format(new Date(), 'yyyy-MM-dd'))}
          >
            Today
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Queue for {selectedDate ? format(new Date(selectedDate), 'PPP') : 'No date selected'}
          </div>
        </div>
      </div>
    </div>
  );
}
