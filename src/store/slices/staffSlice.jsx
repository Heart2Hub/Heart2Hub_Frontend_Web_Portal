import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi, staffApi } from "../../api/Api";

const initialStaff = {
  staffId: "",
  username: "",
  firstname: "",
  lastname: "",
  mobileNumber: "",
  isHead: "",
  roleEnum: "",
};

const initialState = {
  staffSliceData: {
    staff: initialStaff,
    accessToken: localStorage.getItem("accessToken")
      ? localStorage.getItem("accessToken")
      : "",
  },
};

export const login = createAsyncThunk(
  "staff/staffLogin",
  async (credentials) => {
    try {
      const response = await authApi.login(
        credentials.username,
        credentials.password
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const postLogin = createAsyncThunk(
  "staff/getStaffByUsername",
  async (details) => {
    try {
      const response = await staffApi.getStaffByUsername(details.username);
      localStorage.setItem("staffUsername", details.username);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("staffUsername");
      localStorage.removeItem("isLoggedIn");
      state.staffSliceData.staff = initialStaff;
      state.staffSliceData.username = "";
      state.staffSliceData.accessToken = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.staffSliceData.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    });
    builder.addCase(postLogin.fulfilled, (state, action) => {
      state.staffSliceData.staff = action.payload;
      state.staffSliceData.staff.password = null;
      localStorage.setItem("isLoggedIn", true);
    });
  },
});

export const selectStaff = (state) => state.user.staffSliceData.staff;
export const selectUsername = (state) => state.user.staffSliceData.username;
export const selectAccessToken = (state) =>
  state.user.staffSliceData.accessToken;

// Action creators are generated for each case reducer function
export const { logout } = staffSlice.actions;

export default staffSlice.reducer;
