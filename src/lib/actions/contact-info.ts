'use server';

import { saveContactSectionInfo } from '@/lib/cms/contact-info';
import { revalidatePath } from 'next/cache';
import { ContactSectionInfo } from '@/lib/cms/contact-info';

export async function updateContactInfoAction(data: ContactSectionInfo) {
  try {
    await saveContactSectionInfo(data);
    revalidatePath('/');
    revalidatePath('/admin/settings');
    return { success: true, message: 'Холбоо баригчийн мэдээллийг амжилттай обновлуулсан' };
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw new Error('Холбоо баригчийн мэдээллийг обновлуулахад алдаа гарлаа');
  }
}
