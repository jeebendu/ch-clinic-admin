
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const CategoryList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Categories" 
        showAddButton={true}
        addButtonLabel="Add Category"
        onAddButtonClick={() => console.log("Add category clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Category list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default CategoryList;
