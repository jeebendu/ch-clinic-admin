
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  mobileDrawer?: boolean;
}

const FormDialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-4xl",
  mobileDrawer = true 
}: FormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} max-h-[90vh]`} mobileDrawer={mobileDrawer}>
        <DialogHeader className="border-b pb-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {children}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
