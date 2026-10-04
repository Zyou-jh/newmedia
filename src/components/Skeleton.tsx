/**
 * 骨架屏组件 —— 统一的 shimmer 闪光占位。
 * 数据 hooks 加载期间使用，避免布局跳动与白屏。
 */

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} aria-hidden />;
}

/** 文本行骨架 */
export function SkeletonText({
  lines = 2,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

/** 头像骨架 */
export function SkeletonAvatar({ size = 64 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="shimmer shrink-0 rounded-full"
      style={{ width: size, height: size }}
    />
  );
}

/** 部员卡片骨架（星光墙用） */
export function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-4">
        <SkeletonAvatar size={64} />
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <SkeletonText lines={2} className="mt-5" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

/** 作品卡片骨架（作品墙 / 个人主页用） */
export function WorkCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="mb-2 h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

/** 部员个人主页骨架 */
export function MemberProfileSkeleton() {
  return (
    <div>
      <div className="relative flex h-[52vh] min-h-[380px] flex-col items-center justify-end pb-12">
        <Skeleton className="h-28 w-28 rounded-full" />
        <Skeleton className="mt-5 h-9 w-40" />
        <Skeleton className="mt-3 h-4 w-32" />
        <Skeleton className="mt-4 h-4 w-72 max-w-full" />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          <Skeleton className="h-56 rounded-3xl lg:col-span-3" />
          <Skeleton className="h-56 rounded-3xl lg:col-span-2" />
        </div>
        <Skeleton className="mt-10 h-8 w-32" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <WorkCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 向后兼容的别名
export const MemberCardSkeleton = SkeletonCard;
