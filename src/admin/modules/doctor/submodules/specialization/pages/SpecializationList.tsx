
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const SpecializationList = () => {
  return (
    <>
      <PageHeader 
        title="Specializations" 
        showAddButton={true}
        addButtonLabel="Add Specialization"
        onAddButtonClick={() => console.log("Add specialization clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Specialization list page - coming soon</p>
      </div>
    </>
  );
};

export default SpecializationList;
