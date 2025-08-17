
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoutes from "./admin/AdminRoutes";
import { useTenant } from "./hooks/use-tenant";
import ClinicProfile from "./pages/ClinicProfile";
import ClinicProfileEdit from "./pages/ClinicProfileEdit";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PublicPatientRegistration from "./pages/PublicPatientRegistration";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";
import { FloatingQueueButton } from "./admin/modules/queue/components";

const queryClient = new QueryClient();

// Component to initialize tenant info
const TenantInitializer = ({ children }: { children: React.ReactNode }) => {
  useTenant(); // This will fetch tenant info on app startup
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantInitializer>
          <Routes>

            {/* Login route */}
            <Route path="/" element={<Login />} />

            {/* Reset password route */}
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Public patient registration route */}
            <Route path="/register-patient" element={<PublicPatientRegistration />} />

            {/* Clinic profile routes */}
            <Route path="/clinic-profile" element={<ClinicProfile />} />
            <Route path="/clinic-profile/edit" element={<ClinicProfileEdit />} />

            {/* User profile route */}
            <Route path="/me" element={<UserProfile />} />

            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TenantInitializer>
      </BrowserRouter>
    </TooltipProvider>

     {/* Floating Queue Button - appears on all pages */}
          <FloatingQueueButton />

  </QueryClientProvider>

  
);

export default App;
