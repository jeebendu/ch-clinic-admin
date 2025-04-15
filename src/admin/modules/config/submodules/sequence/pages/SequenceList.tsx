
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const SequenceList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Sequences" 
        showAddButton={true}
        addButtonLabel="Add Sequence"
        onAddButtonClick={() => console.log("Add sequence clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Sequence list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default SequenceList;
