import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User, Calendar, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WORK_TYPE_LABEL, type Work } from '../../types/member';

interface MagazineWorkDetailProps {
  work: Work | null;
  onClose: () => void;
}

export default function MagazineWorkDetail({ work, onClose }: MagazineWorkDetailProps) {
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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] overflow-y-auto bg-paper/95 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={work.title}
        >
          {/* 关闭按钮 */}
          <button
            aria-label="关闭"
            onClick={onClose}
            className="fixed top-6 right-6 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink/90 text-paper shadow-lg transition-colors hover:bg-accent-orange"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ========== 顶部标签行 ========== */}
            <div className="mb-6 flex items-start justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper-card px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                <Camera className="h-3 w-3" />
                {WORK_TYPE_LABEL[work.type]}
              </span>
              {work.memberName && (
                <Link
                  to={`/member/${work.memberId}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-ink-muted transition-colors hover:text-accent-orange"
                >
                  <User className="h-3 w-3" />
                  {work.memberName}
                  {work.memberBatch && (
                    <span className="ml-1">· {work.memberBatch}届</span>
                  )}
                </Link>
              )}
            </div>

            {/* ========== 大标题 ========== */}
            <h2 className="mb-8 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.1] tracking-tight text-ink">
              {work.title}
            </h2>

            {/* ========== 大图展示 ========== */}
            <figure className="relative mb-10 overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
              <img
                src={work.imageUrl}
                alt={work.title}
                className="w-full object-contain"
                loading="eager"
              />
              {/* 像胶带一样的角装饰 */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-5 w-16 rotate-[-2deg] rounded-sm bg-paper-card/80 shadow-sm" />
            </figure>

            {/* ========== 正文描述 ========== */}
            {work.description && (
              <div className="prose-magazine mx-auto max-w-2xl">
                <p className="text-[15px] leading-[1.85] text-ink-soft">
                  {work.description}
                </p>
              </div>
            )}

            {/* ========== 底部信息卡 ========== */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-paper-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper">
                  <Camera className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {WORK_TYPE_LABEL[work.type]}
                  </p>
                  <p className="text-sm font-bold text-ink">{work.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(work.createdAt).getFullYear()} 年{' '}
                  {new Date(work.createdAt).getMonth() + 1} 月
                </span>
              </div>
              {work.memberName && (
                <Link
                  to={`/member/${work.memberId}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper transition-colors hover:bg-accent-orange"
                >
                  <User className="h-3.5 w-3.5" />
                  查看作者主页
                </Link>
              )}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
