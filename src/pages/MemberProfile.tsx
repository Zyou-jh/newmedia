import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Link2,
  FileQuestion,
} from 'lucide-react';
import { useMember } from '../hooks/useMember';
import { useWorks } from '../hooks/useWorks';
import WorkCard from '../components/WorkCard';
import EmptyState from '../components/EmptyState';
import StarBackground from '../components/StarBackground';
import { MemberProfileSkeleton, WorkCardSkeleton } from '../components/Skeleton';
import { WORK_TYPE_LABEL, type Work, type WorkType } from '../types/member';
import MagazineAbout from '../components/magazine/MagazineAbout';
import MagazineWorkDetail from '../components/magazine/MagazineWorkDetail';

const TYPE_FILTERS: Array<{ key: WorkType | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'photo', label: '摄影' },
  { key: 'poster', label: '海报' },
  { key: 'video', label: '视频' },
];

export default function MemberProfile() {
  const { id } = useParams();
  const { member, loading } = useMember(id);
  const { works, loading: worksLoading } = useWorks(id);
  const [type, setType] = useState<WorkType | 'all'>('all');
  const [activeWork, setActiveWork] = useState<Work | null>(null);

  const filteredWorks = useMemo(
    () => (type === 'all' ? works : works.filter((w) => w.type === type)),
    [works, type]
  );

  if (loading) {
    return <MemberProfileSkeleton />;
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-40 text-center">
        <EmptyState
          icon={FileQuestion}
          title="没有找到这位部员"
          description="该成员可能已退出组织，或链接有误。"
          action={
            <Link
              to="/starwall"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              返回星光墙
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero */}
      <div className="relative h-[52vh] min-h-[380px] overflow-hidden">
        {member.backgroundImage ? (
          <img
            src={member.backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <StarBackground density={1.2} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/60 to-midnight" />

        <div className="relative mx-auto flex h-full max-w-5xl flex-col items-center justify-end px-4 pb-12 text-center">
          <Link
            to="/starwall"
            className="absolute top-28 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-md transition-colors hover:text-white sm:left-8"
          >
            <ArrowLeft className="h-4 w-4" />
            返回星光墙
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <div className="rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-[3px] shadow-[0_0_40px_rgba(0,240,255,0.35)]">
              <div className="rounded-full bg-midnight p-[3px]">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={`${member.name}的头像`}
                    className="h-28 w-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 text-4xl font-black">
                    {member.name.slice(0, 1)}
                  </div>
                )}
              </div>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tighter sm:text-5xl">
              {member.name}
            </h1>
            <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-gray-300">
              <span className="text-neon-blue">{member.role}</span>
              <span className="text-gray-600">·</span>
              <span>{member.batch}届</span>
            </p>
            {member.bio && (
              <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-gray-300">
                {member.bio}
              </p>
            )}
            {member.socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {member.socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-gray-300 backdrop-blur-md transition-colors hover:border-white/25 hover:text-white"
                  >
                    <Link2 className="h-3 w-3" />
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 杂志风格：关于我 + 技能 */}
      <MagazineAbout member={member} />

      {/* 作品展示 */}
      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              Portfolio
            </p>
            <h2 className="text-3xl font-black tracking-tighter">作品展示</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setType(f.key)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                  type === f.key
                    ? 'border-transparent bg-gradient-to-r from-blue-400 to-purple-500 text-midnight'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {worksLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <WorkCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredWorks.length === 0 ? (
          <EmptyState
            title="该部员还没有上传作品"
            description={
              type === 'all'
                ? '作品发布后将展示在这里，敬请期待。'
                : `还没有「${WORK_TYPE_LABEL[type as WorkType]}」类型的作品。`
            }
          />
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {filteredWorks.map((w, i) => (
              <WorkCard
                key={w.id}
                work={w}
                index={i}
                showAuthor={false}
                onClick={setActiveWork}
              />
            ))}
          </div>
        )}
      </div>

      {/* 杂志风格作品详情 */}
      <MagazineWorkDetail work={activeWork} onClose={() => setActiveWork(null)} />
    </div>
  );
}
