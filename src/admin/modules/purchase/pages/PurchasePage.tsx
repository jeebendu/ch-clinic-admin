
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Save, X, Printer } from "lucide-react";
import { format } from "date-fns";
import PurchaseItemDialog from "../components/PurchaseItemDialog";
import { Order, OrderItem } from "../types/PurchaseOrder";
import PurchaseOrderService from "../service/PurchaseOrderService";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import PurchaseBreadcrumbs from "../components/PurchaseBreadcrumbs";
import AdminLayout from "@/admin/components/AdminLayout";

const distributors = [
  { id: 1, name: "Provider A" }, { id: 2, name: "Provider B" }
];
const paymentTypes = [
  { id: 1, name: "Cash" }, { id: 2, name: "Card" }
];

function PurchasePageContent() {
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
    const payload = { ...data, items, ...totals };
    console.log("Submit purchase order", payload);
    PurchaseOrderService.saveOrUpdate(payload)
      .then(() => alert("Purchase saved!"))
      .catch(() => alert("Error saving purchase!"));
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditIndex(null);
  }

  return (
    <div className="bg-[#f5f7fb] min-h-screen flex flex-col">
      <div className="md:ml-0 flex-1 flex flex-col relative max-w-[1200px] mx-auto" style={{ zIndex: 2 }}>
        <PurchaseBreadcrumbs />
        {/* Responsive/scrolled area, extra bg and border for focus */}
        <form
          className="flex flex-col rounded-b-lg rounded-tr-lg bg-white px-8 py-6 shadow mt-2 gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-4">
            <div className="flex-1 min-w-[220px]">
              <label className="block mb-1 font-semibold text-[#362E5C] text-lg">Provider Name <span className="text-red-500">*</span></label>
              <Select
                value={form.watch("vendor")?.name || ""}
                onValueChange={value => form.setValue("vendor", distributors.find(d => d.name === value))}
              >
                <SelectTrigger className="rounded-none border-b-2 border-[#DFDFDF] bg-transparent focus:ring-0 text-lg min-h-[40px]" style={{ boxShadow: "none" }}>
                  <SelectValue placeholder="Select provider" className="text-medium" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {distributors.map(d => (
                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.vendor && (
                <div className="text-red-500 text-xs mt-1">Provider is required</div>
              )}
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="block mb-1 font-semibold text-[#362E5C] text-lg">Purchase Date <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-2 relative">
                <Input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  value={form.watch("orderTime") ? format(new Date(form.watch("orderTime")), 'yyyy-MM-dd') : ""}
                  onChange={e => {
                    const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                    form.setValue("orderTime", dateValue);
                  }}
                  className="pr-10 rounded-none border-b-2 border-[#DFDFDF] bg-transparent text-lg min-h-[40px]"
                  style={{ boxShadow: "none" }}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {form.formState.errors.orderTime && (
                <div className="text-red-500 text-xs mt-1">Date is required</div>
              )}
            </div>
          </div>
          <div className="my-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-base font-medium text-[#362E5C]">
              <input type="checkbox" className="accent-primary h-5 w-5" />
              <span>Overall Gst/Discount</span>
            </label>
          </div>
          <div className="rounded-lg overflow-x-auto mb-4 border border-[#e7e8ed] bg-[#fafbfc] relative">
            <table className="w-full min-w-max border-separate border-spacing-0">
              <thead className="bg-[#f2f3f8]">
                <tr className="text-gray-700 text-base font-semibold">
                  <th className="px-3 py-3 text-left font-semibold">Id</th>
                  <th className="px-3 py-3 text-left font-semibold">Product Name</th>
                  <th className="px-3 py-3 text-left font-semibold">Hsn Code</th>
                  <th className="px-3 py-3 text-left font-semibold">Batch</th>
                  <th className="px-3 py-3 text-left font-semibold">Mrp</th>
                  <th className="px-3 py-3 text-left font-semibold">Rate</th>
                  <th className="px-3 py-3 text-left font-semibold">Quantity</th>
                  <th className="px-3 py-3 text-left font-semibold">Free</th>
                  <th className="px-3 py-3 text-left font-semibold">Total</th>
                  <th className="px-3 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#f2f3f8] bg-white hover:bg-[#f6faff] transition-colors">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">{item.product?.name || item.description}</td>
                    <td className="px-3 py-2">{item.hsnCode}</td>
                    <td className="px-3 py-2">{item.batch}</td>
                    <td className="px-3 py-2">{item.mrp}</td>
                    <td className="px-3 py-2">{item.price}</td>
                    <td className="px-3 py-2">{item.qty}</td>
                    <td className="px-3 py-2">{item.freeQty}</td>
                    <td className="px-3 py-2">{item.total}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Button size="icon" type="button" variant="ghost" onClick={() => handleEditRow(idx)}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="icon" type="button" variant="destructive" onClick={() => handleRemoveRow(idx)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-400">No items added</td>
                  </tr>
                )}
              </tbody>
            </table>
            <Button
              size="icon"
              type="button"
              className="absolute right-10 bottom-2 md:right-16 md:bottom-2 z-40 shadow-lg bg-blue-700 text-white hover:bg-blue-800 rounded-lg"
              onClick={() => setDialogOpen(true)}
              aria-label="Add Item"
              style={{ width: 48, height: 48, fontSize: 24 }}
            >
              <Plus className="w-7 h-7" />
            </Button>
          </div>
          <div className="flex flex-col md:flex-row mt-8 gap-8">
            <div className="flex-1 flex flex-col gap-7">
              <div>
                <label className="block mb-1 font-semibold text-[#362E5C] text-lg">Payment Type <span className="text-red-500">*</span></label>
                <Select
                  value={form.watch("paymentType")?.name || ""}
                  onValueChange={value => form.setValue("paymentType", paymentTypes.find(pt => pt.name === value))}
                >
                  <SelectTrigger className="rounded-none border-b-2 border-[#DFDFDF] bg-transparent focus:ring-0 text-lg min-h-[40px]" style={{ boxShadow: "none" }}>
                    <SelectValue placeholder="Select payment type" className="text-medium" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white">
                    {paymentTypes.map(pt => (
                      <SelectItem key={pt.id} value={pt.name}>{pt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.paymentType && (
                  <div className="text-red-500 text-xs mt-1">Payment type is required</div>
                )}
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#362E5C] text-lg">Remark</label>
                <Input type="text" {...form.register("remark")} placeholder="Enter remarks, delivery details, etc." className="rounded-none border-b-2 border-[#DFDFDF] bg-transparent text-lg min-h-[40px]" />
              </div>
            </div>
            <div className="flex-1 max-w-xs md:ml-auto border rounded-lg shadow bg-[#f6f6fa] p-8 mt-4 md:mt-0">
              <div className="text-2xl font-semibold mb-5 text-center text-[#362E5C]">Price Details</div>
              <div className="flex flex-col gap-3 text-lg">
                <div className="flex justify-between text-[#6E59A5]"><span>Sub - Total:</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-[#6E59A5]"><span>Total-Discount:</span><span>₹{totals.totalDiscount.toFixed(2)}</span></div>
                <div className="flex justify-between text-[#6E59A5]"><span>Total-Gst:</span><span>₹{totals.totalGst.toFixed(2)}</span></div>
                <hr className="my-3"/>
                <div className="flex justify-between font-bold text-xl"><span>Grand Total:</span><span>₹{totals.grandTotal.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end gap-4 mt-12 pb-4">
            <Button type="button" variant="destructive" className="bg-red-700 text-white text-lg px-8 py-3 rounded-full shadow-none">Cancel</Button>
            <Button type="submit" className="bg-blue-700 text-white text-lg px-8 py-3 rounded-full shadow-none">Submit</Button>
            <Button type="button" className="bg-blue-700 text-white text-lg px-8 py-3 flex gap-2 rounded-full shadow-none">
              <Printer className="w-5 h-5" /> Print
            </Button>
          </div>
        </form>
      </div>
      <PurchaseItemDialog
        open={dialogOpen}
        onClose={closeDialog}
        initialData={editIndex !== null && editIndex >= 0 ? items[editIndex] : undefined}
        onSubmit={handleAddEditItem}
      />
    </div>
  );
}

// Now wrap with AdminLayout for consistent sidebar UI
export default function PurchasePage() {
  return (
    <AdminLayout>
      <PurchasePageContent />
    </AdminLayout>
  );
}
