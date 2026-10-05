import { supabase, isSupabaseEnabled } from './client';
import {
  demoGetMembers,
  demoGetMember,
  demoGetWorks,
  demoCreateWork,
  demoUpdateWork,
  demoDeleteWork,
  demoUpdateMember,
} from '../lib/demoStore';
import type { Member, Work, WorkType } from '../types/member';

/* ---------------- 行数据 ↔ 前端类型 映射 ---------------- */

interface MemberRow {
  id: string;
  name: string;
  avatar: string | null;
  batch: number;
  role: string | null;
  bio: string | null;
  description: string | null;
  tags: string[] | null;
  social_links: { platform: string; url: string }[] | null;
  background_image: string | null;
  email: string | null;
  created_at: string;
}

interface WorkRow {
  id: string;
  member_id: string;
  title: string;
  type: WorkType;
  image_url: string;
  description: string | null;
  created_at: string;
  members?: { name: string | null; batch: number | null } | null;
}

function mapMember(row: MemberRow): Member {
  return {
    uid: row.id,
    name: row.name,
    avatar: row.avatar ?? '',
    batch: row.batch,
    role: row.role ?? '部员',
    bio: row.bio ?? '',
    description: row.description ?? '',
    tags: row.tags ?? [],
    socialLinks: row.social_links ?? [],
    joinDate: row.created_at,
    backgroundImage: row.background_image ?? '',
    email: row.email ?? undefined,
  };
}

function mapWork(row: WorkRow): Work {
  return {
    id: row.id,
    memberId: row.member_id,
    title: row.title,
    type: row.type,
    imageUrl: row.image_url,
    description: row.description ?? '',
    createdAt: row.created_at,
    memberName: row.members?.name ?? undefined,
    memberBatch: row.members?.batch ?? undefined,
  };
}

function memberPatchToRow(patch: Partial<Member>): Record<string, unknown> {
  const map: Record<string, keyof Member> = {
    name: 'name',
    avatar: 'avatar',
    batch: 'batch',
    role: 'role',
    bio: 'bio',
    description: 'description',
    tags: 'tags',
    social_links: 'socialLinks',
    background_image: 'backgroundImage',
    email: 'email',
  };
  const row: Record<string, unknown> = {};
  for (const [rowKey, appKey] of Object.entries(map)) {
    if (patch[appKey] !== undefined) row[rowKey] = patch[appKey];
  }
  return row;
}

function errMsg(e: unknown, fallback: string): Error {
  if (e && typeof e === 'object' && 'message' in e) {
    return new Error(String((e as { message: unknown }).message) || fallback);
  }
  return new Error(fallback);
}

/* ---------------- 一次性读取（写操作/兼容用） ---------------- */

export async function fetchMembers(): Promise<Member[]> {
  if (!isSupabaseEnabled || !supabase) return demoGetMembers();
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('batch', { ascending: false })
    .order('created_at', { ascending: true });
  if (error) throw errMsg(error, '成员列表加载失败');
  return (data as MemberRow[]).map(mapMember);
}

export async function fetchMember(uid: string): Promise<Member | null> {
  if (!isSupabaseEnabled || !supabase) return demoGetMember(uid);
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', uid)
    .maybeSingle();
  if (error) throw errMsg(error, '成员信息加载失败');
  return data ? mapMember(data as MemberRow) : null;
}

export async function saveMember(uid: string, patch: Partial<Member>): Promise<void> {
  if (!isSupabaseEnabled || !supabase) return demoUpdateMember(uid, patch);
  const { error } = await supabase
    .from('members')
    .update(memberPatchToRow(patch))
    .eq('id', uid);
  if (error) throw errMsg(error, '资料保存失败');
}

export async function fetchMemberWorks(memberId: string): Promise<Work[]> {
  if (!isSupabaseEnabled || !supabase) return demoGetWorks(memberId);
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false });
  if (error) throw errMsg(error, '作品加载失败');
  return (data as WorkRow[]).map(mapWork);
}

export async function fetchAllWorks(): Promise<Work[]> {
  if (!isSupabaseEnabled || !supabase) return demoGetWorks();
  const { data, error } = await supabase
    .from('works')
    .select('*, members(name, batch)')
    .order('created_at', { ascending: false });
  if (error) throw errMsg(error, '作品加载失败');
  return (data as WorkRow[]).map(mapWork);
}

export async function createMemberWork(
  memberId: string,
  data: Omit<Work, 'id' | 'memberId' | 'createdAt'>
): Promise<Work> {
  if (!isSupabaseEnabled || !supabase) return demoCreateWork(memberId, data);
  const { data: row, error } = await supabase
    .from('works')
    .insert({
      member_id: memberId,
      title: data.title,
      type: data.type,
      image_url: data.imageUrl,
      description: data.description,
    })
    .select('*, members(name, batch)')
    .single();
  if (error) throw errMsg(error, '作品发布失败');
  return mapWork(row as WorkRow);
}

export async function updateMemberWork(
  memberId: string,
  workId: string,
  patch: Partial<Work>
): Promise<void> {
  if (!isSupabaseEnabled || !supabase) return demoUpdateWork(memberId, workId, patch);
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.type !== undefined) row.type = patch.type;
  if (patch.imageUrl !== undefined) row.image_url = patch.imageUrl;
  if (patch.description !== undefined) row.description = patch.description;
  const { error } = await supabase
    .from('works')
    .update(row)
    .eq('id', workId)
    .eq('member_id', memberId);
  if (error) throw errMsg(error, '作品更新失败');
}

export async function deleteMemberWork(memberId: string, workId: string): Promise<void> {
  if (!isSupabaseEnabled || !supabase) return demoDeleteWork(memberId, workId);
  const { error } = await supabase
    .from('works')
    .delete()
    .eq('id', workId)
    .eq('member_id', memberId);
  if (error) throw errMsg(error, '作品删除失败');
}

/* ---------------- 数据订阅（初始加载 + 30 秒轮询） ---------------- */

type Unsub = () => void;

const POLL_INTERVAL = 30_000;

/**
 * 通用轮询订阅器：先立即执行一次 fetch，再每隔 interval 毫秒重新拉取。
 * 用轮询替代 Supabase Realtime 订阅，避免 React StrictMode 下
 * 同名 channel 重复订阅导致的 "cannot add postgres_changes callbacks" 报错。
 */
function poll<T>(
  fetcher: () => Promise<T>,
  onChange: (v: T) => void,
  onError: (e: Error) => void,
  interval = POLL_INTERVAL
): Unsub {
  let cancelled = false;
  const run = () => {
    if (cancelled) return;
    fetcher().then(onChange).catch(onError);
  };
  run();
  const timer = setInterval(run, interval);
  return () => {
    cancelled = true;
    clearInterval(timer);
  };
}

/** Demo 模式下只取一次数据，不轮询（本地数据无需轮询） */
function demoOneShot<T>(fetcher: () => Promise<T>, onChange: (v: T) => void): Unsub {
  fetcher().then(onChange).catch(() => onChange([] as unknown as T));
  return () => undefined;
}

export function subscribeMembers(
  onChange: (members: Member[]) => void,
  onError: (e: Error) => void
): Unsub {
  if (!isSupabaseEnabled || !supabase) return demoOneShot(fetchMembers, onChange);
  return poll(fetchMembers, onChange, onError);
}

export function subscribeMember(
  uid: string,
  onChange: (member: Member | null) => void,
  onError: (e: Error) => void
): Unsub {
  if (!isSupabaseEnabled || !supabase) return demoOneShot(() => fetchMember(uid), onChange);
  return poll(() => fetchMember(uid), onChange, onError);
}

export function subscribeMemberWorks(
  memberId: string,
  onChange: (works: Work[]) => void,
  onError: (e: Error) => void
): Unsub {
  if (!isSupabaseEnabled || !supabase) return demoOneShot(() => fetchMemberWorks(memberId), onChange);
  return poll(() => fetchMemberWorks(memberId), onChange, onError);
}

export function subscribeAllWorks(
  onChange: (works: Work[]) => void,
  onError: (e: Error) => void
): Unsub {
  if (!isSupabaseEnabled || !supabase) return demoOneShot(fetchAllWorks, onChange);
  return poll(fetchAllWorks, onChange, onError);
}
