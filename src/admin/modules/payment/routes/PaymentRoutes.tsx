
import { Route, Routes } from "react-router-dom";
import PaymentTypeList from "../submodules/payment-type/pages/PaymentTypeList";
import TransactionList from "../submodules/transactions/pages/TransactionList";

const PaymentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TransactionList />} />
      <Route path="/types/*" element={<PaymentTypeList />} />
      <Route path="/transactions/*" element={<TransactionList />} />
    </Routes>
  );
};

export default PaymentRoutes;
