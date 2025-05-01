
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, User, FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ReferralInfo } from '../types/PatientReport';
import { format } from 'date-fns';

// Mock data - would be replaced by real API calls
const mockReferrals: ReferralInfo[] = [
  {
    id: 1,
    patientId: 1,
    referralDoctorId: 101,
    referralDoctorName: 'Dr. Jane Smith',
    referralDate: new Date().toISOString(),
    commissionRate: 10,
    notes: 'Patient referred for specialized hearing assessment.',
    status: 'active'
  },
  {
    id: 2,
    patientId: 1,
    referralDoctorId: 102,
    referralDoctorName: 'Dr. Robert Johnson',
    referralDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    commissionRate: 15,
    notes: 'Initial consultation at primary care clinic.',
    status: 'completed'
  }
];

interface PatientReferralsSectionProps {
  patientId: number;
}

const PatientReferralsSection: React.FC<PatientReferralsSectionProps> = ({ patientId }) => {
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<ReferralInfo[]>(mockReferrals);
  const [isAddReferralOpen, setIsAddReferralOpen] = useState(false);
  
  const [newReferral, setNewReferral] = useState<ReferralInfo>({
    patientId,
    referralDate: new Date().toISOString(),
    status: 'active'
  });

  const handleAddReferral = () => {
    const updatedReferrals = [
      {
        ...newReferral,
        id: referrals.length > 0 ? Math.max(...referrals.map(ref => ref.id || 0)) + 1 : 1,
      },
      ...referrals
    ];
    
    setReferrals(updatedReferrals);
    setIsAddReferralOpen(false);
    
    toast({
      title: "Referral Added",
      description: `Patient referral to ${newReferral.referralDoctorName} has been recorded.`
    });
    
    // Reset form
    setNewReferral({
      patientId,
      referralDate: new Date().toISOString(),
      status: 'active'
    });
  };

  const updateReferralStatus = (referralId: number | undefined, newStatus: 'active' | 'completed' | 'cancelled') => {
    if (!referralId) return;
    
    const updatedReferrals = referrals.map(referral => {
      if (referral.id === referralId) {
        return {
          ...referral,
          status: newStatus
        };
      }
      return referral;
    });
    
    setReferrals(updatedReferrals);
    
    toast({
      title: "Referral Status Updated",
      description: `Referral status has been updated to ${newStatus}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Referral Tracking</CardTitle>
              <CardDescription>Track patient referrals to and from external doctors</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddReferralOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Add Referral
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {referrals.length > 0 ? (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        {referral.referralDoctorName}
                        <span className="ml-2">{getStatusBadge(referral.status)}</span>
                      </h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        Referral date: {formatDate(referral.referralDate)}
                      </div>
                    </div>
                    <div className="text-sm">
                      {referral.commissionRate && (
                        <span className="font-medium">
                          Commission: {referral.commissionRate}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {referral.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-sm font-medium mb-1">Notes</h4>
                      <p className="text-sm">{referral.notes}</p>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                    {referral.status === 'active' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600" onClick={() => updateReferralStatus(referral.id, 'completed')}>
                          Mark as Completed
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateReferralStatus(referral.id, 'cancelled')}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No referrals recorded for this patient</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Referral Dialog */}
      <Dialog open={isAddReferralOpen} onOpenChange={setIsAddReferralOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Referral</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Referral Doctor Name</Label>
              <Input
                id="doctorName"
                value={newReferral.referralDoctorName || ''}
                onChange={(e) => setNewReferral({...newReferral, referralDoctorName: e.target.value})}
                placeholder="e.g., Dr. Jane Smith"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                value={newReferral.commissionRate || ''}
                onChange={(e) => setNewReferral({...newReferral, commissionRate: parseFloat(e.target.value)})}
                placeholder="e.g., 15"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newReferral.status} 
                onValueChange={(value: 'active' | 'completed' | 'cancelled') => 
                  setNewReferral({...newReferral, status: value})
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about this referral"
                value={newReferral.notes || ''}
                onChange={(e) => setNewReferral({...newReferral, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddReferralOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddReferral}>Add Referral</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientReferralsSection;
