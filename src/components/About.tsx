import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMembers } from '../hooks/useMembers';
import { useAllWorks } from '../hooks/useAllWorks';

export default function About() {
  const { members } = useMembers();
  const { works } = useAllWorks();

  const batchCount = new Set(members.map((m) => m.batch)).size;

  const stats = [
    { value: batchCount, label: '届部员传承' },
    { value: members.length, label: '位成员同行' },
    { value: works.length, label: '件作品沉淀' },
  ];

  return (
    <section id="about" className="relative overflow-hidden py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              关于新媒
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]">
              设计不只是看起来怎样，
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                而是让人感受到什么。
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex flex-col gap-8"
          >
            <p className="text-lg font-light leading-relaxed text-gray-300">
              创客新媒是一群相信「内容有力量」的学生组成的新媒体组织。我们用镜头记录校园，用设计表达态度，用文字传递温度。
            </p>
            <p className="font-light leading-relaxed text-gray-400">
              无论你擅长摄影、剪辑、设计、写作，还是只有一腔还没找到出口的表达欲 ——
              这里都有你的位置。每一届成员来了又走，作品留在墙上，故事继续发生。
            </p>

            <div className="mt-2 flex flex-wrap gap-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-black tracking-tight tabular-nums">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
            >
              加入我们
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
