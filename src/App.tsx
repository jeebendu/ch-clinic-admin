
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import http from "./lib/JwtInterceptor";
import { BranchProvider } from "./contexts/BranchContext";
import AdminRoutes from "./admin/AdminRoutes";
import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Initialize the Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BranchProvider>
        <Router>
          <div className="app min-h-screen">
            <AppRoutes />
          </div>
          <Toaster position="top-right" />
        </Router>
      </BranchProvider>
    </QueryClientProvider>
  );
}

// Routes Component - renamed to avoid naming conflict
const AppRoutes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default App;
