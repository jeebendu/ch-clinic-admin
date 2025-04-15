
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const WarehouseList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Warehouses" 
        showAddButton={true}
        addButtonLabel="Add Warehouse"
        onAddButtonClick={() => console.log("Add warehouse clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Warehouse list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default WarehouseList;
