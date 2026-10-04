import { supabase, isSupabaseEnabled } from './client';
import { fileToDataURL } from '../lib/demoStore';

/**
 * 上传文件。path 形如 "avatars/{uid}/avatar.jpg"，
 * 首段为 bucket 名，其余为 bucket 内路径。
 * Demo 模式直接转成 data URL 存 localStorage。
 */
export async function uploadImage(path: string, file: File): Promise<string> {
  if (!isSupabaseEnabled || !supabase) return fileToDataURL(file);

  const { bucket, filePath } = parsePath(path);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });
  if (error) throw new Error(error.message || '上传失败');

  return getPublicUrl(path);
}

/** 获取文件公开访问 URL */
export function getPublicUrl(path: string): string {
  if (!isSupabaseEnabled || !supabase) return path;
  const { bucket, filePath } = parsePath(path);
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/** 删除文件 */
export async function deleteFile(path: string): Promise<void> {
  if (!isSupabaseEnabled || !supabase) return;
  const { bucket, filePath } = parsePath(path);
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw new Error(error.message || '删除失败');
}

function parsePath(path: string): { bucket: string; filePath: string } {
  const [bucket, ...rest] = path.split('/');
  return { bucket, filePath: rest.join('/') };
}

export function avatarPath(uid: string) {
  return `avatars/${uid}/avatar.jpg`;
}

export function backgroundPath(uid: string) {
  return `backgrounds/${uid}/bg.jpg`;
}

export function workImagePath(uid: string, workId: string) {
  return `works/${uid}/${workId}.jpg`;
}
