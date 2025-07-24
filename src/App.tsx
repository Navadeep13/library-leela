import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { initializeData } from "@/data/initialData";
import MainLayout from "@/components/Layout/MainLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Books from "@/pages/Books";
import Members from "@/pages/Members";
import Transactions from "@/pages/Transactions";
import MyBooks from "@/pages/MyBooks";
import BookRequests from "@/pages/BookRequests";
import Reports from "@/pages/Reports";
import AdminPanel from "@/pages/AdminPanel";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/NotFound";

// Initialize sample data
initializeData();

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="books" element={<Books />} />
              <Route path="members" element={<Members />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="my-books" element={<MyBooks />} />
              <Route path="book-requests" element={<BookRequests />} />
              <Route path="reports" element={<Reports />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
