
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const TypeList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Product Types" 
        showAddButton={true}
        addButtonLabel="Add Product Type"
        onAddButtonClick={() => console.log("Add product type clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Product type list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default TypeList;
