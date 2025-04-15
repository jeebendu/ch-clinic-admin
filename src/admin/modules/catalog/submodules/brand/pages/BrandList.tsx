
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const BrandList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Brands" 
        showAddButton={true}
        addButtonLabel="Add Brand"
        onAddButtonClick={() => console.log("Add brand clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Brand list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default BrandList;
