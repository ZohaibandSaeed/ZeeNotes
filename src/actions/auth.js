'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getAppPassword() {
  const row = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  if (row.length > 0) return row[0].appPassword;
  return process.env.APP_PASSWORD;
}

export async function loginWithPassword(prevState, formData) {
  const password = formData?.get('password');
  const actualPassword = await getAppPassword();
  
  console.log('Login attempt:', { provided: password, actual: actualPassword });
  
  if (password === actualPassword) {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    
    return { success: true };
  }
  
  return { error: 'Invalid password' };
}

export async function updatePassword(oldPassword, newPassword) {
  const actualPassword = await getAppPassword();
  
  if (oldPassword !== actualPassword) {
    return { error: 'Old password is incorrect' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { error: 'New password must be at least 6 characters' };
  }
  
  const existingRow = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  
  if (existingRow.length > 0) {
    await db.update(settings).set({ appPassword: newPassword }).where(eq(settings.id, 1));
  } else {
    await db.insert(settings).values({ id: 1, appPassword: newPassword });
  }
  
  const cookieStore = await cookies();
  cookieStore.set('auth_token', newPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/login');
}
