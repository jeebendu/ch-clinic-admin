
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const OrderList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Purchase Orders" 
        showAddButton={true}
        addButtonLabel="Add Purchase Order"
        onAddButtonClick={() => console.log("Add purchase order clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Purchase order list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default OrderList;
