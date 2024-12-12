import { loginStart, loginSuccess, loginFailure, registerStart,
  registerSuccess,
  registerFailure, } from "./authSlice";
import axios from "axios";

export const loginUser = async (dispatch, credentials) => {
  dispatch(loginStart());
  try {
    const response = await axios.post("/api/auth/login", credentials);
    const token = response.data.token;
    localStorage.setItem("authToken", token);
    dispatch(loginSuccess({ token, user: response.data.user }));
  } catch (err) {
    dispatch(loginFailure(err.response.data.message || "Invalid email or password. Please try again."));
    console.error(err);
  }
};


export const registerUser = async (dispatch, user) => {
  dispatch(registerStart());
  try {
      const response = await axios.post("/api/auth/register", user);
      dispatch(registerSuccess({user: response.data.user}));
  } catch (err) {
      dispatch(registerFailure(err.response.data.message || "Registration failed"));
  }
};