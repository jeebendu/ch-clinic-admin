
import React, { useState } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { SlotCreationDialog } from "../components/SlotCreationDialog";
import { Slot } from "../types/Slot";

const Schedule = () => {
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);

  const handleSaveSlot = (slot: Partial<Slot>) => {
    // In a real application, this would save to the backend
    console.log("New slot created:", slot);
    toast.success(`New slot created for ${slot.date?.toLocaleDateString()} at ${slot.startTime}`);
    setIsSlotDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader
          title="Schedule"
          onViewModeToggle={() => {}}
          viewMode="calendar"
          showAddButton={true}
          addButtonLabel="New Slot"
          onAddButtonClick={() => setIsSlotDialogOpen(true)}
        />

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center min-h-[500px] mt-4">
          <div className="text-center">
            <CalendarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Calendar View Coming Soon</h3>
            <p className="text-gray-500 mb-4">The scheduling calendar feature is under development.</p>
            <Button className="rounded-full">Request Early Access</Button>
          </div>
        </div>

        <SlotCreationDialog
          open={isSlotDialogOpen}
          onOpenChange={setIsSlotDialogOpen}
          onSave={handleSaveSlot}
        />
      </div>
    </AdminLayout>
  );
};

export default Schedule;
