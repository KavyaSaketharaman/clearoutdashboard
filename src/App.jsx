import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";


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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"              element={<Dashboard />} />
        <Route path="/emailVerifier" element={<EmailVerifier />} />
        <Route path="/emailFinder"   element={<EmailFinder />} />
        <Route path="/prospect"      element={<Prospect />} />
        <Route path="/settings"      element={<Settings />} />
        <Route path="/Formguard"     element={<Formguard />} />
      </Routes>
    </Suspense>
  );
}