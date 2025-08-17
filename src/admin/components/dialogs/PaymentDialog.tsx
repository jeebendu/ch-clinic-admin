import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Visit } from "@/admin/modules/patient/submodules/visit/types/Visit";
import { DollarSign, CreditCard, Banknote, Smartphone } from "lucide-react";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit?: Visit | null;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onClose, visit }) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");

  const handlePaymentSubmit = () => {
    console.log("Payment submitted:", {
      visitId: visit?.id,
      amount: paymentAmount,
      method: paymentMethod,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            Mark Payment
          </DialogTitle>
        </DialogHeader>

        {visit ? (
          <div className="flex gap-4">
            {/* Visit Details */}
            <Card className="w-1/2">
              <CardHeader>
                <CardTitle>Visit Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p>
                    Patient: {visit.patient?.firstname} {visit.patient?.lastname}
                  </p>
                  <p>
                    Date: {new Date(visit.createdTime).toLocaleDateString()}
                  </p>
                  <p>
                    Status: <Badge>{visit.status}</Badge>
                  </p>
                  <p>
                    Total Amount: ${visit.paymentAmount}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="w-1/2">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <Input
                    type="number"
                    id="amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Payment Method</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={paymentMethod === "cash" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <Banknote className="mr-2 h-4 w-4" />
                      Cash
                    </Button>
                    <Button
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Card
                    </Button>
                    <Button
                      variant={paymentMethod === "mobile" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("mobile")}
                    >
                      <Smartphone className="mr-2 h-4 w-4" />
                      Mobile
                    </Button>
                  </div>
                </div>

                <Button onClick={handlePaymentSubmit}>
                  Mark as Paid
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p>No visit selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
