'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validators';
import { Key, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: '' },
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token') || '';
    setToken(tokenParam);
    setValue('token', tokenParam);
    if (!tokenParam) {
      setErrorMessage('Missing password reset token.');
    }
  }, [setValue]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setErrorMessage('');
    setServerMessage('');
    try {
      const response = await apiClient.post('/auth/reset-password', data);
      setServerMessage(response.data.message || 'Your password has been reset successfully.');
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login?resetSuccess=1');
      }, 1200);
    } catch (error: any) {
      const rawError = error.response?.data?.error;
      setErrorMessage(typeof rawError === 'string' ? rawError : 'Unable to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white shadow-md border border-slate-200 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-sky-400" />
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-md">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold high-contrast">Reset Password</h2>
          <p className="muted text-xs sm:text-sm mt-2 leading-relaxed text-slate-500">
            Create a new password for your account. Use the link sent to your email to continue.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 mb-6 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {serverMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-6 text-sm text-emerald-700">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500" />
              <div>{serverMessage}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" value={token} {...register('token')} />
          <div>
            <label className="form-label">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                {...register('password')}
                placeholder="Choose a strong password"
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-[10px] font-medium mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Repeat your password"
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-[10px] font-medium mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
