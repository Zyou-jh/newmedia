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
import { subscribeMember } from '../supabase/database';
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
      login: loginWithEmail,
      register: registerWithEmail,
      logout: logoutAuth,
      // 实时监听已自动同步，此函数保留用于兼容调用方
      refreshMember: async () => undefined,
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
