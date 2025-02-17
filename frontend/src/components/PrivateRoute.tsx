import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
