
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Phone, Mail, Globe } from 'lucide-react';

interface Clinic {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan: any;
}

interface ClinicProfileDialogProps {
  clinic: Clinic | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClinicProfileDialog: React.FC<ClinicProfileDialogProps> = ({
  clinic,
  isOpen,
  onClose
}) => {
  if (!clinic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-clinic-primary" />
            {clinic.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{clinic.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{clinic.email}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Address:</span>
                  <p className="font-medium">{clinic.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicProfileDialog;
