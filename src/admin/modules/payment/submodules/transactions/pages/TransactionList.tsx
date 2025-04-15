
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const TransactionList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Transactions" 
        showAddButton={true}
        addButtonLabel="Add Transaction"
        onAddButtonClick={() => console.log("Add transaction clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Transaction list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default TransactionList;
