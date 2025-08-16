
import React from "react";
import { Route, Routes } from "react-router-dom";
import EnhancedVisitListPage from "../pages/EnhancedVisitListPage";

const VisitRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EnhancedVisitListPage />} />
      <Route path="/list" element={<EnhancedVisitListPage />} />
    </Routes>
  );
};

export default VisitRoutes;
