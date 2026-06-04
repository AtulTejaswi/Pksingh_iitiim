'use client';

import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Palette, Database } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="w-full text-left">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-blue-600" /> Settings
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your admin account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Admin Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Name</label>
              <p className="text-sm text-slate-900 font-medium">{user?.fullName || 'Admin'}</p>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Email</label>
              <p className="text-sm text-slate-900 font-medium">{user?.email || 'admin@pksingh.com'}</p>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Role</label>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 border border-blue-200">
                {user?.role || 'ADMIN'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Quick Links</h2>
          </div>
          <div className="space-y-2">
            <Link href="/admin/courses/new" className="block w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm text-slate-600 hover:text-slate-900 transition-all">
              + Create New Course
            </Link>
            <Link href="/admin/students" className="block w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm text-slate-600 hover:text-slate-900 transition-all">
              Manage Enrollments
            </Link>
            <a
              href="https://pksingh.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm text-slate-600 hover:text-slate-900 transition-all"
            >
              View Public Site →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
