'use server';

import { db } from '@/db';
import { diaryFiles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getDiaryFiles() {
  try {
    return await db.select().from(diaryFiles).orderBy(desc(diaryFiles.updatedAt));
  } catch (error) {
    console.error('Failed to fetch diary files:', error);
    return [];
  }
}

export async function getDiaryFile(id) {
  try {
    const file = await db.select().from(diaryFiles).where(eq(diaryFiles.id, id)).limit(1);
    return file[0] || null;
  } catch (error) {
    console.error('Failed to fetch diary file:', error);
    return null;
  }
}

export async function createDiaryFile(title) {
  try {
    const [newFile] = await db.insert(diaryFiles).values({
      title: title || 'Untitled Diary',
      contentHtml: '<p>Start writing...</p>',
    }).returning();
    
    revalidatePath('/diary');
    return { success: true, file: newFile };
  } catch (error) {
    console.error('Failed to create diary file:', error);
    return { error: 'Failed to create file' };
  }
}

export async function updateDiaryFile(id, contentHtml) {
  try {
    await db.update(diaryFiles)
      .set({ contentHtml, updatedAt: new Date() })
      .where(eq(diaryFiles.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to update diary file:', error);
    return { error: 'Failed to save' };
  }
}

export async function updateDiaryTitle(id, title) {
  try {
    await db.update(diaryFiles)
      .set({ title, updatedAt: new Date() })
      .where(eq(diaryFiles.id, id));
    revalidatePath('/diary');
    return { success: true };
  } catch (error) {
    console.error('Failed to update diary title:', error);
    return { error: 'Failed to update title' };
  }
}

export async function deleteDiaryFile(id) {
  try {
    await db.delete(diaryFiles).where(eq(diaryFiles.id, id));
    revalidatePath('/diary');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete diary file:', error);
    return { error: 'Failed to delete' };
  }
}
