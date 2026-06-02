'use client';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Save, Plus, File, Video, AlertCircle, GripVertical } from 'lucide-react';

// Note: Utilizing @hello-pangea/dnd (or @dnd-kit) for the drag-and-drop list
// Scaffolded skeleton for the Course Builder Redesign (Phase 4)
export default function CourseBuilderPage() {
  const [lessons, setLessons] = useState([
    { id: '1', title: 'Introduction to Mechanics', type: 'video', isPublished: true },
    { id: '2', title: 'Kinematics Formula Sheet', type: 'pdf', isPublished: true },
    { id: '3', title: 'Newton Laws', type: 'video', isPublished: false },
  ]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLessons(items);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Course Builder: Complete Physics Masterclass</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span> Unsaved changes detected
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">
            <Save size={16} />
            Save Draft
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm">
            Publish
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Course Metadata */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" defaultValue="Complete Physics Masterclass" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" rows={4} defaultValue="A comprehensive guide to IIT-JEE Physics." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                  <File size={24} className="mb-2" />
                  <span className="text-sm">Click to upload thumbnail</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Curriculum Drag and Drop */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Curriculum</h3>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                <Plus size={16} />
                Add Lesson
              </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="lessons-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600">
                                <GripVertical size={18} />
                              </div>
                              <div className="p-2 bg-white rounded-md shadow-sm text-blue-500">
                                {lesson.type === 'video' ? <Video size={16} /> : <File size={16} />}
                              </div>
                              <span className="font-medium text-gray-800">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {lesson.isPublished ? (
                                <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Published</span>
                              ) : (
                                <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full">Draft</span>
                              )}
                              <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {lessons.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No lessons yet</h3>
                <p className="text-gray-500 mt-1">Get started by creating your first lesson.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
