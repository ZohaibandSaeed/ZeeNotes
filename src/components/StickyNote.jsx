'use client';
import { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StickyNote({ note, onUpdate, onDelete, onDragEnd, onResizeEnd }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [size, setSize] = useState({ width: note.width || 256, height: note.height || 256 });
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (content !== note.content) {
      onUpdate(note.id, content);
    }
  };

  const getShapeClasses = (shape) => {
    switch (shape) {
      case 'circle': return 'rounded-full p-8';
      case 'rectangle': return 'rounded-xl p-6';
      case 'triangle': return 'p-10 pt-16 clip-triangle';
      case 'square':
      default: return 'rounded-xl p-6';
    }
  };

  const getShapeStyles = (shape) => {
    if (shape === 'triangle') {
      return { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
    }
    return {};
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: note.x || 0, y: note.y || 0 }}
      onDragEnd={(e, info) => {
        // info.point is absolute, info.offset is relative to start.
        // We will just use the transform style or state if needed, 
        // but for a simple sticky board, we can rely on Framer Motion's internal state
        // and optionally save it to DB. We use info.offset + initial to save.
        const currentX = (note.x || 0) + info.offset.x;
        const currentY = (note.y || 0) + info.offset.y;
        onDragEnd(note.id, currentX, currentY);
      }}
      className={`absolute group shadow-md hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing ${note.color} ${getShapeClasses(note.shape)}`}
      style={{
        width: size.width,
        height: size.height,
        ...getShapeStyles(note.shape),
        zIndex: isEditing ? 50 : 10,
      }}
    >
      {/* Action Buttons (visible on hover) */}
      <div 
        className={`absolute ${note.shape === 'triangle' ? 'bottom-4' : 'top-4 right-4'} flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20`}
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking buttons
      >
        {isEditing ? (
          <button onClick={handleSave} className="p-1.5 bg-white/50 hover:bg-white/80 rounded-full text-green-700 transition-colors cursor-pointer">
            <Save size={16} />
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="p-1.5 bg-white/50 hover:bg-white/80 rounded-full text-gray-700 transition-colors cursor-pointer">
            <Edit2 size={16} />
          </button>
        )}
        <button onClick={() => onDelete(note.id)} className="p-1.5 bg-white/50 hover:bg-white/80 rounded-full text-red-600 transition-colors cursor-pointer">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content */}
      <div 
        className="w-full h-full flex items-center justify-center mt-2 z-10"
        onPointerDown={(e) => isEditing && e.stopPropagation()} // Allow selecting text while editing without dragging
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-900 font-medium text-center placeholder-gray-500/70"
            placeholder="Type your note..."
          />
        ) : (
          <p className="text-gray-900 font-medium whitespace-pre-wrap w-full line-clamp-6 select-none" onClick={() => setIsEditing(true)}>
            {content || <span className="text-gray-500/70">Click to write note...</span>}
          </p>
        )}
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute bottom-1 right-1 w-6 h-6 cursor-se-resize z-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-1"
        onPointerDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = size.width;
            const startHeight = size.height;
            
            let finalWidth = startWidth;
            let finalHeight = startHeight;

            const onMove = (moveEvent) => {
              let newWidth = Math.max(150, startWidth + (moveEvent.clientX - startX));
              let newHeight = Math.max(150, startHeight + (moveEvent.clientY - startY));
              
              if (note.shape === 'square' || note.shape === 'circle') {
                const max = Math.max(newWidth, newHeight);
                newWidth = max;
                newHeight = max;
              }
              
              finalWidth = newWidth;
              finalHeight = newHeight;
              setSize({ width: newWidth, height: newHeight });
            };

            const onUp = () => {
              document.removeEventListener('pointermove', onMove);
              document.removeEventListener('pointerup', onUp);
              if (onResizeEnd) {
                onResizeEnd(note.id, finalWidth, finalHeight);
              }
            };

            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
          }}
        >
          <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-black/30 dark:border-white/30 rounded-sm" />
        </div>
    </motion.div>
  );
}
