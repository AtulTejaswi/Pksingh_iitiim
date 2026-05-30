'use client';

import React, { useState, use } from 'react';
import { useGetCourse } from '@/hooks/useCourses';
import { useDeleteLesson, useUploadMediaFile, useAddMediaLink, useDeleteMedia, useCreateNote, useDeleteNote } from '@/hooks/useLessons';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit3, Trash2, Video, FileText, Link2, ExternalLink, PlusCircle, Trash, ChevronDown, ChevronUp, FileCode, BookOpen } from 'lucide-react';

export default function AdminLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const { data: course, isLoading } = useGetCourse(courseId);
  const { mutate: deleteLesson, isPending: isDeleting } = useDeleteLesson();
  
  // Media / Notes mutations
  const { mutate: uploadMedia, isPending: isUploading } = useUploadMediaFile();
  const { mutate: addLink, isPending: isAddingLink } = useAddMediaLink();
  const { mutate: deleteMedia } = useDeleteMedia();
  const { mutate: createNote } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();

  // Selected lesson state for managing resources
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  // Form states for resource attachments
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState<'YOUTUBE_LINK' | 'EXTERNAL_LINK'>('YOUTUBE_LINK');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleDeleteLesson = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete lesson "${title}"?`)) {
      deleteLesson(
        { id, courseId },
        {
          onSuccess: () => {
            toast.success('Lesson deleted successfully');
          },
          onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Failed to delete lesson');
          },
        }
      );
    }
  };

  const handleUploadFile = (lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const title = file.name;
    uploadMedia(
      { lessonId, title, file },
      {
        onSuccess: () => {
          toast.success('File uploaded successfully!');
          e.target.value = ''; // Reset input
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'File upload failed');
        },
      }
    );
  };

  const handleAddLink = (lessonId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle || !linkUrl) {
      toast.error('Please enter link title and URL');
      return;
    }

    addLink(
      { lessonId, title: linkTitle, url: linkUrl, type: linkType },
      {
        onSuccess: () => {
          toast.success('Resource link attached successfully!');
          setLinkTitle('');
          setLinkUrl('');
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Failed to attach link');
        },
      }
    );
  };

  const handleAddNote = (lessonId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) {
      toast.error('Please fill in note title and body text');
      return;
    }

    createNote(
      { lessonId, title: noteTitle, content: noteContent },
      {
        onSuccess: () => {
          toast.success('Instructor note added successfully!');
          setNoteTitle('');
          setNoteContent('');
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || 'Failed to add note');
        },
      }
    );
  };

  const handleDeleteMedia = (id: string, lessonId: string) => {
    if (window.confirm('Delete this resource attachment?')) {
      deleteMedia(
        { id, lessonId },
        {
          onSuccess: () => {
            toast.success('Attachment deleted');
          },
        }
      );
    }
  };

  const handleDeleteNoteRecord = (id: string, lessonId: string) => {
    if (window.confirm('Delete this instructor note?')) {
      deleteNote(
        { id, lessonId },
        {
          onSuccess: () => {
            toast.success('Note deleted');
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-medium">Booting Syllabus Syllabus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 rounded-2xl glass-panel">
        <p className="text-gray-400 text-lg">Course not found.</p>
        <Link href="/admin/courses" className="mt-4 inline-block text-indigo-400 hover:text-white">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      {/* Back button */}
      <Link
        href="/admin/courses"
        className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm mb-6 transition-colors self-start w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            {course.subject}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
            Syllabus: {course.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage lectures, attachments, worksheets, and reference guides.</p>
        </div>
        <Link
          href={`/admin/courses/${courseId}/lessons/new`}
          className="glow-button px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Lecture Module
        </Link>
      </div>

      {/* Lessons Outline list */}
      {!course.lessons || course.lessons.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-panel max-w-2xl mx-auto">
          <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-white mb-2">No Lessons in Course</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
            Start structuring this course syllabus by adding your very first lecture module.
          </p>
          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="glow-button px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create First Lecture
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {course.lessons.map((lessonItem, idx) => {
            const isExpanded = expandedLessonId === lessonItem.id;
            return (
              <div
                key={lessonItem.id}
                className="rounded-2xl glass-panel overflow-hidden border border-[rgba(255,255,255,0.06)] shadow-md text-left transition-all"
              >
                {/* Header Summary */}
                <div
                  onClick={() => setExpandedLessonId(isExpanded ? null : lessonItem.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{lessonItem.title}</h3>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500 mt-1">
                        <span>{lessonItem.isFree ? 'Preview: Free' : 'Preview: Locked'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/admin/courses/${courseId}/lessons/${lessonItem.id}/edit`}
                      className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)] text-gray-300 transition-all"
                      title="Edit Lecture Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteLesson(lessonItem.id, lessonItem.title)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition-all"
                      title="Delete Lecture"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setExpandedLessonId(isExpanded ? null : lessonItem.id)}
                      className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] text-gray-400 hover:text-white transition-all"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Panel for managing uploads / notes */}
                {isExpanded && (
                  <div className="p-6 border-t border-[rgba(255,255,255,0.06)] bg-[#070a12]/20 space-y-8">
                    {/* Upload File Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Left: Attached Files list */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-indigo-400" /> Attached Worksheets & Files
                        </h4>
                        
                        {/* File uploads trigger */}
                        <div className="border-2 border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.01)] hover:border-indigo-500/30 rounded-xl p-4 transition-all text-center relative group">
                          <input
                            type="file"
                            onChange={(e) => handleUploadFile(lessonItem.id, e)}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <PlusCircle className="w-6 h-6 text-gray-500 mx-auto mb-2 group-hover:scale-115 transition-transform" />
                          <p className="text-[11px] text-gray-300 font-semibold">{isUploading ? 'Uploading file...' : 'Choose file or drag here'}</p>
                          <span className="text-[9px] text-gray-500 mt-1 block">PDF Worksheets, MP4 videos, jpeg images up to 50MB</span>
                        </div>
                      </div>

                      {/* Right: URL Links panel */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Link2 className="w-4 h-4 text-sky-400" /> Attach URL / YouTube Video
                        </h4>
                        <form onSubmit={(e) => handleAddLink(lessonItem.id, e)} className="space-y-3">
                          <input
                            type="text"
                            placeholder="Resource Title (e.g. YouTube Recoding)"
                            value={linkTitle}
                            onChange={(e) => setLinkTitle(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-xs outline-none focus:border-sky-500/50"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="https://youtube.com/watch?v=..."
                              value={linkUrl}
                              onChange={(e) => setLinkUrl(e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-xs outline-none focus:border-sky-500/50"
                            />
                            <select
                              value={linkType}
                              onChange={(e: any) => setLinkType(e.target.value)}
                              className="px-2 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-xs outline-none cursor-pointer"
                            >
                              <option value="YOUTUBE_LINK">YouTube</option>
                              <option value="EXTERNAL_LINK">Web Link</option>
                            </select>
                          </div>
                          <button
                            type="submit"
                            disabled={isAddingLink}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all w-full flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Attach URL Link
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Instructor Notes Form & records */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-6 border-t border-[rgba(255,255,255,0.04)]">
                      {/* Left: Instructor Notes list */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <FileCode className="w-4 h-4 text-pink-400" /> Instructor Notes list
                        </h4>
                        
                        <form onSubmit={(e) => handleAddNote(lessonItem.id, e)} className="space-y-3">
                          <input
                            type="text"
                            placeholder="Note Title (e.g. Derivation Summary)"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-xs outline-none focus:border-pink-500/50"
                          />
                          <textarea
                            placeholder="Markdown or HTML body content..."
                            rows={3}
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white text-xs outline-none focus:border-pink-500/50 resize-none"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all w-full flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Instructor Note
                          </button>
                        </form>
                      </div>

                      {/* Right: Attached Resource Preview and Deletion list */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Attached Resource Preview
                        </h4>
                        
                        {/* Dynamic loading from hook state */}
                        <div className="space-y-2">
                          {/* Fetch details on demand using active lesson item from cache */}
                          {/* Note: since lesson outline fetched inside list includes details if expanded, let's look at lessonItem.media */}
                          
                          {/* Media Links/Files */}
                          {lessonItem.media && lessonItem.media.length > 0 ? (
                            lessonItem.media.map((mediaFile) => (
                              <div
                                key={mediaFile.id}
                                className="p-2.5 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] flex items-center justify-between text-xs"
                              >
                                <span className="text-gray-300 truncate pr-4" title={mediaFile.title}>
                                  {mediaFile.type === 'VIDEO' ? '🎥' : mediaFile.type === 'PDF' ? '📄' : '🔗'} {mediaFile.title}
                                </span>
                                <button
                                  onClick={() => handleDeleteMedia(mediaFile.id, lessonItem.id)}
                                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all shrink-0"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-500 block italic">No media attachments linked yet.</span>
                          )}

                          {/* Instructor Notes */}
                          {lessonItem.notes && lessonItem.notes.length > 0 ? (
                            lessonItem.notes.map((noteItem) => (
                              <div
                                key={noteItem.id}
                                className="p-2.5 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] flex items-center justify-between text-xs"
                              >
                                <span className="text-gray-300 truncate pr-4">
                                  📝 {noteItem.title}
                                </span>
                                <button
                                  onClick={() => handleDeleteNoteRecord(noteItem.id, lessonItem.id)}
                                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all shrink-0"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-500 block italic">No instructor notes linked yet.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
