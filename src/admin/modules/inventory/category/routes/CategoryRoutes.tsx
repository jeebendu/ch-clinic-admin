import { Route, Routes } from "react-router-dom";
import CategoryList from "../pages/CategoryList";

const CategoryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CategoryList />} />
      <Route path="/list" element={<CategoryList />} />
    </Routes>
  );
};

export default CategoryRoutes;
