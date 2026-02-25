import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/redux/store";
import ProtectedRoute from "@/components/ProtectedRoute";

const Login         = lazy(() => import("./pages/Login"));
const Dashboard     = lazy(() => import("./pages/Dashboard"));
const EmailVerifier = lazy(() => import("./pages/emailVerifier"));
const EmailFinder   = lazy(() => import("./pages/emailFinder"));
const Prospect      = lazy(() => import("./pages/prospect"));
const Settings      = lazy(() => import("./pages/settings"));
const Formguard     = lazy(() => import("./pages/Formguard"));

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

export default function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/"      element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/emailVerifier" element={<ProtectedRoute><EmailVerifier /></ProtectedRoute>} />
          <Route path="/emailFinder"   element={<ProtectedRoute><EmailFinder /></ProtectedRoute>} />
          <Route path="/prospect"      element={<ProtectedRoute><Prospect /></ProtectedRoute>} />
          <Route path="/settings"      element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/Formguard"     element={<ProtectedRoute><Formguard /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Provider>
  );
}