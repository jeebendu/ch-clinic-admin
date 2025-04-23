import { Route, Routes } from "react-router-dom";
import ProductTypeList from "../pages/ProductTypeList";

const ProductTypeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductTypeList />} />
      <Route path="/list" element={<ProductTypeList />} />
    </Routes>
  );
};

export default ProductTypeRoutes;
