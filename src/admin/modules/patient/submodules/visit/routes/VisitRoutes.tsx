
import { Route, Routes } from "react-router-dom";
import VisitListPage from "../pages/VisitListPage";
import VisitDetailsPage from "../pages/VisitDetailsPage";

const VisitRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VisitListPage />} />
      <Route path="/list" element={<VisitListPage />} />
      <Route path="/:visitId" element={<VisitDetailsPage />} />
    </Routes>
  );
};

export default VisitRoutes;
