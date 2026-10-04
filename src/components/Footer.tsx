import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const navLinks = [
  { label: '首页', to: '/' },
  { label: '星光墙', to: '/starwall' },
  { label: '作品墙', to: '/gallery' },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1]">
            有创意，
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              就来新媒
            </span>
          </h2>
          <div className="mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              加入我们
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
                <span className="text-lg font-extrabold tracking-tight">创客新媒</span>
              </div>
              <p className="max-w-xs text-sm font-light leading-relaxed text-gray-400">
                学生新媒体组织。Create · Media · Beyond —— 用影像、文字与设计，记录正在发生的校园。
              </p>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                品牌介绍
              </p>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="#about" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                    关于新媒
                  </a>
                </li>
                <li>
                  <a href="#beliefs" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                    组织理念
                  </a>
                </li>
                <li>
                  <a href="#featured" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                    精选作品
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                快速链接
              </p>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/register" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                    加入组织
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} 创客新媒 学生新媒体组织 · 保留所有权利</p>
        </div>
      </div>
    </footer>
  );
}
