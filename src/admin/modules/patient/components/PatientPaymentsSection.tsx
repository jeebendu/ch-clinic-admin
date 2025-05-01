
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, CreditCard, Printer, FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { PatientPayment } from '../types/PatientReport';
import { format } from 'date-fns';

// Mock data - would be replaced by real API calls
const mockPayments: PatientPayment[] = [
  {
    id: 1,
    patientId: 1,
    visitId: 1,
    invoiceNumber: 'INV-001-2025',
    amount: 150.00,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'card',
    status: 'paid',
    services: ['Consultation', 'Audiometry Test']
  },
  {
    id: 2,
    patientId: 1,
    visitId: 2,
    invoiceNumber: 'INV-002-2025',
    amount: 250.00,
    paymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'cash',
    status: 'paid',
    services: ['Follow-up Consultation', 'Lab Tests']
  },
  {
    id: 3,
    patientId: 1,
    visitId: 3,
    invoiceNumber: 'INV-003-2025',
    amount: 75.00,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'upi',
    status: 'pending',
    services: ['Prescription Refill']
  }
];

interface PatientPaymentsSectionProps {
  patientId: number;
}

const PatientPaymentsSection: React.FC<PatientPaymentsSectionProps> = ({ patientId }) => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PatientPayment[]>(mockPayments);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PatientPayment | null>(null);
  const [isViewPaymentOpen, setIsViewPaymentOpen] = useState(false);
  
  const [newPayment, setNewPayment] = useState<PatientPayment>({
    patientId,
    amount: 0,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'cash',
    status: 'pending',
    services: []
  });

  const handleAddPayment = () => {
    const updatedPayments = [
      {
        ...newPayment,
        id: payments.length > 0 ? Math.max(...payments.map(payment => payment.id || 0)) + 1 : 1,
        invoiceNumber: `INV-${String(payments.length + 1).padStart(3, '0')}-${new Date().getFullYear()}`
      },
      ...payments
    ];
    
    setPayments(updatedPayments);
    setIsAddPaymentOpen(false);
    
    toast({
      title: "Payment Recorded",
      description: `Payment of ₹${newPayment.amount} has been recorded.`
    });
    
    // Reset form
    setNewPayment({
      patientId,
      amount: 0,
      paymentDate: new Date().toISOString(),
      paymentMethod: 'cash',
      status: 'pending',
      services: []
    });
  };

  const handleViewPayment = (payment: PatientPayment) => {
    setSelectedPayment(payment);
    setIsViewPaymentOpen(true);
  };

  const updatePaymentStatus = (paymentId: number | undefined, newStatus: 'pending' | 'paid' | 'partial' | 'cancelled') => {
    if (!paymentId) return;
    
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status: newStatus
        };
      }
      return payment;
    });
    
    setPayments(updatedPayments);
    
    if (selectedPayment && selectedPayment.id === paymentId) {
      setSelectedPayment({
        ...selectedPayment,
        status: newStatus
      });
    }
    
    toast({
      title: "Payment Status Updated",
      description: `Payment status has been updated to ${newStatus}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Partial</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Receipt className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'upi':
        return <Receipt className="h-4 w-4" />;
      case 'insurance':
        return <Receipt className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
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
              <CardTitle className="text-lg">Billing & Payments</CardTitle>
              <CardDescription>Patient payment history and invoices</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddPaymentOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        {payment.invoiceNumber}
                        <span className="ml-2">{getStatusBadge(payment.status)}</span>
                      </h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        Date: {formatDate(payment.paymentDate)}
                      </div>
                    </div>
                    <div className="text-xl font-semibold">₹{payment.amount.toFixed(2)}</div>
                  </div>
                  
                  {payment.services && payment.services.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-sm font-medium mb-1">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {payment.services.map((service, index) => (
                          <Badge key={index} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewPayment(payment)}>
                      View Details
                    </Button>
                    {payment.status === 'pending' && (
                      <Button size="sm" variant="outline" className="text-green-600" onClick={() => updatePaymentStatus(payment.id, 'paid')}>
                        Mark as Paid
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No payment history for this patient</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Payment Dialog */}
      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={newPayment.amount || ''}
                onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                value={newPayment.paymentMethod} 
                onValueChange={(value: 'cash' | 'card' | 'upi' | 'insurance' | 'other') => 
                  setNewPayment({...newPayment, paymentMethod: value})
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="services">Services (comma separated)</Label>
              <Input
                id="services"
                placeholder="e.g., Consultation, Audiometry Test"
                value={newPayment.services?.join(', ') || ''}
                onChange={(e) => setNewPayment({
                  ...newPayment, 
                  services: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this payment"
                value={newPayment.notes || ''}
                onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newPayment.status} 
                onValueChange={(value: 'pending' | 'paid' | 'partial' | 'cancelled') => 
                  setNewPayment({...newPayment, status: value})
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddPayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Payment Dialog */}
      <Dialog open={isViewPaymentOpen} onOpenChange={setIsViewPaymentOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{selectedPayment.invoiceNumber}</h3>
                  {getStatusBadge(selectedPayment.status)}
                </div>
                
                <div className="border p-4 rounded-md bg-muted/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold text-lg">₹{selectedPayment.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{formatDate(selectedPayment.paymentDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="capitalize">{selectedPayment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visit ID</p>
                      <p>{selectedPayment.visitId || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {selectedPayment.services && selectedPayment.services.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Services</h4>
                    <ul className="list-disc list-inside">
                      {selectedPayment.services.map((service, index) => (
                        <li key={index} className="ml-2">{service}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedPayment.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm">{selectedPayment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex gap-2 justify-between w-full">
              <div>
                {selectedPayment?.status === 'pending' && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-green-600"
                    onClick={() => updatePaymentStatus(selectedPayment.id, 'paid')}
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsViewPaymentOpen(false)}>Close</Button>
                <Button type="button">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientPaymentsSection;
