import { getDiaryFiles } from '@/actions/diary';
import DiarySidebar from '@/components/diary/DiarySidebar';

// Force dynamic since we fetch files from DB
export const dynamic = 'force-dynamic';

export default async function DiaryLayout({ children }) {
  const files = await getDiaryFiles();

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] md:min-h-screen">
      <DiarySidebar files={files} />
      <div className="flex-1 bg-white dark:bg-zinc-950 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
