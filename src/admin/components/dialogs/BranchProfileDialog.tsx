
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin } from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  city: string;
  state: any;
  country: any;
  district: any;
  pincode: string;
  clinic: any;
}

interface BranchProfileDialogProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
}

const BranchProfileDialog: React.FC<BranchProfileDialogProps> = ({
  branch,
  isOpen,
  onClose
}) => {
  if (!branch) return null;

  const getFullLocation = () => {
    const parts = [
      branch.location,
      branch.district?.name,
      branch.state?.name,
      branch.country?.name
    ].filter(Boolean);
    
    if (branch.pincode) {
      parts.push(branch.pincode);
    }
    
    return parts.join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-clinic-primary" />
            {branch.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Branch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Branch Code:</span>
                  <p className="font-medium">{branch.code}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">City:</span>
                  <p className="font-medium">{branch.city}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-sm text-gray-600">Full Address:</span>
                  <p className="font-medium">{getFullLocation()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BranchProfileDialog;
