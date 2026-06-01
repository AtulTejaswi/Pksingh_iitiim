'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/95 backdrop-blur-xl shadow-[0_25px_80px_-40px_rgba(15,23,42,0.18)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center shadow-sm">
                <span className="font-bold text-white text-base">PK</span>
              </div>
              <span className="font-bold text-xl tracking-tight high-contrast">
                PK Singh <span className="text-[color:var(--accent)] font-medium text-sm ml-1">Mentor</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-200 hover:text-sky-300 transition-colors text-sm font-medium">Home</Link>
            <Link href="/about" className="text-slate-200 hover:text-sky-300 transition-colors text-sm font-medium">About</Link>
            <Link href="/courses" className="text-slate-200 hover:text-sky-300 transition-colors text-sm font-medium">Courses</Link>
            <Link href="/#how" className="text-slate-200 hover:text-sky-300 transition-colors text-sm font-medium">How It Works</Link>
          </div>

          {/* Desktop Right Side Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold tracking-wide uppercase transition-all duration-300"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-2 border-l border-[rgba(255,255,255,0.08)]">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold uppercase">{user.fullName[0]}</span>
                    </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-gray-200 leading-tight">{user.fullName}</span>
                    <span className="text-[10px] text-gray-400 font-medium capitalize leading-none">{user.role.toLowerCase()}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-slate-200 hover:text-sky-300 px-3 py-2 text-sm font-medium transition-colors">Sign In</Link>
                <Link href="/signup" className="glow-button px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-sm font-semibold tracking-wide transition-all shadow-lg duration-300">Enroll Free</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl px-2 pt-2 pb-4 space-y-1 shadow-sm">
          <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-sky-300">Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-sky-300">About</Link>
          <Link href="/courses" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-sky-300">Courses</Link>
          <Link href="/#how" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-sky-300">How It Works</Link>

          {user ? (
            <div className="pt-4 pb-2 border-t border-[rgba(255,255,255,0.08)] px-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold uppercase">{user.fullName[0]}</span>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-200">{user.fullName}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
              </div>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium text-sm transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] px-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm font-semibold transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md"
              >
                Enroll Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
