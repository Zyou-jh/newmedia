import { useState, type FormEvent } from 'react';
import { Loader2, Save, Mail, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { changeEmailAndSync, changePassword, friendlyAuthError } from '../../supabase/auth';
import { useToast } from '../../components/Toast';

const inputCls =
  'w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20';

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast('请输入正确的邮箱地址', 'error');
      return;
    }
    setSavingEmail(true);
    try {
      if (!user) return;
      await changeEmailAndSync(email, user.uid);
      toast('邮箱已更新', 'success');
    } catch (err) {
      toast(friendlyAuthError(err), 'error');
    } finally {
      setSavingEmail(false);
    }
  }

  async function handlePassword(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast('新密码至少 6 位', 'error');
      return;
    }
    setSavingPwd(true);
    try {
      await changePassword(password);
      setPassword('');
      toast('密码已修改', 'success');
    } catch (err) {
      toast(friendlyAuthError(err), 'error');
    } finally {
      setSavingPwd(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
        <h2 className="text-2xl font-black tracking-tight">账号设置</h2>
        <p className="mt-1 text-sm text-gray-400">管理你的登录凭据</p>
      </div>

      <form
        onSubmit={handleEmail}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8"
      >
        <h3 className="mb-1 text-lg font-bold">修改邮箱</h3>
        <p className="mb-5 text-sm text-gray-400">用于登录和接收组织通知</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={savingEmail}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
          >
            {savingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            保存邮箱
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePassword}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8"
      >
        <h3 className="mb-1 text-lg font-bold">修改密码</h3>
        <p className="mb-5 text-sm text-gray-400">至少 6 位，建议字母与数字组合</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入新密码"
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={savingPwd}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
          >
            {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            修改密码
          </button>
        </div>
      </form>

      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8">
        <h3 className="mb-1 text-lg font-bold text-rose-200">退出登录</h3>
        <p className="mb-5 text-sm text-gray-400">退出后需要重新登录才能管理资料与作品</p>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-rose-400 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          退出当前账号
        </button>
      </div>
    </div>
  );
}
