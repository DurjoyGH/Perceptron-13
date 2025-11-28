import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register user
export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

// Logout user
export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

// Forgot password - Send OTP
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response.data;
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
  return response.data;
};

// Reset password
export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  const response = await axiosInstance.post('/auth/reset-password', { 
    resetToken, 
    newPassword, 
    confirmPassword 
  });
  return response.data;
};

export default axiosInstance;
