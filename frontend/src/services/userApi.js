import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user profile
export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/profile`, profileData, {
    headers: getAuthHeader()
  });
  return response.data;
};
