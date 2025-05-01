
import React from "react";
import { Route, Routes } from "react-router-dom";
import ReferralDoctorReport from "../pages/ReferralDoctorReport";

const ReportsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ReferralDoctorReport />} />
      <Route path="/referral-doctor" element={<ReferralDoctorReport />} />
    </Routes>
  );
};

export default ReportsRoutes;
