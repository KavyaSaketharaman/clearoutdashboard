import { createSlice } from "@reduxjs/toolkit";

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
    userInfo: loadUser(),
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;  // ← no localStorage here anymore
    },
    clearUser: (state) => {
      state.userInfo = null;            // ← no localStorage here anymore
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;