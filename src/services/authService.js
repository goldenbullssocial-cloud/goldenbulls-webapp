import { signInWithPopup } from "firebase/auth";
import api from "@/utils/axiosInstance";
import { auth, provider } from "../../firebase";

export const signUp = async (data) => {
  const fromdata = new FormData();
  fromdata.append("name", data.name);
  fromdata.append("email", data.email);
  fromdata.append("password", data.password);
  fromdata.append("country", data.country);
  fromdata.append("state", data.state);
  fromdata.append("city", data.city);
  fromdata.append("referredBy", data.referredBy);
  try {
    const response = await api.post(`/user/signup`, fromdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // axios auto-parses JSON
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await api.post(`/user/signin`, {
      email,
      password,
    });

    return response.data; // axios auto-parses JSON
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = {
      email: result.user.email,
      name: result.user.displayName,
      accessToken: result.user.stsTokenManager.accessToken,
      profileImage: result.user.photoURL,
    }
    const response = await api.post(`/user/signinWithGoogle`,
      user,
    );
    return response.data;
  } catch (err) {
    console.error("Login error", err);
    throw err;
  }
};

export const forgetPassword = async (data) => {
  try {
    const response = await api.post(`/user/forgot`, {
      email: data.email,
    });
    return response.data;
  } catch (error) {
    console.error('Error during password reset request:', error);
    throw error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await api.post(`/user/verifyOtp`, {
      otp: data.otp,
      email: data.email,
    });

    return response.data;
  } catch (error) {
    console.error('Error during verify OTP:', error);
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await api.post(`/user/afterOtpVerify`,
      { email: data.email, password: data.password });

    return response.data;
  } catch (error) {
    console.error('Error during update password:', error);
    throw error;
  }
};
