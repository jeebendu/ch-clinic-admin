
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard";


const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
    </Routes>
  );
};

export default DashboardRoutes;
