import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RoleLoginPage from "./pages/RoleLoginPage";
import SignupPage from "./pages/SignupPage";
import MarketplacePage from "./pages/MarketplacePage";
import FeedPage from "./pages/FeedPage";
import MapPage from "./pages/MapPage";
import ImpactPage from "./pages/ImpactPage";
import AdminDashboard from "./pages/AdminDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NGODashboard from "./pages/NGODashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:role" element={<RoleLoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
          <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
          <Route path="/dashboard/ngo" element={<NGODashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
