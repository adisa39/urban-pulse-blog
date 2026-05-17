import { supabase, STORAGE_BUCKET_NAME } from '@/lib/supabase';

export interface UploadedImage {
  url: string;
  path: string;
}

export async function uploadImage(
  file: File
): Promise<UploadedImage> {
  const ext = file.name.split('.').pop();

  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const path = `posts/${fileName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET_NAME!)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET_NAME!)
    .getPublicUrl(path);

  return {
    url: data.publicUrl,
    path,
  };
}

export async function deleteImage(path?: string | null) {
  if (!path) return;

  await supabase.storage
    .from(STORAGE_BUCKET_NAME!)
    .remove([path]);
}