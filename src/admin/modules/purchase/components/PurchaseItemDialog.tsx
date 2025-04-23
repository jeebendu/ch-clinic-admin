
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderItem } from "../types/PurchaseOrder";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: OrderItem | null;
  onSave: (item: OrderItem) => void;
}

const PurchaseItemDialog: React.FC<Props> = ({ open, onOpenChange, item, onSave }) => {
  const [name, setName] = useState(item?.product?.name || "");
  const [qty, setQty] = useState(item?.qty || 1);
  const [price, setPrice] = useState(item?.price || 0);

  useEffect(() => {
    setName(item?.product?.name || "");
    setQty(item?.qty || 1);
    setPrice(item?.price || 0);
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      id: item?.id || 0,
      product: { ...item?.product, name, price, id: item?.product?.id ?? 0 } as any,
      qty,
      price,
      total: qty * price,
      serials: {},
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block font-medium mb-1">Quantity</label>
            <Input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} required />
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <Input type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value))} required />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{item ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseItemDialog;
