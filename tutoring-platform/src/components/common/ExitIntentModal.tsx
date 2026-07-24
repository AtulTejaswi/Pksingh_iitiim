'use client';

import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import EmailCaptureForm from './EmailCaptureForm';

export default function ExitIntentModal() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [dismissed]);

  if (!show || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in-scale">
        <button
          onClick={() => { setShow(false); setDismissed(true); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Download className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Wait! Get Your Free Study Guide</h3>
          <p className="text-slate-600 text-sm">Comprehensive exam preparation notes + weekly tips from PK Singh.</p>
        </div>

        <EmailCaptureForm />
      </div>
    </div>
  );
}