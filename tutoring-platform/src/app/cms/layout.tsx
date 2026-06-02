import React from 'react';
import Link from 'next/link';
import { BookOpen, LayoutDashboard, Settings, Users, MessageSquare, Video, FileText, Bell } from 'lucide-react';

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold tracking-tight text-blue-600">Enterprise CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Mentor Dashboard</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <NavItem href="/cms" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem href="/cms/pages" icon={<LayoutDashboard size={20} />} label="Homepage Builder" />
          <NavItem href="/cms/courses" icon={<BookOpen size={20} />} label="Courses & Lessons" />
          <NavItem href="/cms/media" icon={<Video size={20} />} label="Media Library" />
          <NavItem href="/cms/blogs" icon={<FileText size={20} />} label="Blogs" />
          <NavItem href="/cms/announcements" icon={<Bell size={20} />} label="Announcements" />
          <NavItem href="/cms/queries" icon={<MessageSquare size={20} />} label="Student Queries" />
          <NavItem href="/cms/students" icon={<Users size={20} />} label="Students" />
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <NavItem href="/cms/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
          <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Mentor Mode</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              M
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
