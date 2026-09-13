import { getDiaryFile } from '@/actions/diary';
import TiptapEditor from '@/components/diary/TiptapEditor';
import DiaryTitleInput from '@/components/diary/DiaryTitleInput';
import { notFound } from 'next/navigation';

export default async function DiaryEntryPage({ params }) {
  const { id } = await params;
  const file = await getDiaryFile(id);

  if (!file) {
    notFound();
  }

  return (
    <div className="h-full bg-white dark:bg-zinc-950">
      <div className="pt-8 px-4 md:px-8 max-w-4xl mx-auto">
        <DiaryTitleInput fileId={file.id} initialTitle={file.title} />
        <p className="text-sm text-gray-500 mb-8">{new Date(file.createdAt).toLocaleDateString()}</p>
      </div>
      <TiptapEditor fileId={file.id} initialContent={file.contentHtml} />
    </div>
  );
}
