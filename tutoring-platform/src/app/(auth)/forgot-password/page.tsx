'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '@/lib/api-client';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validators';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [resetLink, setResetLink] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerMessage('');
    setResetLink('');
    try {
      const response = await apiClient.post('/auth/request-reset', data);
      setServerMessage(response.data.message || 'Check your email for the reset link.');
      if (response.data.resetUrl) {
        setResetLink(response.data.resetUrl);
      }
      setIsSubmitted(true);
    } catch (error: any) {
      const rawError = error.response?.data?.error;
      setServerMessage(typeof rawError === 'string' ? rawError : 'Unable to process your request.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-md w-full card p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-sky-400" />
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-md">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold high-contrast">Forgot Password</h2>
          <p className="muted text-xs sm:text-sm mt-2 leading-relaxed text-gray-400">
            Enter the email address for your account and we will send instructions to reset your password.
          </p>
        </div>

        {serverMessage ? (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 mb-6 text-sm text-white">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400" />
              <div>
                <p>{serverMessage}</p>
                {resetLink && (
                  <p className="mt-2 text-xs text-gray-300 break-all">
                    Reset Link: <a href={resetLink} className="text-indigo-300 underline">Open reset page</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[color:var(--text-muted)]" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="email@example.com"
                  className="input-dark pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none placeholder:text-[color:var(--text-muted)]"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-[10px] font-medium mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl glow-button bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : null}

        <div className="mt-6 text-center text-xs text-gray-400">
          <Link href="/login" className="text-indigo-400 hover:text-white font-semibold transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
