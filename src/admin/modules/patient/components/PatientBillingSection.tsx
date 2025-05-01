
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpDown, 
  Download, 
  Receipt, 
  CreditCard,
  Calendar,
  FileText,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Payment {
  id: string;
  date: Date;
  amount: number;
  method: string;
  status: 'success' | 'pending' | 'failed';
  reference: string;
  visitId?: string;
  invoiceId?: string;
}

interface Invoice {
  id: string;
  date: Date;
  dueDate: Date;
  amount: number;
  paid: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  visitId?: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PatientBillingSectionProps {
  patientId: number;
}

const PatientBillingSection: React.FC<PatientBillingSectionProps> = ({ patientId }) => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [billingTab, setBillingTab] = useState('invoices');
  const [openInvoice, setOpenInvoice] = useState<string | null>(null);

  useEffect(() => {
    // This would be replaced with an API call in production
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockInvoices: Invoice[] = [
          {
            id: "INV-2025-001",
            date: new Date(2025, 3, 28),
            dueDate: new Date(2025, 4, 28),
            amount: 250.00,
            paid: 250.00,
            status: 'paid',
            visitId: "1",
            items: [
              {
                id: "ITEM-1",
                description: "Consultation Fee",
                quantity: 1,
                unitPrice: 150.00,
                total: 150.00
              },
              {
                id: "ITEM-2",
                description: "Audiometry Test",
                quantity: 1,
                unitPrice: 100.00,
                total: 100.00
              }
            ]
          },
          {
            id: "INV-2025-023",
            date: new Date(2025, 2, 15),
            dueDate: new Date(2025, 3, 15),
            amount: 300.00,
            paid: 150.00,
            status: 'partial',
            visitId: "2",
            items: [
              {
                id: "ITEM-1",
                description: "Follow-up Consultation",
                quantity: 1,
                unitPrice: 100.00,
                total: 100.00
              },
              {
                id: "ITEM-2",
                description: "Hearing Test",
                quantity: 1,
                unitPrice: 150.00,
                total: 150.00
              },
              {
                id: "ITEM-3",
                description: "Medication (Antibiotics)",
                quantity: 1,
                unitPrice: 50.00,
                total: 50.00
              }
            ]
          },
          {
            id: "INV-2025-045",
            date: new Date(2025, 0, 5),
            dueDate: new Date(2025, 1, 5),
            amount: 400.00,
            paid: 0,
            status: 'overdue',
            visitId: "3",
            items: [
              {
                id: "ITEM-1",
                description: "Emergency Consultation",
                quantity: 1,
                unitPrice: 200.00,
                total: 200.00
              },
              {
                id: "ITEM-2",
                description: "Comprehensive Test",
                quantity: 1,
                unitPrice: 150.00,
                total: 150.00
              },
              {
                id: "ITEM-3",
                description: "Medication",
                quantity: 1,
                unitPrice: 50.00,
                total: 50.00
              }
            ]
          }
        ];
        
        const mockPayments: Payment[] = [
          {
            id: "PAY-2025-001",
            date: new Date(2025, 3, 28),
            amount: 250.00,
            method: "Credit Card",
            status: 'success',
            reference: "TXN-28374623",
            invoiceId: "INV-2025-001"
          },
          {
            id: "PAY-2025-023",
            date: new Date(2025, 2, 15),
            amount: 150.00,
            method: "Cash",
            status: 'success',
            reference: "CASH-934582",
            invoiceId: "INV-2025-023"
          },
          {
            id: "PAY-2025-024",
            date: new Date(2025, 2, 20),
            amount: 100.00,
            method: "Credit Card",
            status: 'pending',
            reference: "TXN-29385734",
            invoiceId: "INV-2025-023"
          }
        ];
        
        setInvoices(mockInvoices);
        setPayments(mockPayments);
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800">Partially Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-gray-100 text-gray-800">Unpaid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'unpaid':
      case 'overdue':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const toggleInvoice = (id: string) => {
    setOpenInvoice(openInvoice === id ? null : id);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <div className="space-y-2 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading billing information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Billing & Payments</CardTitle>
            <CardDescription>Track invoices and payment history</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={billingTab} onValueChange={setBillingTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices">
            {invoices.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <React.Fragment key={invoice.id}>
                          <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleInvoice(invoice.id)}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{format(invoice.date, 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{format(invoice.dueDate, 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${invoice.paid.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <ArrowUpDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {/* Invoice details */}
                          {openInvoice === invoice.id && (
                            <TableRow>
                              <TableCell colSpan={7} className="p-0">
                                <div className="p-4 bg-muted/20">
                                  <h4 className="font-medium mb-2">Invoice Details</h4>
                                  
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[60%]">Description</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {invoice.items.map((item) => (
                                        <TableRow key={item.id}>
                                          <TableCell>{item.description}</TableCell>
                                          <TableCell className="text-center">{item.quantity}</TableCell>
                                          <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                                          <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                                        <TableCell className="text-right font-medium">${invoice.amount.toFixed(2)}</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                  
                                  <div className="flex justify-end mt-4 gap-2">
                                    <Button size="sm" variant="outline">
                                      <FileText className="mr-2 h-4 w-4" />
                                      Print Invoice
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Download className="mr-2 h-4 w-4" />
                                      Download PDF
                                    </Button>
                                    {invoice.status !== 'paid' && (
                                      <Button size="sm" variant="default">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Process Payment
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No invoices found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="payments">
            {payments.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{format(payment.date, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            {getStatusBadge(payment.status)}
                          </div>
                        </TableCell>
                        <TableCell>{payment.invoiceId || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Receipt className="mr-2 h-4 w-4" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No payment records found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Payment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Invoiced</span>
                  <span className="text-xl font-bold">
                    ${invoices.reduce((sum, invoice) => sum + invoice.amount, 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="text-xl font-bold text-green-600">
                    ${payments.filter(p => p.status === 'success').reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="text-xl font-bold text-amber-600">
                    ${payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className="text-xl font-bold text-red-600">
                    ${(
                      invoices.reduce((sum, invoice) => sum + invoice.amount, 0) - 
                      invoices.reduce((sum, invoice) => sum + invoice.paid, 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientBillingSection;
