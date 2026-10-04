import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import StarBackground from './StarBackground';

/** 登录/注册共用的双栏毛玻璃外壳 */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-28">
      <StarBackground density={1} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[140px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl md:grid-cols-2"
      >
        {/* 左侧品牌区 */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-blue-600/20 via-midnight to-purple-700/25 p-10 md:flex">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
            <span className="text-lg font-extrabold tracking-tight">创客新媒</span>
          </Link>
          <div>
            <h2 className="text-4xl font-black leading-tight tracking-tighter">
              让每一份
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                创意都被看见
              </span>
            </h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-gray-400">
              Create · Media · Beyond
              <br />
              登录后即可维护你的个人主页与作品。
            </p>
          </div>
          <p className="text-xs text-gray-600">学生新媒体组织 · 创客新媒</p>
        </div>

        {/* 右侧表单区 */}
        <div className="p-8 sm:p-10">
          <div className="mb-8 md:hidden">
            <Link to="/" className="mb-6 inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
              <span className="text-lg font-extrabold tracking-tight">创客新媒</span>
            </Link>
          </div>
          <h1 className="text-2xl font-black tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm font-light text-gray-400">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-center text-sm text-gray-400">{footer}</div>
        </div>
      </motion.div>
    </div>
  );
}
