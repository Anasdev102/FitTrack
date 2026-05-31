import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { token } = useSelector((state) => state.auth);
  const storedToken = localStorage.getItem("fitmanager_token");
  return token && storedToken ? <Outlet /> : <Navigate to="/login" replace />;
}
