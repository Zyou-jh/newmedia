import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseEnabled } from './client';
import {
  demoLogin,
  demoRegister,
  demoGetMember,
  demoUpdateUserEmail,
  type DemoUser,
} from '../lib/demoStore';
import type { Member } from '../types/member';

const DEMO_SESSION_KEY = 'ckxm_demo_session_v4';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export function toAppUser(u: User | DemoUser): AppUser {
  if ('password' in u) {
    return { uid: u.uid, email: u.email, displayName: u.name };
  }
  return { uid: u.id, email: u.email ?? null, displayName: u.user_metadata?.name ?? null };
}

/** 把 Supabase / Demo 的错误信息转成中文提示 */
export function friendlyAuthError(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) {
    const msg = String((e as { message: unknown }).message);
    const map: Array<[RegExp, string]> = [
      [/already registered|already been registered|User already exists/i, '该邮箱已被注册'],
      [/invalid login credentials/i, '邮箱或密码错误'],
      [/invalid email/i, '邮箱格式不正确'],
      [/password.*(short|weak)|should be at least/i, '密码强度不足，至少 6 位'],
      [/email not confirmed/i, '邮箱尚未完成验证，请先点击验证邮件中的链接'],
      [/rate limit|too many requests/i, '尝试次数过多，请稍后再试'],
      [/network|fetch failed|Failed to fetch/i, '网络连接失败，请检查网络'],
      [/Email not confirmed/i, '邮箱未验证'],
    ];
    for (const [re, text] of map) {
      if (re.test(msg)) return text;
    }
    if (msg && !/^[A-Z_]+$/.test(msg)) return msg;
  }
  return '操作失败，请重试';
}

/* ---------------- 认证状态监听 ---------------- */

export function subscribeAuth(
  cb: (user: AppUser | null) => void,
  onReady: () => void
): () => void {
  if (!isSupabaseEnabled || !supabase) {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (raw) {
      try {
        cb(JSON.parse(raw) as AppUser);
      } catch {
        localStorage.removeItem(DEMO_SESSION_KEY);
      }
    }
    onReady();
    return () => undefined;
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
    cb(session?.user ? toAppUser(session.user) : null);
    onReady();
  });
  return () => data.subscription.unsubscribe();
}

/* ---------------- 登录 / 注册 / 登出 ---------------- */

export async function loginWithEmail(email: string, password: string): Promise<AppUser> {
  if (!isSupabaseEnabled || !supabase) {
    const u = await demoLogin(email, password);
    const appUser = toAppUser(u);
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(appUser));
    return appUser;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error(error?.message ?? '登录失败');
  return toAppUser(data.user);
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
  batch: number
): Promise<AppUser> {
  if (!isSupabaseEnabled || !supabase) {
    const u = await demoRegister(name, email, password, batch);
    const appUser = toAppUser(u);
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(appUser));
    return appUser;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, batch } },
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('注册失败，请重试');

  // 正常情况下 members 行由数据库触发器（handle_new_user）自动创建。
  // 这里再做一次幂等兜底：触发器未部署时仍能建档。
  if (data.session) {
    try {
      await supabase
        .from('members')
        .upsert(
          {
            id: data.user.id,
            name,
            batch,
            role: '部员',
            email,
            tags: [],
            social_links: [],
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );
    } catch {
      // 兜底失败不阻断注册流程（触发器通常已经建档）
    }
  } else {
    // 开启了「邮箱确认」时没有会话，无法自动登录
    throw new Error(
      '注册成功，但该项目开启了邮箱验证。请先查收验证邮件，或在 Supabase 控制台关闭 Email 确认后再登录'
    );
  }

  return toAppUser(data.user);
}

export async function logoutAuth(): Promise<void> {
  if (!isSupabaseEnabled || !supabase) {
    localStorage.removeItem(DEMO_SESSION_KEY);
    return;
  }
  await supabase.auth.signOut();
}

/* ---------------- 邮箱 / 密码修改 ---------------- */

export async function changeEmail(newEmail: string): Promise<void> {
  if (!isSupabaseEnabled || !supabase) {
    const session = localStorage.getItem(DEMO_SESSION_KEY);
    if (session) {
      const u = JSON.parse(session) as AppUser;
      u.email = newEmail;
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(u));
    }
    return;
  }
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw new Error(error.message);
}

export async function changeEmailAndSync(newEmail: string, uid: string): Promise<void> {
  await changeEmail(newEmail);
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from('members')
      .update({ email: newEmail })
      .eq('id', uid);
    if (error) throw new Error(error.message);
  } else {
    await demoUpdateUserEmail(uid, newEmail);
  }
}

export async function changePassword(newPassword: string): Promise<void> {
  if (!isSupabaseEnabled || !supabase) return;
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export async function getCurrentMember(uid: string): Promise<Member | null> {
  if (!isSupabaseEnabled) return demoGetMember(uid);
  const { fetchMember } = await import('./database');
  return fetchMember(uid);
}
