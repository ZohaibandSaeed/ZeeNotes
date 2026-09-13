import StickyNotesBoard from '@/components/StickyNotesBoard';
import { getStickyNotes } from '@/actions/notes';

// Force dynamic rendering since we are fetching from a database
export const dynamic = 'force-dynamic';

export default async function Home() {
  const notes = await getStickyNotes();

  return (
    <div className="min-h-screen">
      <StickyNotesBoard initialNotes={notes} />
    </div>
  );
}
