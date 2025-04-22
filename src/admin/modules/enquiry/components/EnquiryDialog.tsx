
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EnquiryForm from './EnquiryForm';
import { Enquiry } from '../types/Enquiry';

interface EnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiry?: Enquiry | null;
}

const EnquiryDialog = ({ open, onOpenChange, enquiry }: EnquiryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{enquiry ? 'Edit Enquiry' : 'Add New Enquiry'}</DialogTitle>
        </DialogHeader>
        <EnquiryForm enquiry={enquiry} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryDialog;
