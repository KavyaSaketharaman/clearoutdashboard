import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";

//Lazy loaded pages 
const Login         = lazy(() => import("@/pages/Login"));
const Dashboard     = lazy(() => import("@/pages/Dashboard"));
const EmailVerifier = lazy(() => import("@/pages/emailVerifier"));
const EmailFinder   = lazy(() => import("@/pages/emailFinder"));
const Prospect      = lazy(() => import("@/pages/prospect"));
const Settings      = lazy(() => import("@/pages/settings"));
const Formguard     = lazy(() => import("@/pages/Formguard"));

//Page loader
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}

//Wrap lazy pages in Suspense 
function withSuspense(Component) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

//Public Route — redirect to dashboard if already logged in
export function PublicRoute({ children }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  if (userInfo) return <Navigate to="/dashboard" replace />;
  return children;
}

//Protected Route — redirect to login if not logged in
export function ProtectedRoute({ children }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  if (!userInfo) return <Navigate to="/login" replace />;
  return children;
}

//Router 
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute>{withSuspense(Login)}</PublicRoute>,
  },
  {
    path: "/login",
    element: <PublicRoute>{withSuspense(Login)}</PublicRoute>,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute>{withSuspense(Dashboard)}</ProtectedRoute>,
  },
  {
    path: "/emailVerifier",
    element: <ProtectedRoute>{withSuspense(EmailVerifier)}</ProtectedRoute>,
  },
  {
    path: "/emailFinder",
    element: <ProtectedRoute>{withSuspense(EmailFinder)}</ProtectedRoute>,
  },
  {
    path: "/prospect",
    element: <ProtectedRoute>{withSuspense(Prospect)}</ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute>{withSuspense(Settings)}</ProtectedRoute>,
  },
  {
    path: "/Formguard",
    element: <ProtectedRoute>{withSuspense(Formguard)}</ProtectedRoute>,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;