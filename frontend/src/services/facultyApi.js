import axiosInstance from './authApi';

// Get all faculty members (public)
export const getAllFaculty = async () => {
  const response = await axiosInstance.get('/faculty');
  return response.data;
};

// Get faculty member by ID (public)
export const getFacultyById = async (id) => {
  const response = await axiosInstance.get(`/faculty/public/${id}`);
  return response.data;
};

// Get own faculty profile (authenticated)
export const getFacultyProfile = async () => {
  const response = await axiosInstance.get('/faculty/profile/me');
  return response.data;
};

// Update own faculty profile (authenticated)
export const updateFacultyProfile = async (profileData) => {
  const response = await axiosInstance.put('/faculty/profile/me', profileData);
  return response.data;
};

// Update own faculty profile picture (authenticated)
export const updateFacultyProfilePicture = async (imageFile) => {
  const formData = new FormData();
  formData.append('profilePicture', imageFile);
  const response = await axiosInstance.put('/faculty/profile/me/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete own faculty profile picture (authenticated)
export const deleteOwnFacultyProfilePicture = async () => {
  const response = await axiosInstance.delete('/faculty/profile/me/picture');
  return response.data;
};

// Get all faculty members including inactive (admin)
export const getAllFacultyAdmin = async () => {
  const response = await axiosInstance.get('/faculty/admin/all');
  return response.data;
};

// Create new faculty member (admin)
export const createFaculty = async (facultyData) => {
  const response = await axiosInstance.post('/faculty', facultyData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Update faculty member (admin)
export const updateFaculty = async (id, facultyData) => {
  const response = await axiosInstance.put(`/faculty/${id}`, facultyData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete faculty member (admin)
export const deleteFaculty = async (id) => {
  const response = await axiosInstance.delete(`/faculty/${id}`);
  return response.data;
};

// Delete faculty profile picture (admin)
export const deleteFacultyProfilePicture = async (id) => {
  const response = await axiosInstance.delete(`/faculty/${id}/profile-picture`);
  return response.data;
};

// Add featured photo (authenticated faculty)
export const addFacultyFeaturedPhoto = async (imageFile, caption) => {
  const formData = new FormData();
  formData.append('photo', imageFile);
  if (caption) formData.append('caption', caption);
  const response = await axiosInstance.post('/faculty/profile/me/featured-photos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Update featured photo caption (authenticated faculty)
export const updateFacultyFeaturedPhoto = async (photoId, caption) => {
  const response = await axiosInstance.put(`/faculty/profile/me/featured-photos/${photoId}`, { caption });
  return response.data;
};

// Delete featured photo (authenticated faculty)
export const deleteFacultyFeaturedPhoto = async (photoId) => {
  const response = await axiosInstance.delete(`/faculty/profile/me/featured-photos/${photoId}`);
  return response.data;
};
