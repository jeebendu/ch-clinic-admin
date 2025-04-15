
import { Route, Routes } from "react-router-dom";
import ProductList from "../submodules/product/pages/ProductList";
import BrandList from "../submodules/brand/pages/BrandList";
import CategoryList from "../submodules/category/pages/CategoryList";
import BatchList from "../submodules/batch/pages/BatchList";
import TypeList from "../submodules/type/pages/TypeList";

const CatalogRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/products/*" element={<ProductList />} />
      <Route path="/brands/*" element={<BrandList />} />
      <Route path="/categories/*" element={<CategoryList />} />
      <Route path="/batches/*" element={<BatchList />} />
      <Route path="/types/*" element={<TypeList />} />
    </Routes>
  );
};

export default CatalogRoutes;
