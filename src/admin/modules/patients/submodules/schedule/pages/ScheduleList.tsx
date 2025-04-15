
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const ScheduleList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Patient Schedules" 
        showAddButton={true}
        addButtonLabel="Add Schedule"
        onAddButtonClick={() => console.log("Add schedule clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Schedule list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default ScheduleList;
