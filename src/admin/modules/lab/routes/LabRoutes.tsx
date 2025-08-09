
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LabDashboard from "../pages/LabDashboard";
import NewLabOrder from "../pages/NewLabOrder";
import LabOrders from "../pages/LabOrders";
import LabReports from "../pages/LabReports";
import TestCatalog from "../pages/TestCatalog";
import LabSettings from "../pages/LabSettings";

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/lab/dashboard" replace />} />
      <Route path="/dashboard" element={<LabDashboard />} />
      <Route path="/new-order" element={<NewLabOrder />} />
      <Route path="/orders" element={<LabOrders />} />
      <Route path="/reports" element={<LabReports />} />
      <Route path="/test-catalog" element={<TestCatalog />} />
      <Route path="/settings" element={<LabSettings />} />
    </Routes>
  );
};

export default LabRoutes;
