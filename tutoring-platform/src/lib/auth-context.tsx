'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from './api-client';
import { LoginInput, SignupInput } from './validators';

interface ApiErrorResponse {
  error?: unknown;
}

interface AuthError {
  isAxiosError?: boolean;
  code?: string;
  message?: string;
  response?: {
    status: number;
    data?: ApiErrorResponse;
  };
}

const isAuthError = (e: unknown): e is AuthError => {
  if (typeof e !== 'object' || e === null) return false;
  const r = e as Record<string, unknown>;
  return typeof r.isAxiosError === 'boolean' || typeof r.code === 'string' || typeof r.response !== 'undefined';
};

// Turns an axios error into a message that's actually true. A network-level
// failure (timeout, cold start, DNS) previously fell through to a hardcoded
// "Login failed" / raw JSON dump, which reads exactly like a credentials
// problem even when the real cause is the backend waking up.
const getFriendlyAuthError = (error: unknown, fallback: string): string => {
  if (!isAuthError(error)) {
    const detail = error instanceof Error ? error.message : String(error);
    return `Could not reach the server (${detail}). Please check your connection and try again.`;
  }

  if (!error.response) {
    if (error.code === 'ECONNABORTED' || /timeout/i.test(error.message ?? '')) {
      return 'The server is starting up (this can take up to a minute on first use). Please try again in a few seconds.';
    }
    return 'Could not reach the server. Please check your connection and try again.';
  }

  const status = error.response.status;
  const rawError = error.response.data?.error;
  const msg = typeof rawError === 'string' ? rawError : (rawError ? JSON.stringify(rawError) : '');

  if (status >= 500) return msg || 'The server hit an unexpected error. Please try again in a moment.';
  if (status === 503) return msg || 'Service is temporarily unavailable. Please try again shortly.';
  return msg || fallback;
};

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'INSTRUCTOR' | 'MENTOR' | 'STUDENT';
  country: 'IN' | 'US' | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  verified: boolean;
  login: (credentials: LoginInput) => Promise<UserProfile>;
  registerUser: (data: SignupInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);


  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setVerified(false);
  }, []);


  const fetchProfile = useCallback(async (opts?: { setLoading?: boolean }) => {
    const shouldSetLoading = opts?.setLoading ?? true;
    if (shouldSetLoading) setLoading(true);

    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);
      setVerified(true);
    } catch {
      logout();
    } finally {
      if (shouldSetLoading) setLoading(false);
    }
  }, [logout]);


  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      await fetchProfile({ setLoading: false });
    } else {
      logout();
    }
  }, [fetchProfile, logout]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const stored = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        setVerified(false);
        return;
      }

      if (stored) {
        try {
          const parsed = JSON.parse(stored) as UserProfile;
          setUser(parsed);
        } catch {
          // ignore parse errors and fall through
        }

        setLoading(false);
        fetchProfile({ setLoading: false }).catch(() => {});
        return;
      }

      await fetchProfile({ setLoading: true });
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user') {
        refreshUser().catch(() => {});
      }
    };

    window.addEventListener('storage', onStorage);
    initAuth();
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshUser, fetchProfile]);


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
        setVerified(true);
        return profile;
      }


      const profileResponse = await apiClient.get('/auth/me');
      const profile = profileResponse.data as UserProfile;

      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      setVerified(true);
      return profile;

    } catch (error) {
      setUser(null);
      throw new Error(getFriendlyAuthError(error, 'Invalid email or password. Please try again.'));
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
        referralCode: data.referralCode || undefined,
      });

      // Log in immediately
      await login({ email: data.email, password: data.password });
    } catch (error) {
      const e = error as AuthError;
      if (e?.response?.status === 409) {
        throw new Error('An account with this email already exists. Try signing in instead.');
      }
      throw new Error(getFriendlyAuthError(error, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        verified,
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
