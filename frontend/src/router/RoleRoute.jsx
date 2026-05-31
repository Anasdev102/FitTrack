import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleRoute({ role }) {
  const { user, token, loading } = useSelector((state) => state.auth);
  const storedUser = localStorage.getItem("fitmanager_user");
  if (!user && token && loading) {
    return <div className="grid min-h-screen place-items-center bg-canvas text-sm font-black text-muted">Restoring session...</div>;
  }
  if (!user || !storedUser) return <Navigate to="/login" replace />;
  return user.role === role ? (
    <Outlet />
  ) : (
    <Navigate to={user.role === "admin" ? "/admin" : user.role === "coach" ? "/coach/dashboard" : "/member"} replace />
  );
}
