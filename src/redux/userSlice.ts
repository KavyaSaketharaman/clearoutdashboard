import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  token: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

interface UserState {
  userInfo: UserInfo | null;
}

function loadUser(): UserInfo | null {
  try {
    const saved = localStorage.getItem("auth_user");
    return saved ? (JSON.parse(saved) as UserInfo) : null;
  } catch {
    return null;
  }
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: loadUser(),
  } as UserState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    clearUser: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
