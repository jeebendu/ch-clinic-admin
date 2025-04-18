
import { Route, Routes } from "react-router-dom";
import RepairCompanyList from "../pages/RepairCompanyList";

const RepairCompanyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RepairCompanyList />} />
      <Route path="/list" element={<RepairCompanyList />} />
    </Routes>
  );
};

export default RepairCompanyRoutes;
