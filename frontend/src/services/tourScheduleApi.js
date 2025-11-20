import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/tour';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all schedules (public)
export const getAllSchedules = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    
    const response = await api.get(`/schedules?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get schedule by day (public)
export const getScheduleByDay = async (day) => {
  try {
    const response = await api.get(`/schedules/${day}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get schedule statistics (public)
export const getScheduleStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new schedule (admin only)
export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update schedule (admin only)
export const updateSchedule = async (day, updateData) => {
  try {
    const response = await api.put(`/schedules/${day}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete schedule (admin only)
export const deleteSchedule = async (day) => {
  try {
    const response = await api.delete(`/schedules/${day}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add event to schedule (admin only)
export const addEvent = async (day, eventData) => {
  try {
    const response = await api.post(`/schedules/${day}/events`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update event in schedule (admin only)
export const updateEvent = async (day, eventId, updateData) => {
  try {
    const response = await api.put(`/schedules/${day}/events/${eventId}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete event from schedule (admin only)
export const deleteEvent = async (day, eventId) => {
  try {
    const response = await api.delete(`/schedules/${day}/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add image to gallery (admin only)
export const addGalleryImage = async (day, imageFile, caption) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await api.post(`/schedules/${day}/gallery`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update gallery image caption (admin only)
export const updateGalleryImage = async (day, imageId, caption) => {
  try {
    const response = await api.put(`/schedules/${day}/gallery/${imageId}`, { caption });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete image from gallery (admin only)
export const deleteGalleryImage = async (day, imageId) => {
  try {
    const response = await api.delete(`/schedules/${day}/gallery/${imageId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
