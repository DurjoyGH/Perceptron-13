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

// Reset user password
export const resetUserPassword = async (userId, options = {}) => {
  const response = await axiosInstance.post(`/admin/users/${userId}/reset-password`, options);
  return response.data;
};

// Sender email management
export const getSenderEmails = async () => {
  const response = await axiosInstance.get('/admin/sender-emails');
  return response.data;
};

export const addSenderEmail = async (senderEmailData) => {
  const response = await axiosInstance.post('/admin/sender-emails', senderEmailData);
  return response.data;
};

export const updateSenderEmail = async (senderEmailId, senderEmailData) => {
  const response = await axiosInstance.patch(`/admin/sender-emails/${senderEmailId}`, senderEmailData);
  return response.data;
};

export const setDefaultSenderEmail = async (senderEmailId) => {
  const response = await axiosInstance.patch(`/admin/sender-emails/${senderEmailId}/set-default`);
  return response.data;
};

export const removeDefaultSenderEmail = async (senderEmailId) => {
  const response = await axiosInstance.patch(`/admin/sender-emails/${senderEmailId}/remove-default`);
  return response.data;
};

export const deleteSenderEmail = async (senderEmailId) => {
  const response = await axiosInstance.delete(`/admin/sender-emails/${senderEmailId}`);
  return response.data;
};
