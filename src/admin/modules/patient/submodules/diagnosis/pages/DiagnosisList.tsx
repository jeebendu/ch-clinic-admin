
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const DiagnosisList = () => {
  return (
    <>
      <PageHeader 
        title="Patient Diagnoses" 
        description="Manage patient diagnoses and conditions"
        showAddButton={true}
        addButtonLabel="Add Diagnosis"
        onAddButtonClick={() => console.log("Add diagnosis clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Diagnosis list page - coming soon</p>
      </div>
    </>
  );
};

export default DiagnosisList;
