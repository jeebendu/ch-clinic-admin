
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const ProductList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Products" 
        showAddButton={true}
        addButtonLabel="Add Product"
        onAddButtonClick={() => console.log("Add product clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Product list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default ProductList;
