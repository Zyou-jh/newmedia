import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WORK_TYPE_LABEL, type Work } from '../types/member';

interface LightboxProps {
  work: Work | null;
  onClose: () => void;
}

export default function Lightbox({ work, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (work) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [work, onClose]);

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={work.title}
        >
          <button
            aria-label="关闭"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.figure
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="max-h-full w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c1128]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={work.imageUrl}
              alt={work.title}
              className="max-h-[70vh] w-full object-contain bg-black"
            />
            <figcaption className="flex flex-col gap-2 p-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-1 inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-neon-blue">
                  {WORK_TYPE_LABEL[work.type]}
                </span>
                <h3 className="text-xl font-bold text-white">{work.title}</h3>
                {work.description && (
                  <p className="mt-1 max-w-xl text-sm font-light leading-relaxed text-gray-400">
                    {work.description}
                  </p>
                )}
              </div>
              {work.memberName && (
                <Link
                  to={`/member/${work.memberId}`}
                  onClick={onClose}
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gray-300 transition-colors hover:text-white"
                >
                  <User className="h-4 w-4" />
                  {work.memberName}
                </Link>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
