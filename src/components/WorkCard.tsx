import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { WORK_TYPE_LABEL, type Work } from '../types/member';

interface WorkCardProps {
  work: Work;
  index?: number;
  onClick?: (work: Work) => void;
  showAuthor?: boolean;
}

export default function WorkCard({
  work,
  index = 0,
  onClick,
  showAuthor = true,
}: WorkCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      onClick={() => onClick?.(work)}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-3xl border border-white/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <img
        src={work.imageUrl}
        alt={work.title}
        loading="lazy"
        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {work.type === 'video' && (
        <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
          <Play className="h-3 w-3 fill-white" />
          视频
        </span>
      )}

      <span className="absolute top-4 right-4 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-semibold text-gray-200 backdrop-blur-md">
        {WORK_TYPE_LABEL[work.type]}
      </span>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="text-base font-bold leading-snug text-white">
          {work.title}
        </h3>
        {showAuthor && work.memberName && (
          <p className="mt-1 text-xs font-medium text-gray-300">
            {work.memberName}
            {work.memberBatch ? ` · ${work.memberBatch}届` : ''}
          </p>
        )}
      </div>
    </motion.button>
  );
}
