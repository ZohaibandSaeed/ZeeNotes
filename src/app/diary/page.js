import { FileText } from 'lucide-react';

export default function DiaryIndexPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8">
      <FileText size={64} className="mb-4 opacity-50" />
      <h2 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">No Entry Selected</h2>
      <p className="text-center">Select an existing diary entry from the sidebar<br/>or create a new one to start writing.</p>
    </div>
  );
}
