
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const ServiceList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Doctor Services" 
        showAddButton={true}
        addButtonLabel="Add Service"
        onAddButtonClick={() => console.log("Add service clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Service list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default ServiceList;
