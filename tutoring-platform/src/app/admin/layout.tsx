'use client';

import React from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, GraduationCap, ArrowLeft, LogOut, Settings, Users } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/admin/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/courses',
      label: 'Courses Manager',
      icon: BookOpen,
    },
    {
      href: '/admin/students',
      label: 'Students Manager',
      icon: Users,
    },
  ];

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-[#0b0f19] flex">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-[rgba(255,255,255,0.06)] bg-[#070a12]/80 backdrop-blur-md flex flex-col justify-between p-6 shrink-0 z-40 sticky top-0 h-screen">
          <div className="space-y-8 text-left">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/25">
                <span className="font-bold text-white text-base">P</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-white leading-none">
                PK <span className="text-indigo-400 font-medium text-xs block mt-0.5">Control Panel</span>
              </span>
            </Link>

            {/* Menu Items */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      isActive
                        ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.02)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom actions */}
          <div className="space-y-4 pt-6 border-t border-[rgba(255,255,255,0.06)]">
            {/* Profile */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase">{user?.fullName[0]}</span>
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-white font-semibold text-xs leading-none truncate">{user?.fullName}</p>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Instructor</span>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.02)] text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-gray-400" />
              Student Portal
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-transparent text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Content panel */}
        <main className="flex-1 overflow-x-hidden min-h-screen p-8 sm:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
