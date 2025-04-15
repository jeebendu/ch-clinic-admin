
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const AvailabilityList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Doctor Availability" 
        showAddButton={true}
        addButtonLabel="Add Availability"
        onAddButtonClick={() => console.log("Add availability clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Availability list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default AvailabilityList;
