import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import RegistrationPage from "./pages/RegistrationPage";
import AdminDashboard from "./pages/AdminDashboard";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import OrganizationsPage from "./pages/OrganizationsPage";
import AdminsPage from "./pages/AdminsPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute requiredRole="SUPERADMIN">
                  <SuperadminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/organizations"
              element={
                <ProtectedRoute requiredRole="SUPERADMIN">
                  <OrganizationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/admins"
              element={
                <ProtectedRoute requiredRole="SUPERADMIN">
                  <AdminsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/profile"
              element={
                <ProtectedRoute requiredRole="SUPERADMIN">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
