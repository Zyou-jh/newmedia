import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  subscribeAuth,
  loginWithEmail,
  registerWithEmail,
  logoutAuth,
  type AppUser,
} from '../supabase/auth';
import { subscribeMember, fetchMember } from '../supabase/database';
import type { Member } from '../types/member';

interface AuthContextValue {
  user: AppUser | null;
  member: Member | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  register: (
    name: string,
    email: string,
    password: string,
    batch: number
  ) => Promise<AppUser>;
  logout: () => Promise<void>;
  refreshMember: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const unsub = subscribeAuth(
      (u) => {
        if (mounted) setUser(u);
      },
      () => {
        if (mounted) setLoading(false);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setMember(null);
      return;
    }
    const unsub = subscribeMember(user.uid, (m) => setMember(m), () => undefined);
    return unsub;
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      member,
      loading,
      // 包装后手动更新 state：Demo 模式下 subscribeAuth 没有持续监听
      login: async (email: string, password: string) => {
        const u = await loginWithEmail(email, password);
        setUser(u);
        return u;
      },
      register: async (name: string, email: string, password: string, batch: number) => {
        const u = await registerWithEmail(name, email, password, batch);
        setUser(u);
        return u;
      },
      logout: async () => {
        await logoutAuth();
        setUser(null);
        setMember(null);
      },
      refreshMember: async () => {
        if (!user) return;
        try {
          const m = await fetchMember(user.uid);
          if (m) setMember(m);
        } catch {
          // 忽略刷新失败
        }
      },
    }),
    [user, member, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext 必须在 AuthProvider 内使用');
  return ctx;
}
