import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

export function PublicRoute() {
  const userInfo = useAppSelector((state) => state.user.userInfo);
  if (userInfo) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function ProtectedRoute() {
  const userInfo = useAppSelector((state) => state.user.userInfo);
  if (!userInfo) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function NotFoundRoute() {
  const userInfo = useAppSelector((state) => state.user.userInfo);
  if (userInfo) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
}
