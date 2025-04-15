
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const RepairList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Patient Repairs" 
        showAddButton={true}
        addButtonLabel="Add Repair"
        onAddButtonClick={() => console.log("Add repair clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Repair list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default RepairList;
