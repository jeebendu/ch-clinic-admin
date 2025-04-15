
import { Route, Routes } from "react-router-dom";
import UsersList from "./pages/UsersList";
import LoginHistoryList from "./submodules/login-history/pages/LoginHistoryList";
import RolesList from "./submodules/roles/pages/RolesList";


const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UsersList />} />
      <Route path="/users/*" element={<UsersList />} />
      <Route path="/login-history/*" element={<LoginHistoryList />} />
      <Route path="/roles/*" element={<RolesList />} />
    </Routes>
  );
};

export default UserRoutes;
