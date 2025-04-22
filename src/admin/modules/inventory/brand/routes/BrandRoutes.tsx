import { Route, Routes } from "react-router-dom";
import BrandList from "../pages/BrandList";

const BrandRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BrandList />} />
      <Route path="/list" element={<BrandList />} />
    </Routes>
  );
};

export default BrandRoutes;
