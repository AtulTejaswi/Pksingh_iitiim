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

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

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
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const stored = localStorage.getItem('user');
      if (token) {
        // If we have a cached profile, use it immediately for UX,
        // then refresh the profile in background. If no cached profile,
        // fetch it synchronously.
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as UserProfile;
            setUser(parsed);
          } catch (err) {
            // ignore parse errors and fall through to fetch
          }
          setLoading(false);
          // Refresh in background (no await)
          fetchProfile().catch(() => {});
        } else {
          await fetchProfile();
        }
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginInput) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { accessToken, user: returnedUser } = response.data;

      localStorage.setItem('access_token', accessToken);

      // If the login response already included a user payload, use it
      // (this avoids an immediate /auth/me call which can fail due to
      // server JWT/configuration mismatches). Otherwise fetch profile.
      if (returnedUser) {
        const profile = returnedUser as UserProfile;
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
        return profile;
      }

      const profileResponse = await apiClient.get('/auth/me');
      const profile = profileResponse.data as UserProfile;

      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (error: any) {
      setUser(null);
      const rawError = error.response?.data?.error;
      const msg = typeof rawError === 'string' ? rawError : (rawError ? JSON.stringify(rawError) : 'Login failed');
      throw new Error(msg);
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
      const rawError = error.response?.data?.error;
      const msg = typeof rawError === 'string' ? rawError : (rawError ? JSON.stringify(rawError) : 'Registration failed');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // logout is declared above

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
