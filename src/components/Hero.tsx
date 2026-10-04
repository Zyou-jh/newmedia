import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import StarBackground from './StarBackground';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['circle(0% at 50% 50%)', 'circle(150% at 50% 50%)']
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 底层星空 + 主标题 */}
        <motion.div style={{ scale }} className="absolute inset-0">
          <StarBackground density={1} />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-transparent to-midnight" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-gray-400">
            Create · Media · Beyond
          </p>
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.05]">
            <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              创客新媒
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-gray-400 sm:text-lg">
            学生新媒体组织 · 用影像、文字与设计，记录正在发生的校园
          </p>
        </div>

        {/* 揭示层：霓虹渐变星空 */}
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 will-change-[clip-path]"
        >
          <motion.div style={{ scale }} className="absolute inset-0">
            <StarBackground density={1.6} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(176,38,255,0.22),transparent_55%),radial-gradient(ellipse_at_30%_70%,rgba(0,240,255,0.18),transparent_50%)]" />
            <div className="absolute inset-0 bg-midnight/30" />
          </motion.div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gray-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-neon-blue" />
              Create · Media · Beyond
            </span>
            <p className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.05]">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
                创客新媒
              </span>
            </p>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-gray-200 sm:text-lg">
              让每一份创意，都被看见
            </p>
            <Link
              to="/starwall"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-black shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              进入星光墙
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Link>
          </div>
        </motion.div>

        {/* 滚动提示 */}
        <motion.a
          href="#partners"
          aria-label="向下滚动"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
          >
            <ChevronDown className="h-5 w-5 text-gray-300" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}
