import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userInfo = useSelector((state) => state.user.userInfo);

  if (!userInfo) return <Navigate to="/login" replace />;
  return children;
}