'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, LayoutDashboard, Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import LocaleToggle from '@/components/common/LocaleToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const userRole = user?.role || '';

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/images/pk_sir_logo.jpg" 
                alt="PK Singh Logo" 
                className="w-[140px] h-auto rounded-lg bg-white px-2 py-1"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium">Home</Link>
            <Link href="/about" className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium">About</Link>
            <Link href="/courses" className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium">Courses</Link>
            <Link href="/blog" className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium">Blog</Link>
            <Link href="/faq" className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium">FAQ</Link>
            {user && (userRole === 'STUDENT' || userRole === 'MENTOR' || userRole === 'INSTRUCTOR') && (
              <Link href="/my-courses" className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium">My Courses</Link>
            )}
            <Link href="/#how" className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium">How It Works</Link>
          </div>

          {/* Desktop Right Side Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleToggle />
            <button onClick={toggleDark} className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Toggle dark mode">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                {(userRole === 'SUPER_ADMIN' || userRole === 'INSTRUCTOR' || userRole === 'MENTOR') && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold tracking-wide uppercase transition-all duration-300"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold uppercase">{user.fullName[0]}</span>
                    </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">{user.fullName}</span>
                    <span className="text-[10px] text-slate-500 font-medium capitalize leading-none">{user.role.toLowerCase()}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-slate-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Sign In</Link>
                <Link href="/signup" className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold tracking-wide transition-all shadow-lg duration-300">Enroll Free</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
              <img src="/images/pk_sir_logo.jpg" alt="PK Singh" className="w-[100px] h-auto rounded-lg bg-white px-2 py-1" />
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-3 pt-3 pb-6 space-y-1">
              <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all">Home</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all">About</Link>
              <Link href="/courses" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all">Courses</Link>
              <Link href="/blog" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all">Blog</Link>
              <Link href="/faq" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all">FAQ</Link>
              <Link href="/#how" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all">How It Works</Link>
            </div>

            {/* Mobile dark mode + locale */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-4">
              <button onClick={(e) => { e.stopPropagation(); toggleDark(); }} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <LocaleToggle />
            </div>

          {user ? (
            <div className="pt-4 pb-2 border-t border-slate-200 px-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-violet-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold uppercase">{user.fullName[0]}</span>
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-800">{user.fullName}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
              </div>
              {(userRole === 'SUPER_ADMIN' || userRole === 'INSTRUCTOR' || userRole === 'MENTOR') && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all"
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
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 px-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-2 rounded-lg border border-slate-300 text-slate-700 hover:text-slate-900 text-sm font-semibold transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md"
              >
                Enroll Free
              </Link>
            </div>
          )}
        </div>
        </div>
      )}
    </nav>
  );
}
