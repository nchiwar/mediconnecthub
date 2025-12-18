import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Providers from "./pages/Providers";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import PharmacyMarketplace from "./pages/PharmacyMarketplace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/patient-dashboard" element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/nurse-dashboard" element={
            <ProtectedRoute>
              <NurseDashboard />
            </ProtectedRoute>
          } />
          <Route path="/pharmacy-dashboard" element={
            <ProtectedRoute>
              <PharmacyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hospital-dashboard" element={
            <ProtectedRoute>
              <HospitalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/pharmacy-marketplace" element={<PharmacyMarketplace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;