'use client';

import React, { useState } from 'react';
import {
  useGetLesson,
  useUploadMediaFile,
  useAddMediaLink,
  useDeleteMedia,
  useCreateNote,
  useDeleteNote,
} from '@/hooks/useLessons';
import { toast } from 'sonner';
import { Plus, Trash, FileText, Link2, PlusCircle, ExternalLink } from 'lucide-react';

interface LessonResourcesPanelProps {
  lessonId: string;
  courseId: string;
  lessonTitle: string;
}

export default function LessonResourcesPanel({ lessonId, courseId, lessonTitle }: LessonResourcesPanelProps) {
  const { data: lesson, isLoading, refetch } = useGetLesson(lessonId);

  const { mutate: uploadMedia, isPending: isUploading } = useUploadMediaFile();
  const { mutate: addLink, isPending: isAddingLink } = useAddMediaLink();
  const { mutate: deleteMedia } = useDeleteMedia();
  const { mutate: createNote } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();

  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState<'YOUTUBE_LINK' | 'EXTERNAL_LINK'>('YOUTUBE_LINK');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File must be under 50MB');
      e.target.value = '';
      return;
    }

    const allowed = ['application/pdf', 'video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Allowed: PDF, MP4, WebM, JPEG, PNG, WebP');
      e.target.value = '';
      return;
    }

    uploadMedia(
      { lessonId, courseId, title: file.name, file },
      {
        onSuccess: () => {
          toast.success('File uploaded');
          refetch();
          e.target.value = '';
        },
        onError: (err: { response?: { data?: { error?: string } } }) => {
          toast.error(err.response?.data?.error || 'Upload failed');
          e.target.value = '';
        },
      }
    );
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkUrl.trim()) {
      toast.error('Enter a title and URL');
      return;
    }

    const isYoutube = linkUrl.includes('youtube.com') || linkUrl.includes('youtu.be');
    const type = isYoutube ? 'YOUTUBE_LINK' : linkType;

    addLink(
      { lessonId, courseId, title: linkTitle.trim(), url: linkUrl.trim(), type },
      {
        onSuccess: () => {
          toast.success('Link attached');
          setLinkTitle('');
          setLinkUrl('');
          refetch();
        },
        onError: (err: { response?: { data?: { error?: string } } }) => {
          toast.error(err.response?.data?.error || 'Failed to attach link');
        },
      }
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error('Enter note title and content');
      return;
    }

    createNote(
      { lessonId, courseId, title: noteTitle.trim(), content: noteContent.trim() },
      {
        onSuccess: () => {
          toast.success('Note added');
          setNoteTitle('');
          setNoteContent('');
          refetch();
        },
        onError: (err: { response?: { data?: { error?: string } } }) => {
          toast.error(err.response?.data?.error || 'Failed to add note');
        },
      }
    );
  };

  if (isLoading) {
    return <p className="text-gray-500 text-sm py-4">Loading attachments...</p>;
  }

  const media = lesson?.media ?? [];
  const notes = lesson?.notes ?? [];

  return (
    <div className="p-6 border-t border-[rgba(255,255,255,0.06)] bg-[#070a12]/20 space-y-8">
      <p className="text-xs text-gray-500">
        Managing content for: <span className="text-gray-300 font-semibold">{lessonTitle}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-400" /> Upload PDF / video / image
          </h4>
          <div className="border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-xl p-6 text-center relative hover:border-indigo-500/30 transition-all">
            <input
              type="file"
              onChange={handleUploadFile}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              accept=".pdf,.mp4,.webm,.jpg,.jpeg,.png,.webp"
            />
            <PlusCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-300 font-medium">{isUploading ? 'Uploading...' : 'Click or drop file here'}</p>
            <p className="text-[10px] text-gray-500 mt-1">PDF, MP4, WebM, images — max 50MB</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-sky-400" /> YouTube or web link
          </h4>
          <form onSubmit={handleAddLink} className="space-y-3">
            <input
              type="text"
              placeholder="Title (e.g. Lecture recording)"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none focus:border-sky-500/50"
            />
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none focus:border-sky-500/50"
            />
            <select
              value={linkType}
              onChange={(e) => setLinkType(e.target.value as 'YOUTUBE_LINK' | 'EXTERNAL_LINK')}
              className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0b0f19] text-white text-sm outline-none"
            >
              <option value="YOUTUBE_LINK">YouTube</option>
              <option value="EXTERNAL_LINK">Other link</option>
            </select>
            <button
              type="submit"
              disabled={isAddingLink}
              className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Attach link
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-[rgba(255,255,255,0.04)]">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instructor note (text)</h4>
          <form onSubmit={handleAddNote} className="space-y-3">
            <input
              type="text"
              placeholder="Note title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none"
            />
            <textarea
              placeholder="Lesson summary, formulas, instructions..."
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-sm outline-none resize-none"
            />
            <button type="submit" className="w-full py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold">
              Add note
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Attached content</h4>
          {media.length === 0 && notes.length === 0 && (
            <p className="text-sm text-gray-500 italic">No files, videos, or notes yet.</p>
          )}
          {media.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 p-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="text-gray-200 truncate font-medium">{item.title}</p>
                <p className="text-[10px] text-gray-500 uppercase">{item.type.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-sky-400 hover:text-sky-300"
                  title="Open"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() =>
                    deleteMedia(
                      { id: item.id, lessonId, courseId },
                      {
                        onSuccess: () => {
                          toast.success('Removed');
                          refetch();
                        },
                      }
                    )
                  }
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-start justify-between gap-2 p-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="text-gray-200 font-medium">{note.title}</p>
                <p className="text-gray-500 text-xs line-clamp-2 mt-1">{note.content}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  deleteNote(
                    { id: note.id, lessonId, courseId },
                    {
                      onSuccess: () => {
                        toast.success('Note removed');
                        refetch();
                      },
                    }
                  )
                }
                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded shrink-0"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
