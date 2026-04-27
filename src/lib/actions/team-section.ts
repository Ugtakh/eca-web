'use server';

import { revalidatePath } from 'next/cache';
import { ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

import { getUser } from '@/lib/actions/auth';
import { createTeamMember, updateTeamMember, deleteTeamMember, type TeamMember } from '@/lib/cms/team-section';
import { createAdminClient } from '@/lib/appwrite/client';

async function requireAdminUser() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function createTeamMemberAction(data: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  await requireAdminUser();
  const member = await createTeamMember(data);
  revalidatePath('/');
  revalidatePath('/admin/team');
  return member;
}

export async function updateTeamMemberAction(id: string, data: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  await requireAdminUser();
  const member = await updateTeamMember(id, data);
  revalidatePath('/');
  revalidatePath('/admin/team');
  return member;
}

export async function deleteTeamMemberAction(id: string): Promise<void> {
  await requireAdminUser();
  await deleteTeamMember(id);
  revalidatePath('/');
  revalidatePath('/admin/team');
}

export async function uploadTeamImagesAction(formData: FormData): Promise<{ src: string; alt: string }[]> {
  await requireAdminUser();
  const files = formData.getAll('files').filter((f): f is File => f instanceof File);
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!bucketId || !endpoint || !projectId) throw new Error('Appwrite storage config is missing');
  const { storage } = await createAdminClient();
  return Promise.all(files.map(async (file) => {
    const buf = await file.arrayBuffer();
    const uploaded = await storage.createFile({ bucketId, fileId: ID.unique(), file: InputFile.fromBuffer(Buffer.from(buf), file.name) });
    return { src: `${endpoint}/storage/buckets/${bucketId}/files/${uploaded.$id}/view?project=${projectId}`, alt: file.name };
  }));
}
