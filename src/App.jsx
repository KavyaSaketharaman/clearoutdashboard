import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { Suspense } from "react";
import store from "@/redux/store";
import router from "@/router/routerConfig";

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
}