import { createBrowserRouter } from "react-router-dom";
import { PublicRoute, ProtectedRoute, NotFoundRoute } from "./router";
import AppLayout from "@/components/layout";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import EmailVerifier from "@/pages/emailVerifier";
import EmailFinder from "@/pages/emailFinder";
import Prospect from "@/pages/prospect";
import Settings from "@/pages/settings";
import Formguard from "@/pages/Formguard";

// const PageLoader = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
//         <p className="text-sm text-gray-400 font-medium">Loading...</p>
//       </div>
//     </div>
//   );
// }

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <PublicRoute>{withSuspense(Login)}</PublicRoute>,
//   },
//   {
//     path: "/login",
//     element: <PublicRoute>{withSuspense(Login)}</PublicRoute>,
//   },
//   {
//     path: "/dashboard",
//     element: <ProtectedRoute>{withSuspense(Dashboard)}</ProtectedRoute>,
//   },
//   {
//     path: "/emailVerifier",
//     element: <ProtectedRoute>{withSuspense(EmailVerifier)}</ProtectedRoute>,
//   },
//   {
//     path: "/emailFinder",
//     element: <ProtectedRoute>{withSuspense(EmailFinder)}</ProtectedRoute>,
//   },
//   {
//     path: "/prospect",
//     element: <ProtectedRoute>{withSuspense(Prospect)}</ProtectedRoute>,
//   },
//   {
//     path: "/settings",
//     element: <ProtectedRoute>{withSuspense(Settings)}</ProtectedRoute>,
//   },
//   {
//     path: "/Formguard",
//     element: <ProtectedRoute>{withSuspense(Formguard)}</ProtectedRoute>,
//   },
//   {
//     path: "*",
//     element: <Navigate to="/login" replace />,
//   },
// ]);

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/emailVerifier", element: <EmailVerifier /> },
          { path: "/emailFinder", element: <EmailFinder /> },
          { path: "/prospect", element: <Prospect /> },
          { path: "/settings", element: <Settings /> },
          { path: "/formguard", element: <Formguard /> }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundRoute />
  }
])

export default router
