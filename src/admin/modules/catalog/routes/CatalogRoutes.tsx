
import { Route, Routes } from "react-router-dom";

const CatalogRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Catalog Dashboard</div>} />
    </Routes>
  );
};

export default CatalogRoutes;
