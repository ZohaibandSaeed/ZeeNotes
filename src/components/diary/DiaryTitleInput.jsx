'use client';
import { useState, useRef, useEffect } from 'react';
import { updateDiaryTitle } from '@/actions/diary';

export default function DiaryTitleInput({ fileId, initialTitle }) {
  const [title, setTitle] = useState(initialTitle);
  const saveTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      await updateDiaryTitle(fileId, newTitle || 'Untitled Diary');
    }, 800); // 800ms debounce
  };

  return (
    <input 
      type="text"
      value={title}
      onChange={handleChange}
      placeholder="Diary Title..."
      className="text-4xl font-bold bg-transparent border-none outline-none w-full text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-700 mb-2 focus:ring-0"
    />
  );
}
