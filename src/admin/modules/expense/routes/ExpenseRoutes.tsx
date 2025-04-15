
import { Route, Routes } from "react-router-dom";

const ExpenseRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Expense Dashboard</div>} />
    </Routes>
  );
};

export default ExpenseRoutes;
