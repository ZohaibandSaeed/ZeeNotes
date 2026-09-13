'use client';
import { useState } from 'react';
import StickyNote from './StickyNote';
import { Plus } from 'lucide-react';
import { createStickyNote, updateStickyNote, deleteStickyNote, updateStickyNotePosition, updateStickyNoteSize } from '@/actions/notes';

const SHAPES = ['square', 'rectangle', 'circle', 'triangle'];
const COLORS = [
  'bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200',
  'bg-purple-200', 'bg-orange-200', 'bg-teal-200', 'bg-rose-200'
];

export default function StickyNotesBoard({ initialNotes = [] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isAdding, setIsAdding] = useState(false);

  // New note state
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [newShape, setNewShape] = useState(SHAPES[0]);
  const [newContent, setNewContent] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (id, newContent) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content: newContent } : n));
    await updateStickyNote(id, newContent);
  };

  const handleDelete = async (id) => {
    setNotes(notes.filter(n => n.id !== id));
    await deleteStickyNote(id);
  };

  const handleDragEnd = async (id, x, y) => {
    setNotes(notes.map(n => n.id === id ? { ...n, x, y } : n));
    await updateStickyNotePosition(id, Math.round(x), Math.round(y));
  };

  const handleResizeEnd = async (id, width, height) => {
    setNotes(notes.map(n => n.id === id ? { ...n, width, height } : n));
    await updateStickyNoteSize(id, width, height);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsPending(true);
    const formData = new FormData();
    formData.append('content', newContent);
    formData.append('color', newColor);
    formData.append('shape', newShape);

    await createStickyNote(formData);
    window.location.reload();
  };

  return (
    <div className="p-6 md:p-10 min-h-screen relative overflow-hidden bg-gray-50/50 dark:bg-zinc-950/50">
      <div className="flex justify-end items-center mb-8 relative z-50 pointer-events-auto">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
          title="New Note"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add New Note Panel */}
      {isAdding && (
        <div className="relative z-50 pointer-events-auto">
          <form onSubmit={handleCreate} className="mb-10 p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl max-w-2xl animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note Content</label>
                  <textarea
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full h-32 p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    placeholder="What's on your mind?..."
                  />
                </div>
              </div>

              <div className="w-full md:w-64 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shape</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SHAPES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewShape(s)}
                        className={`py-2 px-3 text-sm capitalize rounded-lg border transition-colors ${newShape === s ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 font-semibold shadow-sm' : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewColor(c)}
                        className={`w-8 h-8 rounded-full ${c} border-2 transition-transform ${newColor === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-110'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="px-5 py-2.5 rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-70 shadow-md shadow-green-500/20">
                {isPending ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Freeform Canvas of Notes */}
      <div className="absolute inset-0 pt-24 overflow-hidden pointer-events-none">
        <div className="w-full h-full relative pointer-events-auto">
          {notes.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p className="text-xl">No notes yet.</p>
              <p>Click "New Note" to create one.</p>
            </div>
          )}

          {notes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onDragEnd={handleDragEnd}
              onResizeEnd={handleResizeEnd}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
