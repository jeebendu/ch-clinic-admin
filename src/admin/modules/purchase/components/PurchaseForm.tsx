
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PurchaseItemDialog from "./PurchaseItemDialog";
import { Order, OrderItem } from "../types/PurchaseOrder";
import { Edit } from "lucide-react"; // Add missing import

interface Props {
  purchase: Order | null;
  onSave: (order: Order) => void;
  onClose: () => void;
}

const emptyItem: OrderItem = {
  id: 0,
  product: {
    id: 0, name: "", price: 0, buyprice: 0, specialprice: 0, qty: 0, qtyLoose: 0, stripsPerBox: 0, capPerStrip: 0, ram: "", storage: "", sku: "", brand: { id: 0, name: "" }, modelno: 0, rackNo: "", color: "", warranty: "", smallimage: "", largeimage: "", description: "", branchId: 0, categoryId: 0, brandId: 0, category: { id: 0, name: "" }, serials: [], batchList: [], isSerialNoEnable: false, batched: false, type: { id: 0, name: "", strip: false }
  },
  mrp: 0, price: 0, qty: 0, total: 0,
  hsnCode: "", batch: "", expiry: "", discountPercent: 0, discountAmount: 0, gstPercent: 0, taxAmount: 0, manufactureMonth: 0, manufactureYear: 0, expiryMonth: 0, expiryYear: 0, freeQty: 0, mfg: "", serials: { }
};

const PurchaseForm: React.FC<Props> = ({ purchase, onSave, onClose }) => {
  const [vendorName, setVendorName] = useState(purchase?.vendor.name || "");
  const [items, setItems] = useState<OrderItem[]>(purchase?.items || []);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    setEditIndex(null); setShowItemDialog(true);
  };
  const handleEditItem = (idx: number) => {
    setEditIndex(idx); setShowItemDialog(true);
  };
  const handleItemDialogSave = (item: OrderItem) => {
    if (editIndex !== null && editIndex >= 0) {
      setItems(items.map((it, i) => (i === editIndex ? item : it)));
    } else {
      setItems([...items, { ...item, id: items.length + 1 }]);
    }
    setShowItemDialog(false);
    setEditIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Minimal logic for demo
    onSave({
      id: purchase?.id || 0,
      uid: purchase?.uid || `PO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      orderTime: purchase?.orderTime || new Date(),
      createdTime: purchase?.createdTime || new Date(),
      paymentType: purchase?.paymentType || { id: 1, name: "Cash" },
      approved: purchase?.approved ?? false,
      remark: purchase?.remark || "",
      items,
      vendor: { ...purchase?.vendor, name: vendorName },
      subtotal: items.reduce((s, it) => s + (it.total || 0), 0),
      discount: 0,
      grandTotal: items.reduce((s, it) => s + (it.total || 0), 0),
      product: purchase?.product || items[0]?.product,
      approvedTime: purchase?.approvedTime || new Date(),
      totalDiscount: 0,
      totalGst: 0,
      paidAmount: 0,
      balance: 0
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block font-medium mb-1">Vendor Name</label>
        <Input value={vendorName} onChange={e => setVendorName(e.target.value)} required />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Items</span>
          <Button onClick={e => { e.preventDefault(); handleAddItem(); }} size="sm" type="button">
            Add Item
          </Button>
        </div>
        <div>
          {items.length === 0 && <div className="text-muted-foreground">No items</div>}
          <ul className="divide-y">
            {items.map((item, idx) => (
              <li key={item.id} className="flex items-center py-2">
                <div className="flex-1">{item.product.name || "Unnamed"}</div>
                <div className="w-24 text-right">{item.qty}</div>
                <div className="w-24 text-right">{item.price}</div>
                <div className="w-24 text-right">{item.total}</div>
                <Button variant="ghost" size="icon" type="button" onClick={() => handleEditItem(idx)}>
                  <Edit size={16}/>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{purchase ? "Update" : "Add"} Purchase</Button>
      </div>
      <PurchaseItemDialog
        open={showItemDialog}
        onOpenChange={setShowItemDialog}
        item={editIndex !== null && items[editIndex] ? items[editIndex] : null}
        onSave={handleItemDialogSave}
      />
    </form>
  );
};

export default PurchaseForm;
