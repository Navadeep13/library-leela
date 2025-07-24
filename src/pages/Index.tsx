import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default Index;
