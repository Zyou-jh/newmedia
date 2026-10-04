import { motion } from 'framer-motion';
import { Sparkles, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** 自定义操作区（优先于 actionText/onAction） */
  action?: ReactNode;
  /** 操作按钮文字，配合 onAction 快速生成渐变胶囊按钮 */
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  action,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-200">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm font-light leading-relaxed text-gray-500">
          {description}
        </p>
      )}
      {action ??
        (actionText && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-full bg-gradient-to-r from-blue-400 to-purple-500 px-6 py-2.5 text-sm font-bold text-midnight transition-all hover:scale-105 active:scale-95"
          >
            {actionText}
          </button>
        ))}
    </motion.div>
  );
}
