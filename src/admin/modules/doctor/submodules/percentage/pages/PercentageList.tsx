
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const PercentageList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Doctor Percentages" 
        showAddButton={true}
        addButtonLabel="Add Percentage"
        onAddButtonClick={() => console.log("Add percentage clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Percentage list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default PercentageList;
