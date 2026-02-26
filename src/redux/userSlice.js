import { createSlice } from "@reduxjs/toolkit";

// ── Load user from localStorage on app start ──────────────────────────────────
function loadUser() {
  try {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: loadUser(), // ← rehydrate from localStorage on first load
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("auth_user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.userInfo = null;
      localStorage.removeItem("auth_user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;