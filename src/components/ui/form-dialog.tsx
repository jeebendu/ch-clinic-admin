
import React from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  mobileDrawer?: boolean;
}

const FormDialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = "max-w-5xl",
  maxHeight = "max-h-[90vh]",
  mobileDrawer = true 
}: FormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} ${maxHeight}`} mobileDrawer={mobileDrawer}>
        {title && (
          <DialogHeader className="border-b pb-4">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <DialogBody className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </DialogBody>
        {footer && (
          <DialogFooter className="border-t pt-4">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
