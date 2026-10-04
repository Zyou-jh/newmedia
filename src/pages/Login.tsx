import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../hooks/useAuth';
import { friendlyAuthError } from '../supabase/auth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入正确的邮箱地址');
      return;
    }
    if (password.length < 6) {
      setError('密码至少 6 位');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="欢迎回来"
      subtitle="登录你的创客新媒账号"
      footer={
        <>
          还没有账号？{' '}
          <Link to="/register" className="font-semibold text-neon-blue hover:underline">
            立即加入
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && (
          <p className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
            邮箱
          </span>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
            密码
          </span>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 py-3 text-sm font-bold text-midnight transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(0,240,255,0.35)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          登录
        </button>
      </form>
    </AuthShell>
  );
}
