import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/user`;

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all members (public - no auth required)
export const getAllMembers = async () => {
  const response = await axios.get(`${API_URL}/members`);
  return response.data;
};

// Get member by student ID (public - no auth required)
export const getMemberByStudentId = async (studentId) => {
  const response = await axios.get(`${API_URL}/members/${studentId}`);
  return response.data;
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

// Update profile picture
export const updateProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const response = await axios.put(`${API_URL}/profile-picture`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete profile picture
export const deleteProfilePicture = async () => {
  const response = await axios.delete(`${API_URL}/profile-picture`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Add featured photo
export const addFeaturedPhoto = async (file, caption = '') => {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('caption', caption);
  
  const response = await axios.post(`${API_URL}/featured-photos`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Update featured photo caption
export const updateFeaturedPhoto = async (photoId, caption) => {
  const response = await axios.put(`${API_URL}/featured-photos/${photoId}`, 
    { caption }, 
    {
      headers: getAuthHeader()
    }
  );
  return response.data;
};

// Delete featured photo
export const deleteFeaturedPhoto = async (photoId) => {
  const response = await axios.delete(`${API_URL}/featured-photos/${photoId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};
