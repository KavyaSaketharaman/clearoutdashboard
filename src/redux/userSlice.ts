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
      state.userInfo = action.payload; // stores full data object
    },
    clearUser: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;