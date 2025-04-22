import { Route, Routes } from "react-router-dom";
import ProductList from "../pages/ProductList";

const ProductRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/list" element={<ProductList />} />
    </Routes>
  );
};

export default ProductRoutes;
