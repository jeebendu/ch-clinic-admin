
import React from "react";
import { Route, Routes } from "react-router-dom";
import VisitList from "../components/VisitList";

const VisitRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VisitList />} />
      <Route path="/list" element={<VisitList />} />
    </Routes>
  );
};

export default VisitRoutes;
