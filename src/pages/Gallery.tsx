import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Images, Loader2 } from 'lucide-react';
import { useAllWorks } from '../hooks/useAllWorks';
import { useMembers } from '../hooks/useMembers';
import WorkCard from '../components/WorkCard';
import Lightbox from '../components/Lightbox';
import EmptyState from '../components/EmptyState';
import StarBackground from '../components/StarBackground';
import { WorkCardSkeleton } from '../components/Skeleton';
import type { Work, WorkType } from '../types/member';

const PAGE_SIZE = 10;

const typeOptions: Array<{ key: WorkType | 'all'; label: string }> = [
  { key: 'all', label: '全部类型' },
  { key: 'photo', label: '摄影' },
  { key: 'poster', label: '海报' },
  { key: 'video', label: '视频' },
];

export default function Gallery() {
  const { works, loading } = useAllWorks();
  const { members } = useMembers();

  const [type, setType] = useState<WorkType | 'all'>('all');
  const [batch, setBatch] = useState<number | 'all'>('all');
  const [author, setAuthor] = useState('all');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const batches = useMemo(
    () => Array.from(new Set(members.map((m) => m.batch))).sort((a, b) => b - a),
    [members]
  );

  const filtered = useMemo(() => {
    const list = works.filter((w) => {
      if (type !== 'all' && w.type !== type) return false;
      if (author !== 'all' && w.memberId !== author) return false;
      if (batch !== 'all' && w.memberBatch !== batch) return false;
      return true;
    });
    list.sort((a, b) => {
      const d = +new Date(a.createdAt) - +new Date(b.createdAt);
      return sort === 'desc' ? -d : d;
    });
    return list;
  }, [works, type, author, batch, sort]);

  // 筛选变化时重置分页
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [type, batch, author, sort]);

  // 无限滚动
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: '300px' }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [filtered.length]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const [activeWork, setActiveWork] = useState<Work | null>(null);

  return (
    <div className="relative">
      <StarBackground density={0.5} />

      {/* Banner */}
      <div className="relative px-4 pb-10 pt-36 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
            Gallery
          </p>
          <h1 className="text-5xl font-black tracking-tighter sm:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
              作品墙
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base font-light leading-relaxed text-gray-400">
            每一件作品都是星光的碎片
          </p>
          <p className="mt-3 text-sm text-gray-500">
            已收录 <span className="font-bold text-gray-300">{works.length}</span> 件作品
          </p>
        </motion.div>
      </div>

      {/* 筛选工具栏：透明背景 + 底部细线 */}
      <div className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 border-b border-white/20 py-4">
          <div className="group relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as WorkType | 'all')}
              className="cursor-pointer border-b border-white/20 bg-transparent py-2 pr-6 pl-1 text-sm text-white focus:border-transparent focus:outline-none [&>option]:bg-[#121833]"
              aria-label="按类型筛选"
            >
            {typeOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-300 group-focus-within:scale-x-100 group-hover:scale-x-100"
            />
          </div>

          <div className="group relative">
            <select
              value={batch === 'all' ? 'all' : String(batch)}
              onChange={(e) =>
                setBatch(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="cursor-pointer border-b border-white/20 bg-transparent py-2 pr-6 pl-1 text-sm text-white focus:border-transparent focus:outline-none [&>option]:bg-[#121833]"
              aria-label="按届别筛选"
            >
            <option value="all">全部届别</option>
            {batches.map((b) => (
              <option key={b} value={b}>
                {b}届
              </option>
            ))}
          </select>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-300 group-focus-within:scale-x-100 group-hover:scale-x-100"
            />
          </div>

          <div className="group relative">
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="max-w-40 cursor-pointer border-b border-white/20 bg-transparent py-2 pr-6 pl-1 text-sm text-white focus:border-transparent focus:outline-none [&>option]:bg-[#121833]"
              aria-label="按作者筛选"
            >
            <option value="all">全部作者</option>
            {members.map((m) => (
              <option key={m.uid} value={m.uid}>
                {m.name}
              </option>
            ))}
          </select>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-300 group-focus-within:scale-x-100 group-hover:scale-x-100"
            />
          </div>

          <div className="group relative">
            <button
              type="button"
              onClick={() => setSort((s) => (s === 'desc' ? 'asc' : 'desc'))}
              className="border-b border-white/20 bg-transparent px-1 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              {sort === 'desc' ? '最新优先' : '最旧优先'}
            </button>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-300 group-hover:scale-x-100"
            />
          </div>

          <span className="ml-auto text-xs text-gray-500">
            筛选出 {filtered.length} 件
          </span>
        </div>
      </div>

      {/* 瀑布流 */}
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <WorkCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Images}
            title="暂无作品，期待第一位创作者！"
            description="还没有部员上传作品，或当前筛选条件下没有匹配结果。"
          />
        ) : (
          <>
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
              {visible.map((w: Work, i) => (
                <WorkCard key={w.id} work={w} index={i} onClick={setActiveWork} />
              ))}
            </div>
            <Lightbox work={activeWork} onClose={() => setActiveWork(null)} />
          </>
        )}

        <div ref={sentinelRef} className="flex h-20 items-center justify-center">
          {hasMore && <Loader2 className="h-6 w-6 animate-spin text-neon-blue" />}
          {!loading && !hasMore && filtered.length > 0 && (
            <p className="text-xs text-gray-600">—— 已经到底啦 ——</p>
          )}
        </div>
      </div>
    </div>
  );
}

