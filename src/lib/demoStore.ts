import type { Member, Work } from '../types/member';

// Demo 模式下的本地「数据库」，键值集中管理
// v4：再次清空示例数据，使 v3 的演示数据缓存自动失效
const K_USERS = 'ckxm_demo_users_v4';
const K_MEMBERS = 'ckxm_demo_members_v4';
const K_WORKS = 'ckxm_demo_works_v4';

export interface DemoUser {
  uid: string;
  email: string;
  password: string;
  name: string;
  batch: number;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeed() {
  // 初始为空：部员与作品均由注册 / 个人中心录入，或由 Supabase 提供
  if (!localStorage.getItem(K_MEMBERS)) write(K_MEMBERS, []);
  if (!localStorage.getItem(K_WORKS)) write(K_WORKS, []);
  if (!localStorage.getItem(K_USERS)) write(K_USERS, []);
}

/* ---------- Auth ---------- */

export async function demoRegister(
  name: string,
  email: string,
  password: string,
  batch: number
): Promise<DemoUser> {
  ensureSeed();
  const users = read<DemoUser[]>(K_USERS, []);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('该邮箱已被注册');
  }
  const uid = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user: DemoUser = { uid, email, password, name, batch };
  users.push(user);
  write(K_USERS, users);

  const members = read<Member[]>(K_MEMBERS, []);
  members.push({
    uid,
    name,
    avatar: '',
    batch,
    role: '部员',
    bio: '',
    description: '',
    tags: [],
    socialLinks: [],
    joinDate: new Date().toISOString(),
    backgroundImage: '',
    email,
  });
  write(K_MEMBERS, members);
  return user;
}

export async function demoLogin(
  email: string,
  password: string
): Promise<DemoUser> {
  ensureSeed();
  const users = read<DemoUser[]>(K_USERS, []);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error('邮箱或密码错误');
  return user;
}

/* ---------- Members ---------- */

export async function demoUpdateUserEmail(uid: string, newEmail: string): Promise<void> {
  const users = read<DemoUser[]>(K_USERS, []);
  const idx = users.findIndex((u) => u.uid === uid);
  if (idx !== -1) {
    users[idx] = { ...users[idx], email: newEmail };
    write(K_USERS, users);
  }
}

export async function demoGetMembers(): Promise<Member[]> {
  ensureSeed();
  return read<Member[]>(K_MEMBERS, []);
}

export async function demoGetMember(uid: string): Promise<Member | null> {
  ensureSeed();
  return read<Member[]>(K_MEMBERS, []).find((m) => m.uid === uid) ?? null;
}

export async function demoUpdateMember(
  uid: string,
  patch: Partial<Member>
): Promise<void> {
  const members = read<Member[]>(K_MEMBERS, []);
  const idx = members.findIndex((m) => m.uid === uid);
  if (idx === -1) throw new Error('成员不存在');
  members[idx] = { ...members[idx], ...patch, uid };
  write(K_MEMBERS, members);
}

/* ---------- Works ---------- */

export async function demoGetWorks(memberId?: string): Promise<Work[]> {
  ensureSeed();
  const works = read<Work[]>(K_WORKS, []);
  return (memberId ? works.filter((w) => w.memberId === memberId) : works).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export async function demoCreateWork(
  memberId: string,
  data: Omit<Work, 'id' | 'memberId' | 'createdAt'> &
    Partial<Pick<Work, 'createdAt'>>
): Promise<Work> {
  const works = read<Work[]>(K_WORKS, []);
  const member = read<Member[]>(K_MEMBERS, []).find((m) => m.uid === memberId);
  const work: Work = {
    ...data,
    id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    memberId,
    memberName: member?.name,
    memberBatch: member?.batch,
    createdAt: data.createdAt ?? new Date().toISOString(),
  };
  works.push(work);
  write(K_WORKS, works);
  return work;
}

export async function demoUpdateWork(
  memberId: string,
  workId: string,
  patch: Partial<Work>
): Promise<void> {
  const works = read<Work[]>(K_WORKS, []);
  const idx = works.findIndex((w) => w.id === workId && w.memberId === memberId);
  if (idx === -1) throw new Error('作品不存在');
  works[idx] = { ...works[idx], ...patch, id: workId, memberId };
  write(K_WORKS, works);
}

export async function demoDeleteWork(
  memberId: string,
  workId: string
): Promise<void> {
  const works = read<Work[]>(K_WORKS, []);
  write(
    K_WORKS,
    works.filter((w) => !(w.id === workId && w.memberId === memberId))
  );
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
