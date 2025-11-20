import axiosInstance from './authApi';

// Get all users
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/admin/users');
  return response.data;
};

// Get user statistics
export const getUserStats = async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data;
};

// Send email to all members
export const sendEmailToAll = async (emailData) => {
  const response = await axiosInstance.post('/admin/send-email-all', emailData);
  return response.data;
};

// Send email to selected members
export const sendEmailToSelected = async (emailData) => {
  const response = await axiosInstance.post('/admin/send-email-selected', emailData);
  return response.data;
};

// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};
