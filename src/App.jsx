import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/redux/store";
import router from "@/router/router";

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}