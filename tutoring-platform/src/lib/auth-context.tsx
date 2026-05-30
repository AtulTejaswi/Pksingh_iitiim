'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from './api-client';
import { LoginInput, SignupInput } from './validators';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'STUDENT';
  country: 'IN' | 'US' | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<UserProfile>;
  registerUser: (data: SignupInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginInput) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { accessToken, user: basicUser } = response.data;
      
      localStorage.setItem('access_token', accessToken);
      
      // Fetch full profile to get role and details
      const profileResponse = await apiClient.get('/auth/me');
      const profile = profileResponse.data as UserProfile;
      
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (error: any) {
      setUser(null);
      throw new Error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (data: SignupInput) => {
    setLoading(true);
    try {
      // Call register
      await apiClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        country: data.country,
      });

      // Log in immediately
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      await fetchProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
