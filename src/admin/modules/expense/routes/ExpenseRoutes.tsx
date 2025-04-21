
import { Route, Routes } from "react-router-dom";
import ExpenseList from "../pages/ExpenseList";

const ExpenseRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpenseList />} />
      <Route path="/list" element={<ExpenseList />} />
    </Routes>
  );
};

export default ExpenseRoutes;
