'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupInput } from '@/lib/validators';
import { UserPlus, User, Mail, Key, ShieldCheck, Globe, AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setErrorMsg('');
    try {
      await registerUser(data);
      toast.success('Account created successfully! Welcome to PK Singh.');
      router.push('/my-courses');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 flex flex-col items-center justify-center py-12 px-4 relative">
      {/* Return to Home link */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="max-w-md w-full bg-white shadow-md border border-slate-200 rounded-xl p-8 relative overflow-hidden">
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-sky-400"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold high-contrast">Create Account</h2>
          <p className="muted text-xs sm:text-sm mt-2 leading-relaxed">
            Register in seconds and unlock every feature completely free!
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="form-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                {...register('fullName')}
                placeholder="John Doe"
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              />
            </div>
            {errors.fullName && (
              <p className="text-red-600 text-[10px] font-medium mt-1">{errors.fullName.message}</p>
            )}
          </div>

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

          {/* Country Selection */}
          <div>
            <label className="form-label">Region Target</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <select
                {...register('country')}
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none appearance-none"
              >
                <option value="IN">🇮🇳 India (JEE, NEET, MHT-CET)</option>
                <option value="US">🇺🇸 USA (SAT, AP Calculus, AP Physics)</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="form-label">Password</label>
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

          {/* Confirm Password */}
          <div>
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-[10px] font-medium mt-1">{errors.confirmPassword.message}</p>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
