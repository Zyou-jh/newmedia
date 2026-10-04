import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ImagePlus } from 'lucide-react';
import { useAllWorks } from '../hooks/useAllWorks';
import { WORK_TYPE_LABEL, type Work } from '../types/member';

const SLOT_COUNT = 5;

export default function Work() {
  const { works } = useAllWorks();
  const [active, setActive] = useState(0);

  // 取全部作品的前 5 个；不足 5 个用占位槽补齐，保证画廊布局不坍塌
  const featured = works.slice(0, SLOT_COUNT);
  const slots: Array<Work | null> = [
    ...featured,
    ...Array.from({ length: Math.max(0, SLOT_COUNT - featured.length) }, () => null),
  ];

  return (
    <section id="featured" className="py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              精选作品
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
              星光
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                作品集
              </span>
            </h2>
          </div>
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white"
          >
            查看全部作品
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="flex h-[900px] flex-col gap-3 md:h-[400px] md:flex-row"
        >
          {slots.map((work, i) => {
            if (!work) {
              // 空占位卡片：保持 5 槽位布局
              return (
                <div
                  key={`placeholder-${i}`}
                  aria-label="作品位待填充"
                  className="flex min-h-0 flex-[0.8] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02]"
                >
                  <div className="flex flex-col items-center gap-2 px-4 text-center opacity-60">
                    <ImagePlus className="h-6 w-6 text-gray-500" />
                    <span className="whitespace-nowrap text-xs font-medium text-gray-500 md:hidden">
                      作品位待填充
                    </span>
                    <span className="hidden whitespace-nowrap text-xs font-medium text-gray-500 md:-rotate-90 md:block">
                      作品位待填充
                    </span>
                  </div>
                </div>
              );
            }

            const isActive = active === i;
            return (
              <motion.button
                key={work.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                animate={{ flex: isActive ? 4 : 0.8 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                aria-label={`查看 ${work.title}`}
                className="group relative min-h-0 cursor-pointer overflow-hidden rounded-3xl border border-white/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 transition-colors duration-500 ${
                    isActive ? 'bg-black/40' : 'bg-black/60'
                  }`}
                />

                <span
                  className={`absolute bottom-6 left-6 whitespace-nowrap text-lg font-bold tracking-wide transition-opacity duration-300 md:origin-bottom-left ${
                    isActive ? 'opacity-0' : 'opacity-100'
                  } md:-rotate-90 md:bottom-6 md:left-5`}
                >
                  {work.title}
                </span>

                <div
                  className={`absolute inset-x-0 bottom-0 p-6 transition-all duration-500 ${
                    isActive
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-neon-blue">
                    {WORK_TYPE_LABEL[work.type]}
                    {work.memberName ? ` · ${work.memberName}` : ''}
                  </p>
                  <h3 className="mb-2 text-2xl font-black tracking-tight">
                    {work.title}
                  </h3>
                  {work.description && (
                    <p className="mb-4 hidden max-w-md text-sm font-light leading-relaxed text-gray-300 md:block">
                      {work.description}
                    </p>
                  )}
                  <Link
                    to="/gallery"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black"
                  >
                    前往作品墙
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
