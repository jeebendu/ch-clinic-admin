
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const OrderList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Sales Orders" 
        showAddButton={true}
        addButtonLabel="Add Sales Order"
        onAddButtonClick={() => console.log("Add sales order clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Sales order list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default OrderList;
