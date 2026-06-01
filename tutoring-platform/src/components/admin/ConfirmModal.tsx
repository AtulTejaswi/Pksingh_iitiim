'use client';
import React, { useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  itemName,
  confirmLabel = 'Yes, Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0f172a] shadow-2xl p-6 z-10">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white text-center mb-2">{title}</h3>
        {message && <p className="text-sm text-gray-400 text-center mb-2">{message}</p>}
        {itemName && <p className="text-xs text-gray-500 text-center mb-6 italic">&ldquo;{itemName}&rdquo;</p>}
        {!message && <p className="text-sm text-gray-400 text-center mb-6">This action cannot be undone.</p>}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] text-gray-300 text-sm font-semibold transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20'
                : 'bg-yellow-600 hover:bg-yellow-500 shadow-lg shadow-yellow-500/20'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
