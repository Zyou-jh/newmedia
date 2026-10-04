import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, Lock, AlertCircle } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../hooks/useAuth';
import { friendlyAuthError } from '../supabase/auth';

const BATCH_OPTIONS = [2026, 2025];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [batch, setBatch] = useState(BATCH_OPTIONS[0]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) {
      setError('请输入至少 2 个字符的姓名');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入正确的邮箱地址');
      return;
    }
    if (password.length < 6) {
      setError('密码至少 6 位');
      return;
    }
    if (password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    setSubmitting(true);
    try {
      await register(name.trim(), email, password, batch);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    'w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20';

  return (
    <AuthShell
      title="加入创客新媒"
      subtitle="创建账号，点亮你的那颗星"
      footer={
        <>
          已有账号？{' '}
          <Link to="/login" className="font-semibold text-neon-blue hover:underline">
            去登录
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
            姓名 / 昵称
          </span>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="你想被大家怎么称呼"
              autoComplete="name"
              className={inputCls}
            />
          </div>
        </label>

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
              className={inputCls}
            />
          </div>
        </label>

        <div className="grid grid-cols-2 gap-3">
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
                autoComplete="new-password"
                className={inputCls}
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
              确认密码
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再输一次"
                autoComplete="new-password"
                className={inputCls}
              />
            </div>
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
            所属届别
          </span>
          <select
            value={batch}
            onChange={(e) => setBatch(Number(e.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-400/50 focus:outline-none [&>option]:bg-[#121833]"
          >
            {BATCH_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b} 届
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 py-3 text-sm font-bold text-midnight transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(0,240,255,0.35)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          注册并加入
        </button>
      </form>
    </AuthShell>
  );
}
