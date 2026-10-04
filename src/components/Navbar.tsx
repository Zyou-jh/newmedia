import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const links = [
  { label: '首页', to: '/' },
  { label: '星光墙', to: '/starwall' },
  { label: '作品墙', to: '/gallery' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, member, logout } = useAuth();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.08)']
  );
  const backdropFilter = useTransform(scrollY, [0, 50], ['blur(8px)', 'blur(24px)']);
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 10));

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <motion.header
      style={{ backgroundColor, backdropFilter }}
      className={`fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 border border-white/10 transition-[border-radius] duration-300 ${
        open ? 'rounded-3xl' : 'rounded-full'
      } ${scrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : ''}`}
    >
      <nav aria-label="Primary" className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
          <span className="text-lg font-extrabold tracking-tight">创客新媒</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `group relative text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              to="/login"
              className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 md:inline-flex"
            >
              登录
            </Link>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="用户菜单"
                aria-expanded={menuOpen}
                className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition-colors hover:bg-white/10"
              >
                {member?.avatar ? (
                  <img
                    src={member.avatar}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold">
                    {(member?.name || user.displayName || '?').slice(0, 1)}
                  </span>
                )}
                <span className="max-w-24 truncate text-sm font-medium">
                  {member?.name || user.displayName || '我的账户'}
                </span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#121833]/95 py-1.5 shadow-2xl backdrop-blur-xl"
                    >
                      <Link
                        to={`/member/${user.uid}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <UserIcon className="h-4 w-4" />
                        我的主页
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        个人中心
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <LogOut className="h-4 w-4" />
                        退出登录
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 px-6 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-4">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="block text-base font-medium text-gray-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                {user ? (
                  <div className="flex gap-3 pt-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-black"
                    >
                      个人中心
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold"
                    >
                      退出
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-black"
                    >
                      登录
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-center text-sm font-semibold"
                    >
                      加入我们
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
