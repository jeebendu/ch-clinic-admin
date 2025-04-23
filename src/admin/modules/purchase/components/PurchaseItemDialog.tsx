
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

export interface PurchaseItemDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (values: any) => void;
}

const months = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" }, { value: 4, label: "April" },
  { value: 5, label: "May" }, { value: 6, label: "June" }, { value: 7, label: "July" }, { value: 8, label: "August" },
  { value: 9, label: "September" }, { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
];

const years = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - 10 + i));

const PurchaseItemDialog: React.FC<PurchaseItemDialogProps> = ({
  open, onClose, initialData, onSubmit
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      name: "",
      productType: "",
      categoryType: "",
      brandType: "",
      batch: "",
      rackNo: "",
      hsnCode: "",
      pack: "",
      manufactureMonth: "",
      manufactureYear: "",
    }
  });

  React.useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] p-8 relative">
        <DialogHeader>
          <DialogTitle>Add/Edit Item</DialogTitle>
          <DialogClose asChild>
            <button className="absolute top-4 right-4 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none">
              <X size={20} />
            </button>
          </DialogClose>
        </DialogHeader>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block mb-1 font-medium">Name*</label>
            <Input {...register("name", { required: true })} placeholder="Product Name" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Product Type</label>
            <Input {...register("productType")} placeholder="Product Type" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category Type</label>
            <Input {...register("categoryType")} placeholder="Category Type" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Brand Type</label>
            <Input {...register("brandType")} placeholder="Brand Type" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Batch*</label>
            <Input {...register("batch", { required: true })} placeholder="Batch" />
          </div>
          <div>
            <label className="block mb-1 font-medium">RackNo*</label>
            <Input {...register("rackNo", { required: true })} placeholder="Rack Number" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Hsn Code*</label>
            <Input {...register("hsnCode", { required: true })} placeholder="HSN Code" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Pack*</label>
            <Input {...register("pack", { required: true })} placeholder="Pack" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mfg. Month (Number)*</label>
            <select {...register("manufactureMonth", { required: true })} className="w-full border rounded-md py-2 px-3">
              <option value="">Select Month</option>
              {months.map(m =>
                <option key={m.value} value={m.value}>{m.label}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Mfg. Year*</label>
            <select {...register("manufactureYear", { required: true })} className="w-full border rounded-md py-2 px-3">
              <option value="">Select Year</option>
              {years.map(y =>
                <option key={y} value={y}>{y}</option>
              )}
            </select>
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <Button variant="default" type="submit" className="bg-blue-700 text-white hover:bg-blue-800">Submit</Button>
            <Button variant="destructive" type="button" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseItemDialog;
