
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const PaymentTypeList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Payment Types" 
        showAddButton={true}
        addButtonLabel="Add Payment Type"
        onAddButtonClick={() => console.log("Add payment type clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Payment type list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default PaymentTypeList;
