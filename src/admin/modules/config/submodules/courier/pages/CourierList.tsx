
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const CourierList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Couriers" 
        showAddButton={true}
        addButtonLabel="Add Courier"
        onAddButtonClick={() => console.log("Add courier clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Courier list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default CourierList;
