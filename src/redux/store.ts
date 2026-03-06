import { configureStore } from "@reduxjs/toolkit";
import userReducer, { clearUser } from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Sync Redux → localStorage on every state change
store.subscribe(() => {
  const { userInfo } = store.getState().user;

  if (userInfo) {
    localStorage.setItem("auth_user", JSON.stringify(userInfo));
  } else {
    localStorage.removeItem("auth_user");
  }

  // Cross-tab logout
  const savedUser = localStorage.getItem("auth_user");
  if (!savedUser && store.getState().user.userInfo) {
    store.dispatch(clearUser());
  }
});

export default store;
