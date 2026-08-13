'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, Trash2, Plus, RefreshCw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface Testimonial {
  id: string;
  name: string;
  studentPhoto: string | null;
  rank: string | null;
  achievement: string | null;
  review: string;
  status: string;
  isVerified: boolean;
  proofUrl: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

interface FormState {
  name: string;
  studentPhoto: string;
  rank: string;
  achievement: string;
  review: string;
  status: 'DRAFT' | 'PUBLISHED';
  isVerified: boolean;
  proofUrl: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  studentPhoto: '',
  rank: '',
  achievement: '',
  review: '',
  status: 'PUBLISHED',
  isVerified: false,
  proofUrl: '',
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiClient.get<Testimonial[]>('/cms/testimonials/all');
      setTestimonials(res.data || []);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || 'Could not load testimonials.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Name is required.');
      return;
    }
    if (!form.review.trim()) {
      toast.error('Review is required.');
      return;
    }
    if (form.isVerified && !form.proofUrl.trim()) {
      toast.error('Verified testimonials require a proof URL (scorecard image or video).');
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      studentPhoto: form.studentPhoto.trim() || null,
      rank: form.rank.trim() || null,
      achievement: form.achievement.trim() || null,
      proofUrl: form.proofUrl.trim() || null,
    };
    try {
      if (editingId) {
        await apiClient.put(`/cms/testimonials/${editingId}`, payload);
        toast.success('Testimonial updated.');
      } else {
        await apiClient.post('/cms/testimonials', payload);
        toast.success('Testimonial created.');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setLoading(true);
      load();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || 'Could not save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      studentPhoto: t.studentPhoto || '',
      rank: t.rank || '',
      achievement: t.achievement || '',
      review: t.review,
      status: t.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
      isVerified: t.isVerified,
      proofUrl: t.proofUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (t: Testimonial) => {
    if (!window.confirm(`Delete testimonial from ${t.name}? This cannot be undone.`)) return;
    try {
      await apiClient.delete(`/cms/testimonials/${t.id}`);
      toast.success('Testimonial deleted.');
      if (editingId === t.id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
      setLoading(true);
      load();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || 'Could not delete testimonial.');
    }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <div className="w-full text-left">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">Testimonials</h1>
        <p className="text-sm text-slate-500">
          Only <span className="font-semibold">published and verified</span> testimonials with a proof link are shown to students on the public site.
        </p>
      </div>

      <div className="mb-6 p-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            Proof-first policy: marking a testimonial <span className="font-bold">Verified</span> requires a proof URL.
            Anything without proof is never shown publicly, regardless of status.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800">
            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Student name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Arjun K."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Rank / result</label>
            <input
              className={inputClass}
              value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })}
              placeholder="e.g. AIR 214, JEE Advanced 2025"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Student photo URL</label>
            <input
              className={inputClass}
              value={form.studentPhoto}
              onChange={(e) => setForm({ ...form, studentPhoto: e.target.value })}
              placeholder="https://... or /uploads/..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Achievement label</label>
            <input
              className={inputClass}
              value={form.achievement}
              onChange={(e) => setForm({ ...form, achievement: e.target.value })}
              placeholder="e.g. 99.2 percentile"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Review *</label>
          <textarea
            className={`${inputClass} min-h-[96px] resize-y`}
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            placeholder="What did the student achieve and how did mentorship help?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
            >
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Proof URL (scorecard image / video) — required when verified
            </label>
            <input
              className={inputClass}
              value={form.proofUrl}
              onChange={(e) => setForm({ ...form, proofUrl: e.target.value })}
              placeholder="https://... link to scorecard or result video"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 mb-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isVerified}
            onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-sky-500" />
            Mark as verified (requires proof URL)
          </span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-bold transition-colors"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {saving ? 'Saving…' : editingId ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
      </form>

      {/* List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">All testimonials</h2>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-500 text-sm">No testimonials yet. Add your first above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {testimonials.map((t) => (
              <div key={t.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">{t.name}</span>
                    {t.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate max-w-md">{t.rank || 'No rank'} — {t.review}</p>
                  {t.isVerified && t.proofUrl && (
                    <a
                      href={t.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 text-xs font-semibold text-amber-600 hover:text-amber-800"
                    >
                      View proof →
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(t)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/results" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
          View the public verified outcomes page →
        </Link>
      </div>
    </div>
  );
}
