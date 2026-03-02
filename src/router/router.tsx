import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export function PublicRoute() {
  const userInfo = useSelector((state) => state.user.userInfo);
  if (userInfo) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function ProtectedRoute() {
  const userInfo = useSelector((state) => state.user.userInfo);
  if (!userInfo) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function NotFoundRoute() {
  const userInfo = useSelector((state) => state.user.userInfo);
  if (userInfo) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
}
