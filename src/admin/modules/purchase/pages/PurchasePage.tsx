
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from "@/components/ui/table";
import { CalendarIcon, Plus, Printer, Save, X } from "lucide-react";
import { format } from "date-fns";
import PurchaseItemDialog from "../components/PurchaseItemDialog";
import { Order, OrderItem } from "../types/PurchaseOrder";
import PurchaseOrderService from "../service/PurchaseOrderService";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

// Dummy Data for select dropdowns (in real use fetch from API)
const distributors = [
  { id: 1, name: "Provider A" }, { id: 2, name: "Provider B" }
];
const paymentTypes = [
  { id: 1, name: "Cash" }, { id: 2, name: "Card" }
];

export default function PurchasePage() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const form = useForm<Order>({
    defaultValues: {
      vendor: undefined,
      orderTime: undefined,
      paymentType: undefined,
      remark: "",
      items: [],
      subtotal: 0,
      discount: 0,
      grandTotal: 0,
      totalDiscount: 0,
      totalGst: 0,
      paidAmount: 0,
      balance: 0,
      approved: false,
      createdTime: undefined,
      uid: "",
      id: 0,
      product: undefined,
      approvedTime: undefined,
    }
  });

  // Price calculation logic (for simplicity, assumed structure)
  const calcTotals = () => {
    let subtotal = 0, totalDiscount = 0, totalGst = 0, grandTotal = 0;
    items.forEach((item) => {
      subtotal += item.total || 0;
      totalDiscount += item.discountAmount || 0;
      totalGst += item.taxAmount || 0;
    });
    grandTotal = subtotal - totalDiscount + totalGst;
    return { subtotal, totalDiscount, totalGst, grandTotal };
  };

  const totals = calcTotals();

  function handleAddEditItem(data: Partial<OrderItem>) {
    if (editIndex !== null && editIndex >= 0) {
      const updated = [...items];
      updated[editIndex] = { ...updated[editIndex], ...data };
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, { ...data, id: items.length + 1 } as OrderItem]);
    }
    setDialogOpen(false);
  }

  function handleEditRow(idx: number) {
    setEditIndex(idx);
    setDialogOpen(true);
  }

  function handleRemoveRow(idx: number) {
    setItems(items => items.filter((_, i) => i !== idx));
  }

  function onSubmit(data: any) {
    // Attach items and totals to form data
    const payload = { ...data, items, ...totals };
    console.log("Submit purchase order", payload);
    PurchaseOrderService.saveOrUpdate(payload)
      .then(() => alert("Purchase saved!"))
      .catch(() => alert("Error saving purchase!"));
  }

  // Handle modal closing for add/edit
  function closeDialog() {
    setDialogOpen(false);
    setEditIndex(null);
  }

  return (
    <form className="h-full flex flex-col md:p-4" onSubmit={form.handleSubmit(onSubmit)}>

      {/* Scrollable Form Area */}
      <ScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto max-h-[calc(100vh-30px)] rounded-lg bg-white">
        {/* Top: Vendor and Date */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Provider Name</label>
            <Select
              value={form.watch("vendor")?.name || ""}
              onValueChange={value => form.setValue("vendor", distributors.find(d => d.name === value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {distributors.map(d => (
                  <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Purchase Date*</label>
            <div className="flex items-center gap-2 relative">
              <Input
                type="date"
                value={form.watch("orderTime") ? format(new Date(form.watch("orderTime")), 'yyyy-MM-dd') : ""}
                onChange={e => form.setValue("orderTime", e.target.value)}
                className="pr-10"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="my-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-primary" />
            Overall Gst/Discount
          </label>
        </div>
        {/* Items Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">Id</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Hsn Code</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Mrp</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Free</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.product?.name || item.description}</TableCell>
                <TableCell>{item.hsnCode}</TableCell>
                <TableCell>{item.batch}</TableCell>
                <TableCell>{item.mrp}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>{item.freeQty}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="icon" type="button" variant="ghost" onClick={() => handleEditRow(idx)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="icon" type="button" variant="destructive" onClick={() => handleRemoveRow(idx)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!items.length && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6 text-gray-400">No items added</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Floating add button */}
        <Button
          size="icon"
          type="button"
          className="fixed right-8 bottom-20 md:right-12 md:bottom-20 z-40 shadow-lg bg-blue-700 text-white hover:bg-blue-800"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
        {/* Lower: Payment, Remark, Sidebar */}
        <div className="flex flex-col md:flex-row mt-8 gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Payment Type</label>
              <Select
                value={form.watch("paymentType")?.name || ""}
                onValueChange={value => form.setValue("paymentType", paymentTypes.find(pt => pt.name === value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map(pt => (
                    <SelectItem key={pt.id} value={pt.name}>{pt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Remark</label>
              <Input type="text" {...form.register("remark")} placeholder="Enter remarks" />
            </div>
          </div>
          {/* Sidebar totals box */}
          <div className="flex-1 max-w-sm md:ml-auto border rounded-lg shadow bg-gray-50 p-6">
            <div className="text-xl font-semibold mb-4 text-center">Price Details</div>
            <div className="flex flex-col gap-2 text-lg">
              <div className="flex justify-between"><span>Sub - Total:</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Total-Discount:</span><span>₹{totals.totalDiscount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Total-Gst:</span><span>₹{totals.totalGst.toFixed(2)}</span></div>
              <hr className="my-2"/>
              <div className="flex justify-between font-bold"><span>Grand Total:</span><span>₹{totals.grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
        {/* Footer: actions */}
        <div className="w-full flex justify-end gap-4 mt-8 pb-4">
          <Button type="button" variant="destructive" className="bg-red-700 text-white">Cancel</Button>
          <Button type="submit" className="bg-blue-700 text-white">Submit</Button>
          <Button type="button" className="bg-blue-700 text-white flex gap-2"><Printer className="w-4 h-4" /> Print</Button>
        </div>
      </ScrollArea>
      {/* Item Dialog */}
      <PurchaseItemDialog
        open={dialogOpen}
        onClose={closeDialog}
        initialData={editIndex !== null && editIndex >= 0 ? items[editIndex] : undefined}
        onSubmit={handleAddEditItem}
      />
    </form>
  );
}
