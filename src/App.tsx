import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import AdminLayout from "./admin/components/layout/AdminLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import PublicRoute from "./components/routes/PublicRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import Branch from "./admin/modules/branch/pages/Branch";
import Users from "./admin/modules/users/pages/Users";
import Roles from "./admin/modules/users/pages/Roles";
import LoginHistory from "./admin/modules/users/pages/LoginHistory";
import ClinicProfile from "./admin/modules/clinic/pages/ClinicProfile";
import Patients from "./admin/modules/patients/pages/Patients";
import Doctor from "./admin/modules/doctor/pages/Doctor";
import DoctorSpeciality from "./admin/modules/doctor/pages/DoctorSpeciality";
import MedicalCouncil from "./admin/modules/doctor/pages/MedicalCouncil";
import MedicalDegree from "./admin/modules/doctor/pages/MedicalDegree";
import Appointments from "./admin/modules/appointments/pages/Appointments";
import Enquiry from "./admin/modules/enquiry/pages/Enquiry";
import ReferralDoctor from "./admin/modules/reports/pages/ReferralDoctor";

// Lab Pages
import LabDashboard from "./admin/modules/lab/pages/LabDashboard";
import NewLabOrder from "./admin/modules/lab/pages/NewLabOrder";
import LabOrders from "./admin/modules/lab/pages/LabOrders";
import LabReports from "./admin/modules/lab/pages/LabReports";
import TestCatalog from "./admin/modules/lab/pages/TestCatalog";
import LabSettings from "./admin/modules/lab/pages/LabSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="/admin/dashboard/admin" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/branch" element={<PrivateRoute><AdminLayout><Branch /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute><AdminLayout><Users /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/users/roles" element={<PrivateRoute><AdminLayout><Roles /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/users/login-history" element={<PrivateRoute><AdminLayout><LoginHistory /></AdminLayout></PrivateRoute>} />
            <Route path="/clinic-profile" element={<PrivateRoute><AdminLayout><ClinicProfile /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/patients" element={<PrivateRoute><AdminLayout><Patients /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/doctor" element={<PrivateRoute><AdminLayout><Doctor /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/doctor/speciality" element={<PrivateRoute><AdminLayout><DoctorSpeciality /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/medical-council" element={<PrivateRoute><AdminLayout><MedicalCouncil /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/medical-degree" element={<PrivateRoute><AdminLayout><MedicalDegree /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/appointments" element={<PrivateRoute><AdminLayout><Appointments /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/enquiry" element={<PrivateRoute><AdminLayout><Enquiry /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/reports/referral-doctor" element={<PrivateRoute><AdminLayout><ReferralDoctor /></AdminLayout></PrivateRoute>} />
            <Route path="*" element={<ErrorPage />} />
            
            {/* Admin Lab Routes */}
            <Route path="/admin/lab/dashboard" element={<AdminLayout><LabDashboard /></AdminLayout>} />
            <Route path="/admin/lab/new-order" element={<AdminLayout><NewLabOrder /></AdminLayout>} />
            <Route path="/admin/lab/orders" element={<AdminLayout><LabOrders /></AdminLayout>} />
            <Route path="/admin/lab/reports" element={<AdminLayout><LabReports /></AdminLayout>} />
            <Route path="/admin/lab/test-catalog" element={<AdminLayout><TestCatalog /></AdminLayout>} />
            <Route path="/admin/lab/settings" element={<AdminLayout><LabSettings /></AdminLayout>} />
          </Routes>
        </div>
      </Router>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
