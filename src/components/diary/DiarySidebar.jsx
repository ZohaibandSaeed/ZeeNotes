'use client';
import { Plus, FileText, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createDiaryFile, deleteDiaryFile, getDiaryFile } from '@/actions/diary';
import { useState } from 'react';

export default function DiarySidebar({ files }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    const result = await createDiaryFile('New Entry - ' + new Date().toLocaleDateString());
    if (result.success) {
      router.push(`/diary/${result.file.id}`);
    }
    setIsCreating(false);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this entry?')) {
      await deleteDiaryFile(id);
      if (pathname === `/diary/${id}`) {
        router.push('/diary');
      }
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = async (e, id, title) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const file = await getDiaryFile(id);
      if (file && file.contentHtml) {
        // html2canvas (used by html2pdf) crashes on Tailwind v4's modern oklch/lab colors.
        // The most reliable, text-selectable, and high-quality way to generate PDFs 
        // with modern CSS is using the browser's native print-to-pdf engine.
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { 
                  font-family: system-ui, -apple-system, sans-serif; 
                  line-height: 1.6; 
                  color: #1a1a1a;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 40px 20px;
                }
                h1 { 
                  font-size: 28px; 
                  margin-bottom: 24px; 
                  border-bottom: 1px solid #eaeaea;
                  padding-bottom: 10px;
                }
                /* Tiptap standard styles */
                p { margin-bottom: 1em; }
                ul, ol { margin-left: 20px; margin-bottom: 1em; }
                blockquote { border-left: 3px solid #ccc; padding-left: 10px; color: #666; }
                
                @media print {
                  body { padding: 0; }
                  @page { margin: 2cm; }
                }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              <div>${file.contentHtml}</div>
              <script>
                window.onload = () => {
                  window.print();
                  setTimeout(() => window.close(), 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full md:w-72 h-[calc(100vh-4rem)] md:h-screen border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">My Diary</h2>
        <button 
          onClick={handleCreate}
          disabled={isCreating}
          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {files.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-4">No diary entries yet.</p>
        ) : (
          files.map(file => {
            const isActive = pathname === `/diary/${file.id}`;
            return (
              <Link 
                key={file.id} 
                href={`/diary/${file.id}`}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors group ${
                  isActive ? 'bg-blue-50 dark:bg-zinc-800 border border-blue-100 dark:border-zinc-700' : 'hover:bg-gray-50 dark:hover:bg-zinc-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText size={18} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                    {file.title}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleDownload(e, file.id, file.title)}
                    title="Download as PDF"
                    disabled={isDownloading}
                    className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-all disabled:opacity-50"
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, file.id)}
                    title="Delete Entry"
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  );
}
