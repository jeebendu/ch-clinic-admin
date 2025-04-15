
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const RepairCompanyList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Repair Companies" 
        showAddButton={true}
        addButtonLabel="Add Repair Company"
        onAddButtonClick={() => console.log("Add repair company clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Repair company list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default RepairCompanyList;
