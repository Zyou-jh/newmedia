import { motion } from 'framer-motion';
import { Sparkles, Camera, Link2, MessageSquare, ArrowUpRight } from 'lucide-react';

const beliefs = [
  {
    icon: Sparkles,
    title: '创造',
    description:
      '不满足于记录，我们动手做新的东西 —— 从一张海报到一支短片，创意是组织的母语。',
  },
  {
    icon: Camera,
    title: '影像',
    description:
      '摄影、视频、设计，我们相信视觉是这个时代最真诚的表达，也是最响亮的发声。',
  },
  {
    icon: Link2,
    title: '连接',
    description:
      '连接有趣的人与正在发生的事，把分散在校园角落的光，汇聚成同一片星空。',
  },
  {
    icon: MessageSquare,
    title: '表达',
    description:
      '每个人都有值得被听见的想法。新媒提供舞台、设备和伙伴，让表达不再孤单。',
  },
];

export default function Services() {
  return (
    <section id="beliefs" className="py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-2xl"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            组织理念
          </p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            我们相信
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              创造的力量
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {beliefs.map(({ icon: Icon, title, description }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-300 hover:border-white/20"
            >
              <div
                aria-hidden
                className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-500/10 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="relative">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Icon className="h-6 w-6 text-neon-blue" aria-hidden />
                </div>
                <h3 className="mb-3 text-2xl font-bold tracking-tight">{title}</h3>
                <p className="font-light leading-relaxed text-gray-400">
                  {description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                  0{i + 1}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
