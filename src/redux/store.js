import { configureStore } from "@reduxjs/toolkit";
import userReducer, { clearUser } from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// ── Sync logout across tabs ───────────────────────────────────────────────────
window.addEventListener("storage", (e) => {
  if (e.key === "auth_user" && e.newValue === null) {
    // auth_user was removed in another tab → log out this tab too
    store.dispatch(clearUser());
  }
});

export default store;

