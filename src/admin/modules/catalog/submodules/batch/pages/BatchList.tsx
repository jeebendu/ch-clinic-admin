
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const BatchList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Batches" 
        showAddButton={true}
        addButtonLabel="Add Batch"
        onAddButtonClick={() => console.log("Add batch clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Batch list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default BatchList;
