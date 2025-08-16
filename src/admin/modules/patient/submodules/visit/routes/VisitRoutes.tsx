
import React from "react";
import { Route, Routes } from "react-router-dom";
import VisitList from "../components/VisitList";
import VisitListPage from "../pages/VisitListPage";
import EnhancedInfiniteVisitList from "../components/EnhancedInfiniteVisitList";
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
