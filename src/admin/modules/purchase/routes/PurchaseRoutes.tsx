
import { Route, Routes } from "react-router-dom";
import OrderList from "../submodules/order/pages/OrderList";

const PurchaseRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OrderList />} />
      <Route path="/orders/*" element={<OrderList />} />
    </Routes>
  );
};

export default PurchaseRoutes;
