import { motion } from 'framer-motion';
import {
  Rocket,
  Cpu,
  Users,
} from 'lucide-react';

const partners = [
  { icon: Rocket, name: '创客梦工场' },
  { icon: Cpu, name: '创客科创部' },
  { icon: Users, name: '创客组织部' },
];

export default function Clients() {
  const row = [...partners, ...partners];

  return (
    <section id="partners" className="relative py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-300">
            合作伙伴
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-300">
            与校园里{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              最有活力的组织
            </span>{' '}
            一起创作
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0c1128] to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0c1128] to-transparent"
          />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
            className="flex w-max items-center gap-16 pr-16"
          >
            {row.map(({ icon: Icon, name }, i) => (
              <div
                key={`${name}-${i}`}
                className="flex items-center gap-3 text-gray-400 transition-colors hover:text-white"
              >
                <Icon className="h-6 w-6" aria-hidden />
                <span className="whitespace-nowrap text-lg font-semibold tracking-wide">
                  {name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
