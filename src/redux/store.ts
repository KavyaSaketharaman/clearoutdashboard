import { configureStore } from "@reduxjs/toolkit";
import userReducer, { clearUser } from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// ── store.subscribe syncs Redux → localStorage on every state change ──────────
store.subscribe(() => {
  const { userInfo } = store.getState().user;

  if (userInfo) {
    localStorage.setItem("auth_user", JSON.stringify(userInfo));
  } else {
    localStorage.removeItem("auth_user");
  }

  // ── Check other tabs ───────────────────────────────────────────────────────
  const savedUser = localStorage.getItem("auth_user");
  if (!savedUser && store.getState().user.userInfo) {
    store.dispatch(clearUser());
  }
});

export default store;