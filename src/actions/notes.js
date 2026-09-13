'use server';

import { db } from '@/db';
import { stickyNotes } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getStickyNotes() {
  try {
    const notes = await db.select().from(stickyNotes).orderBy(desc(stickyNotes.createdAt));
    return notes;
  } catch (error) {
    console.error('Failed to fetch sticky notes:', error);
    return [];
  }
}

export async function createStickyNote(formData) {
  try {
    const content = formData.get('content') || '';
    const shape = formData.get('shape') || 'square';
    const color = formData.get('color') || 'bg-yellow-200';
    
    await db.insert(stickyNotes).values({
      content,
      shape,
      color,
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create sticky note:', error);
    return { error: 'Failed to create note' };
  }
}

export async function updateStickyNote(id, content) {
  try {
    await db.update(stickyNotes)
      .set({ content, updatedAt: new Date() })
      .where(eq(stickyNotes.id, id));
      
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update sticky note:', error);
    return { error: 'Failed to update note' };
  }
}

export async function deleteStickyNote(id) {
  try {
    await db.delete(stickyNotes).where(eq(stickyNotes.id, id));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete sticky note:', error);
    return { error: 'Failed to delete note' };
  }
}

export async function updateStickyNotePosition(id, x, y) {
  try {
    await db.update(stickyNotes)
      .set({ x, y, updatedAt: new Date() })
      .where(eq(stickyNotes.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to update note position:', error);
    return { error: 'Failed to update position' };
  }
}

export async function updateStickyNoteSize(id, width, height) {
  try {
    await db.update(stickyNotes)
      .set({ width, height, updatedAt: new Date() })
      .where(eq(stickyNotes.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to update note size:', error);
    return { error: 'Failed to update size' };
  }
}
