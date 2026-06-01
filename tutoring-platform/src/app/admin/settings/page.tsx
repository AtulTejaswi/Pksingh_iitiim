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
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" /> Settings
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your admin account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile */}
        <div className="p-5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Admin Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Name</label>
              <p className="text-sm text-white font-medium">{user?.fullName || 'Admin'}</p>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Email</label>
              <p className="text-sm text-white font-medium">{user?.email || 'admin@pksingh.com'}</p>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Role</label>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {user?.role || 'ADMIN'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Quick Links</h2>
          </div>
          <div className="space-y-2">
            <Link href="/admin/courses/new" className="block w-full p-3 rounded-lg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)] text-sm text-gray-300 hover:text-white transition-all">
              + Create New Course
            </Link>
            <Link href="/admin/students" className="block w-full p-3 rounded-lg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)] text-sm text-gray-300 hover:text-white transition-all">
              Manage Enrollments
            </Link>
            <a
              href="https://pksingh.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-3 rounded-lg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)] text-sm text-gray-300 hover:text-white transition-all"
            >
              View Public Site →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
