import { createBrowserRouter } from "react-router-dom";
import { PublicRoute, ProtectedRoute, NotFoundRoute } from "./router";
import AppLayout from "@/components/layout";

import Login         from "@/pages/Login";
import Dashboard     from "@/pages/Dashboard";
import EmailVerifier from "@/pages/emailVerifier";
import EmailFinder   from "@/pages/emailFinder";
import Prospect      from "@/pages/prospect";
import Settings      from "@/pages/settings";
import Formguard     from "@/pages/Formguard";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/",      element: <Login /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard",     element: <Dashboard />     },
          { path: "/emailVerifier", element: <EmailVerifier /> },
          { path: "/emailFinder",   element: <EmailFinder />   },
          { path: "/prospect",      element: <Prospect />      },
          { path: "/settings",      element: <Settings />      },
          { path: "/formguard",     element: <Formguard />     },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundRoute />,
  },
]);

export default router;
