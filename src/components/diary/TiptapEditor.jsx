'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { updateDiaryFile } from '@/actions/diary';

const COLORS = [
  { label: 'Default', value: 'inherit' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Purple', value: '#a855f7' },
];

export default function TiptapEditor({ fileId, initialContent }) {
  const saveTimeoutRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Auto-save logic with debounce
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        await updateDiaryFile(fileId, html);
      }, 1000);
    }
  });

  if (!editor) return null;

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col pt-8 px-4 md:px-8 pb-32">
      <div className="sticky top-0 md:top-4 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-2xl p-2 flex flex-wrap gap-2 mb-8 shadow-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          <UnderlineIcon size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 my-auto mx-1" />

        {/* Font Sizes (Headings) */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg transition-colors font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-colors font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg transition-colors font-medium ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded-lg transition-colors text-sm font-medium ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
        >
          P
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 my-auto mx-1" />

        {/* Font Colors */}
        <div className="flex items-center gap-1 px-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => editor.chain().focus().setColor(c.value).run()}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${editor.isActive('textStyle', { color: c.value }) ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c.value === 'inherit' ? 'var(--foreground)' : c.value }}
              title={c.label}
            />
          ))}
        </div>
      </div>

      <EditorContent editor={editor} className="flex-1 cursor-text" />
    </div>
  );
}
