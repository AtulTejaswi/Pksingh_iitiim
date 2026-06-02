import React from 'react';
import { BookOpen, Users, Video, DollarSign } from 'lucide-react';

export default function CMSDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Mentor!</h1>
        <p className="text-gray-500 mt-1">Here is what is happening with your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="1,248" icon={<Users className="text-blue-500" size={24} />} trend="+12% from last month" />
        <StatCard title="Active Courses" value="12" icon={<BookOpen className="text-emerald-500" size={24} />} trend="+2 this week" />
        <StatCard title="Media Assets" value="342" icon={<Video className="text-purple-500" size={24} />} trend="85% storage used" />
        <StatCard title="Revenue" value="$12,450" icon={<DollarSign className="text-orange-500" size={24} />} trend="+8% from last month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem title="New enrollment in 'JEE Advanced Physics'" time="10 minutes ago" type="enrollment" />
            <ActivityItem title="Student queried 'Calculus Chapter 4'" time="1 hour ago" type="query" />
            <ActivityItem title="System auto-saved 'Chemistry Basics' draft" time="3 hours ago" type="system" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors font-medium text-gray-700">
              Create New Course
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors font-medium text-gray-700">
              Upload Media Asset
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors font-medium text-gray-700">
              Edit Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4">{trend}</p>
    </div>
  );
}

function ActivityItem({ title, time, type }: { title: string; time: string; type: string }) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className={`h-2 w-2 rounded-full mt-2 ${type === 'enrollment' ? 'bg-emerald-500' : type === 'query' ? 'bg-orange-500' : 'bg-blue-500'}`} />
      <div>
        <p className="text-gray-800 font-medium">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
