'use client';

import React, { useState } from 'react';
import { useAskDoubt, useGetMyDoubts } from '@/hooks/useDoubts';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  AI_ANSWERED: 'bg-green-100 text-green-800',
  FLAGGED_FOR_REVIEW: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Awaiting AI',
  AI_ANSWERED: 'Answered by AI',
  FLAGGED_FOR_REVIEW: 'Flagged for tutor review',
  RESOLVED: 'Resolved by tutor',
};

export default function DoubtsPage() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const askDoubt = useAskDoubt();
  const { data: doubts, isLoading } = useGetMyDoubts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || question.trim().length < 10) return;

    try {
      await askDoubt.mutateAsync({
        questionText: question.trim(),
        subject: subject.trim() || undefined,
      });
      setQuestion('');
      setSubject('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Ask a Doubt</h1>
        <p className="mt-2 text-slate-600">
          Get instant AI-powered answers to your JEE/NEET questions. If the AI is not confident,
          your question will be flagged for a tutor review.
        </p>
      </div>

      {/* Ask Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
              Subject (optional)
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            >
              <option value="">Select subject...</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-1">
              Your Question
            </label>
            <textarea
              id="question"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here (at least 10 characters)..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none"
              required
              minLength={10}
            />
            <p className="mt-1 text-xs text-slate-500">
              {question.length}/10 minimum characters
            </p>
          </div>

          {askDoubt.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {(askDoubt.error as any)?.response?.data?.error || 'Failed to submit your question. Please try again.'}
            </div>
          )}

          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              Your question has been submitted! Check the answer below.
            </div>
          )}

          <button
            type="submit"
            disabled={!question.trim() || question.trim().length < 10 || askDoubt.isPending}
            className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {askDoubt.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Thinking...
              </>
            ) : (
              'Ask Question'
            )}
          </button>
        </form>

        {/* Show latest AI answer inline */}
        {askDoubt.data && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">AI Answer</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[askDoubt.data.doubt.status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[askDoubt.data.doubt.status] || askDoubt.data.doubt.status}
              </span>
            </div>

            {askDoubt.data.flaggedForReview && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3 text-sm text-orange-700">
                ⚠️ This answer has low confidence and has been flagged for a tutor review.
                A mentor will follow up soon.
              </div>
            )}

            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap">
              {askDoubt.data.doubt.aiAnswer}
            </div>

            {askDoubt.data.doubt.aiConfidence !== null && (
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>Confidence:</span>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${askDoubt.data.doubt.aiConfidence >= 0.7 ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${Math.round(askDoubt.data.doubt.aiConfidence * 100)}%` }}
                  />
                </div>
                <span>{Math.round(askDoubt.data.doubt.aiConfidence * 100)}%</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Previous Doubts */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Previous Questions</h2>

        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : !doubts?.length ? (
          <div className="text-center py-8 text-slate-500 bg-white rounded-2xl border border-slate-200">
            You haven&apos;t asked any doubts yet. Ask your first question above!
          </div>
        ) : (
          <div className="space-y-3">
            {doubts.map((doubt) => (
              <div key={doubt.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">{doubt.questionText}</p>
                    {doubt.subject && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                        {doubt.subject}
                      </span>
                    )}
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[doubt.status]}`}>
                    {statusLabels[doubt.status]}
                  </span>
                </div>

                {doubt.aiAnswer && (
                  <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap">
                    {doubt.aiAnswer}
                  </div>
                )}

                {doubt.resolutionNote && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    <span className="font-medium">Tutor response:</span> {doubt.resolutionNote}
                  </div>
                )}

                <p className="mt-2 text-xs text-slate-400">
                  {new Date(doubt.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
