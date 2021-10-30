import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "../../api/authAPI";

export const login = createAsyncThunk("auth/login", async (user) => {
  const response = await authAPI.login(user);
  return response;
});
export const register = createAsyncThunk("auth/register", async (user) => {
  const response = await authAPI.register(user);
  return response;
});
export const logout = createAsyncThunk("auth/logout", async (user) => {
  const response = await authAPI.logout(user);
  return response;
});

export const loginByGoogle = createAsyncThunk("auth/google", async (token) => {
  const response = await authAPI.loginByGoogle(token);
  return response;
});

export const isUserLoggedIn = createAsyncThunk("auth/isUserLoggedIn", async () => {
  const response = await authAPI.isUserLoggedIn();
  return response;
});

const initialState = {
  user: null,
  authenticate: false,
  authenticating: false,
  token: null,
  loading: false,
  error: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      console.log(action);
      state.error = action.error;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user;
      state.token = action.payload.data.token;
      state.authenticate = true;
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    [logout.pending]: (state) => {
      state.loading = true;
    },
    [logout.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [logout.fulfilled]: (state) => {
      state.loading = false;
      state.authenticate = false;
      state = initialState;
      localStorage.clear();
    },
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      state.authenticate = true;
      state.user = action.payload.data.user;
      state.token = action.payload.data.token;
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    [loginByGoogle.pending]: (state) => {
      state.loading = true;
    },
    [loginByGoogle.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [loginByGoogle.fulfilled]: (state, action) => {
      state.loading = false;
      state.authenticate = true;
      state.user = action.payload.data.user;
      state.token = action.payload.data.token;
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    [isUserLoggedIn.pending]: (state) => {
      state.loading = true;
    },
    [isUserLoggedIn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message
    },
    [isUserLoggedIn.fulfilled]: (state, action) => {
      state.loading = false;
      const user = JSON.parse(localStorage.getItem("user"));
      state.user = user;
      state.token = localStorage.getItem("token");
      state.authenticate = action.payload.data.authenticate;
    },
  },
});

export default authSlice.reducer;
