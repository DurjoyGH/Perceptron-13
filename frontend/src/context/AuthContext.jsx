import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, getCurrentUser, logout as logoutApi } from '../services/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        try {
          const response = await getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to get user:', error);
          // If getting user fails, try to refresh token
          if (refreshToken && error.response?.data?.code === 'TOKEN_EXPIRED') {
            // The axios interceptor will handle the refresh automatically
            try {
              const response = await getCurrentUser();
              setUser(response.data);
            } catch (retryError) {
              console.error('Failed to get user after refresh:', retryError);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              setAccessToken(null);
              setRefreshToken(null);
            }
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setAccessToken(null);
            setRefreshToken(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [accessToken, refreshToken]);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    const { user: userData, accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
    
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(userData);
    
    return response;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user && !!accessToken;
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
