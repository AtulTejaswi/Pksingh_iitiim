'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validators';
import { LogIn, Key, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [adminAutoTried, setAdminAutoTried] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const postLoginPath = () => {
    if (typeof window === 'undefined') return null;
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
      return redirect;
    }
    return null;
  };

  useEffect(() => {
    if (user) {
      const custom = postLoginPath();
      if (custom) {
        router.push(custom);
      } else if (user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/my-courses');
      }
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('expired')) {
      setErrorMsg('Your session has expired. Please sign in again.');
    }
    if (params.get('resetSuccess')) {
      setSuccessMsg('Your password has been updated. Please sign in with your new password.');
    }
  }, [user, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const shouldAuto = (params.get('adminQuick') === '1' || params.get('adminQuick') === 'true');
    if (shouldAuto && !user && !adminAutoTried) {
      setAdminAutoTried(true);
      (async () => {
        try {
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@pksingh.com';
          const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'adminpassword123';
          const profile = await login({ email: adminEmail, password: adminPassword });
          if (profile.role === 'SUPER_ADMIN') {
            router.push('/admin/dashboard');
          } else {
            router.push('/my-courses');
          }
        } catch (err: any) {
          setErrorMsg('Auto-login failed: ' + (err?.message || 'Unable to sign in'));
        }
      })();
    }
  }, [user, login, router, adminAutoTried]);

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const profile = await login(data);
      const custom = postLoginPath();
      if (custom) {
        router.push(custom);
      } else if (profile.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/my-courses');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    }
  };

return (
  <Suspense fallback={null}>
<div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 flex flex-col items-center justify-center px-4 relative">
      <div className="max-w-md w-full bg-white shadow-md border border-slate-200 rounded-xl p-8 relative overflow-hidden">
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-sky-400"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-md">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold high-contrast">Sign In</h2>
          <p className="muted text-xs sm:text-sm mt-2 leading-relaxed">
            Welcome back to PK Singh. Let's continue your training!
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs mb-6">
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                {...register('email')}
                placeholder="email@example.com"
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-[10px] font-medium mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="form-label">Password</label>
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-[10px] font-medium mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            Enroll Free
          </Link>
        </p>
      </div>
    </div>
  </Suspense>
);
}
