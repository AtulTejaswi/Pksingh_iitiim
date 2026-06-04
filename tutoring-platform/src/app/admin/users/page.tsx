'use client';

import React, { useState } from 'react';
import { useGetUsers, usePromoteUser, useDemoteUser } from '@/hooks/useUsers';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { data: users, isLoading } = useGetUsers();
  const promote = usePromoteUser();
  const demote = useDemoteUser();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await apiClient.get('/auth/users/export', {
        params: { format: 'csv' },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to export users');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm">Promote, demote, and export registered users.</p>
        </div>
        <button
          type="button"
          disabled={isExporting}
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : 'Export Users CSV'}
        </button>
      </div>

      {isLoading ? (
        <div className="text-slate-500">Loading users...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Name / Email</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-900">
              {users?.map((u: any) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{u.fullName || u.email}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.country || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-600">{u.role}</td>
                  <td className="px-4 py-3">
                    {u.role !== 'SUPER_ADMIN' ? (
                      <button
                        type="button"
                        onClick={() => promote.mutate(u.id, {
                          onSuccess: () => toast.success('User promoted to admin'),
                          onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to promote user'),
                        })}
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all"
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => demote.mutate(u.id, {
                          onSuccess: () => toast.success('User demoted to student'),
                          onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to demote user'),
                        })}
                        className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500 transition-all"
                      >
                        Demote
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
