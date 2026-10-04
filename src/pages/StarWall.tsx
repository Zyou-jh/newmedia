import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { useMembers } from '../hooks/useMembers';
import MemberCard from '../components/MemberCard';
import EmptyState from '../components/EmptyState';
import { MemberCardSkeleton } from '../components/Skeleton';
import StarBackground from '../components/StarBackground';
import type { Member } from '../types/member';

const BATCHES = [2026, 2025];
/** 只展示 2025 届及之后的部员 */
const MIN_BATCH = 2025;

export default function StarWall() {
  const { members, loading } = useMembers();
  const [keyword, setKeyword] = useState('');
  const [batch, setBatch] = useState<number | 'all'>('all');
  const [role, setRole] = useState('all');
  const [tag, setTag] = useState('all');

  const roles = useMemo(
    () => Array.from(new Set(members.map((m) => m.role))).sort(),
    [members]
  );
  const tags = useMemo(
    () => Array.from(new Set(members.flatMap((m) => m.tags))).slice(0, 20),
    [members]
  );

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return members.filter((m) => {
      if (m.batch < MIN_BATCH) return false;
      if (batch !== 'all' && m.batch !== batch) return false;
      if (role !== 'all' && m.role !== role) return false;
      if (tag !== 'all' && !m.tags.includes(tag)) return false;
      if (
        kw &&
        !`${m.name} ${m.role} ${m.bio} ${m.tags.join(' ')}`
          .toLowerCase()
          .includes(kw)
      )
        return false;
      return true;
    });
  }, [members, keyword, batch, role, tag]);

  const grouped = useMemo(() => {
    const map = new Map<number, Member[]>();
    for (const m of filtered) {
      const arr = map.get(m.batch) ?? [];
      arr.push(m);
      map.set(m.batch, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

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
            Star Wall
          </p>
          <h1 className="text-5xl font-black tracking-tighter sm:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
              星光墙
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base font-light leading-relaxed text-gray-400">
            认识创客新媒的每一位成员 —— 每一颗星，都有自己的光
          </p>
          <p className="mt-3 text-sm text-gray-500">
            共 <span className="font-bold text-gray-300">{members.length}</span> 位成员
          </p>
        </motion.div>
      </div>

      {/* 筛选工具栏：透明背景 + 底部细线 */}
      <div className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl border-b border-white/20 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="group relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索姓名、角色…"
                className="w-full border-b border-white/20 bg-transparent py-2.5 pl-7 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-transparent focus:outline-none"
              />
              {/* focus 时渐变底线 */}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-300 group-focus-within:scale-x-100"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterPill
                active={batch === 'all'}
                onClick={() => setBatch('all')}
              >
                全部届
              </FilterPill>
              {BATCHES.map((b) => (
                <FilterPill key={b} active={batch === b} onClick={() => setBatch(b)}>
                  {b}届
                </FilterPill>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
            <span className="mr-1 text-xs font-semibold text-gray-500">角色</span>
            <FilterPill small active={role === 'all'} onClick={() => setRole('all')}>
              全部
            </FilterPill>
            {roles.map((r) => (
              <FilterPill key={r} small active={role === r} onClick={() => setRole(r)}>
                {r}
              </FilterPill>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold text-gray-500">标签</span>
              <FilterPill small active={tag === 'all'} onClick={() => setTag('all')}>
                全部
              </FilterPill>
              {tags.map((t) => (
                <FilterPill key={t} small active={tag === t} onClick={() => setTag(t)}>
                  {t}
                </FilterPill>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 成员列表 */}
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <EmptyState
            icon={Users}
            title="还没有部员信息"
            description="没有找到符合筛选条件的成员，试试调整搜索关键词或筛选条件。"
          />
        ) : (
          <div className="flex flex-col gap-16">
            {grouped.map(([batchYear, list]) => (
              <section key={batchYear}>
                <div className="mb-7 flex items-center gap-4">
                  <span
                    aria-hidden
                    className="h-9 w-1 rounded-full bg-gradient-to-b from-blue-400 to-purple-500 shadow-[0_0_16px_rgba(0,240,255,0.6)]"
                  />
                  <h2 className="text-2xl font-black tracking-tight">
                    {batchYear}
                    <span className="ml-2 text-base font-bold text-gray-500">届</span>
                  </h2>
                  <span className="text-sm text-gray-500">{list.length} 人</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {list.map((m, i) => (
                    <MemberCard key={m.uid} member={m} index={i} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  small = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border transition-all duration-200 ${
        small ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
      } ${
        active
          ? 'border-transparent bg-gradient-to-r from-blue-400 to-purple-500 font-bold text-midnight'
          : 'border-white/20 bg-transparent font-medium text-gray-400 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-400/15 hover:to-purple-500/15 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
