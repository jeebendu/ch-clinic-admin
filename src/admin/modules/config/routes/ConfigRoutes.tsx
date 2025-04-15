
import { Route, Routes } from "react-router-dom";
import ConfigList from "../submodules/config/pages/ConfigList";
import CourierList from "../submodules/courier/pages/CourierList";
import DistributorList from "../submodules/distributor/pages/DistributorList";
import RepairCompanyList from "../submodules/repair-company/pages/RepairCompanyList";
import SequenceList from "../submodules/sequence/pages/SequenceList";
import WarehouseList from "../submodules/warehouse/pages/WarehouseList";

const ConfigRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ConfigList />} />
      <Route path="/general/*" element={<ConfigList />} />
      <Route path="/couriers/*" element={<CourierList />} />
      <Route path="/distributors/*" element={<DistributorList />} />
      <Route path="/repair-companies/*" element={<RepairCompanyList />} />
      <Route path="/sequences/*" element={<SequenceList />} />
      <Route path="/warehouses/*" element={<WarehouseList />} />
    </Routes>
  );
};

export default ConfigRoutes;
