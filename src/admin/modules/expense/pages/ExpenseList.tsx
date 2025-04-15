
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const ExpenseList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Expenses" 
        showAddButton={true}
        addButtonLabel="Add Expense"
        onAddButtonClick={() => console.log("Add expense clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Expense list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default ExpenseList;
