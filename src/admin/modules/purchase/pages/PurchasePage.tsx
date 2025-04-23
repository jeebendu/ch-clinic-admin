import React, { useState } from "react";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PurchaseForm from "../components/PurchaseForm";
import PurchaseTable from "../components/PurchaseTable";
import { Order } from "../types/PurchaseOrder";
import PurchaseLayout from "../components/PurchaseLayout";

const mockPurchases: Order[] = [
  {
    id: 1,
    uid: "PO-001",
    orderTime: new Date(),
    createdTime: new Date(),
    paymentType: { id: 1, name: "Cash" },
    approved: false,
    remark: "First purchase",
    items: [],
    vendor: { id: 1, name: "Vendor 1", code: "V-001", address: "", active: true, gst: "", phone: "", email: "", pan: "", remark: "" },
    subtotal: 1000,
    discount: 0,
    grandTotal: 1000,
    product: { id: 1, name: "Sample", price: 1000, buyprice: 900, specialprice: 950, qty: 1, qtyLoose: 0, stripsPerBox: 0, capPerStrip: 0, ram: '', storage: '', sku: '', brand: { id: 1, name: "Brand" }, modelno: 0, rackNo: '', color: '', warranty: '', smallimage: '', largeimage: '', description: '', branchId: 1, categoryId: 1, brandId: 1, category: { id: 1, name: "Category" }, serials: [], batchList: [], isSerialNoEnable: false, batched: false, type: { id: 1, name: "Type", strip: false }},
    approvedTime: new Date(),
    totalDiscount: 0,
    totalGst: 0,
    paidAmount: 0,
    balance: 0
  }
];

const PurchasePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editPurchase, setEditPurchase] = useState<Order | null>(null);
  const [purchases, setPurchases] = useState<Order[]>(mockPurchases);

  const handleAdd = () => {
    setEditPurchase(null);
    setShowForm(true);
  };
  const handleEdit = (order: Order) => {
    setEditPurchase(order);
    setShowForm(true);
  };
  const handleFormClose = () => {
    setShowForm(false);
    setEditPurchase(null);
  };

  const handleSave = (order: Order) => {
    if (order.id) {
      setPurchases(purchases.map(p => p.id === order.id ? order : p));
    } else {
      setPurchases([...purchases, { ...order, id: purchases.length + 1 }]);
    }
    handleFormClose();
  };

  return (
    <PurchaseLayout>
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Purchase Orders</h1>
          <Button onClick={handleAdd} className="bg-primary text-primary-foreground">
            <Plus className="mr-2" /> Add Purchase
          </Button>
        </div>
        <PurchaseTable purchases={purchases} onEdit={handleEdit} />
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editPurchase ? "Edit Purchase" : "Add Purchase"}</DialogTitle>
            </DialogHeader>
            <PurchaseForm purchase={editPurchase} onSave={handleSave} onClose={handleFormClose} />
          </DialogContent>
        </Dialog>
      </div>
    </PurchaseLayout>
  );
};

export default PurchasePage;
