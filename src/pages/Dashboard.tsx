import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircle,
  Images,
  Settings,
  LogOut,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ProfileEditor from './dashboard/ProfileEditor';
import WorksManager from './dashboard/WorksManager';
import AccountSettings from './dashboard/AccountSettings';

type Tab = 'profile' | 'works' | 'account';

const menu: Array<{ key: Tab; label: string; icon: typeof UserCircle }> = [
  { key: 'profile', label: '个人资料', icon: UserCircle },
  { key: 'works', label: '作品管理', icon: Images },
  { key: 'account', label: '账号设置', icon: Settings },
];

export default function Dashboard() {
  const { user, member, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* 侧边栏 */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              {member?.avatar ? (
                <img
                  src={member.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-black">
                  {(member?.name || user?.displayName || '?').slice(0, 1)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-bold">{member?.name || user?.displayName}</p>
                <p className="truncate text-xs text-gray-500">
                  {member?.batch ?? '—'}届 · {member?.role || '部员'}
                </p>
              </div>
            </div>

            <nav className="flex gap-1 lg:flex-col">
              {menu.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex flex-1 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    tab === key
                      ? 'bg-gradient-to-r from-blue-400/20 to-purple-500/20 text-white ring-1 ring-white/15'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex flex-1 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-rose-300/80 transition-all hover:bg-rose-500/10 hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </nav>

            {user && (
              <Link
                to={`/member/${user.uid}`}
                className="mt-4 hidden items-center justify-center gap-1.5 rounded-2xl border border-white/10 py-2 text-xs font-semibold text-gray-400 transition-colors hover:text-white lg:flex"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                查看我的公开主页
              </Link>
            )}
          </div>
        </aside>

        {/* 内容区 */}
        <motion.section
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
              <Loader2 className="h-7 w-7 animate-spin text-neon-blue" />
            </div>
          ) : (
            <>
              {tab === 'profile' && <ProfileEditor />}
              {tab === 'works' && <WorksManager />}
              {tab === 'account' && <AccountSettings />}
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}
