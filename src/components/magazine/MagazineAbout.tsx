import { motion } from 'framer-motion';
import { Sparkles, Link2, UserCircle } from 'lucide-react';
import type { Member } from '../../types/member';

interface MagazineAboutProps {
  member: Member;
}

const STICKER_COLORS = [
  'bg-accent-orange text-white',
  'bg-ink text-white',
  'bg-paper-card text-ink border border-ink/10',
  'bg-[#2d3436] text-[#dfe6e9]',
  'bg-[#0984e3] text-white',
  'bg-[#6c5ce7] text-white',
  'bg-[#fdcb6e] text-ink',
  'bg-[#00b894] text-white',
  'bg-[#e17055] text-white',
];

export default function MagazineAbout({ member }: MagazineAboutProps) {
  const paragraphs = member.description
    ? member.description.split('\n').filter((p) => p.trim().length > 0)
    : ['这位成员还没有填写自我介绍。'];

  const bio = member.bio || '一个有创意的灵魂';

  return (
    <section className="relative overflow-hidden bg-paper font-magazine text-ink">
      {/* 顶部渐变过渡：从深色到米色 */}
      <div className="pointer-events-none h-32 bg-gradient-to-b from-midnight to-paper" />

      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* ========== 标题区 ========== */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="relative mb-16 pt-8"
        >
          {/* 左右对称的小文字 */}
          <div className="mb-6 flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-ink-muted">
              ABOUT ME
            </span>
            <span className="text-[11px] font-medium tracking-[0.15em] text-ink-muted">
              第 {member.batch} 届 · {member.role}
            </span>
          </div>

          {/* 超大标题 */}
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.05] tracking-tight text-ink">
            {member.name}
          </h2>

          {/* 副标题 / 一句话 bio */}
          <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-accent-orange">
            {bio}
          </p>

          {/* 装饰细线 */}
          <div className="mt-8 h-px w-24 bg-ink/15" />
        </motion.header>

        {/* ========== 主视觉 + 正文 ========== */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* 左侧：头像大图 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={`${member.name} 的头像`}
                    className="aspect-[3/4] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full items-center justify-center bg-paper-card text-6xl font-black text-ink/20">
                    {member.name.slice(0, 1)}
                  </div>
                )}
              </div>
              {/* 像照片胶带一样的装饰角 */}
              <div className="absolute -left-2 top-4 h-8 w-4 rotate-[-6deg] rounded-sm bg-paper-card shadow-sm" />
              <div className="absolute -right-2 bottom-12 h-8 w-4 rotate-[4deg] rounded-sm bg-paper-card shadow-sm" />
            </div>

            {/* 信息卡片 */}
            <div className="mt-8 rounded-2xl bg-paper-card p-6 shadow-sm">
              <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                <UserCircle className="h-4 w-4" />
                基本信息
              </h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-ink/5 pb-2">
                  <dt className="text-ink-muted">届别</dt>
                  <dd className="font-bold text-ink">{member.batch} 届</dd>
                </div>
                <div className="flex justify-between border-b border-ink/5 pb-2">
                  <dt className="text-ink-muted">角色</dt>
                  <dd className="font-bold text-ink">{member.role}</dd>
                </div>
                <div className="flex justify-between border-b border-ink/5 pb-2">
                  <dt className="text-ink-muted">加入时间</dt>
                  <dd className="font-bold text-ink">
                    {new Date(member.joinDate).getFullYear()} 年
                  </dd>
                </div>
              </dl>
              {member.socialLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.socialLinks.map((s) => (
                    <a
                      key={s.platform}
                      href={s.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-paper px-2.5 py-1 text-xs font-semibold text-ink-soft transition hover:text-accent-orange"
                    >
                      <Link2 className="h-3 w-3" />
                      {s.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* 右侧：正文 + 技能 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            {/* 杂志式正文 */}
            <article className="prose-magazine">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mb-6 text-[15px] leading-[1.85] text-ink-soft"
                >
                  {i === 0 && (
                    <span className="float-left mr-3 mt-1 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-orange text-xl font-black text-white shadow-sm">
                      {member.name.charAt(0)}
                    </span>
                  )}
                  {p}
                </p>
              ))}
            </article>

            {/* 引用框 */}
            {member.bio && (
              <div className="my-8 rounded-2xl border-l-4 border-accent-orange bg-paper-card p-6">
                <p className="text-base font-medium italic leading-relaxed text-ink">
                  「{member.bio}」
                </p>
              </div>
            )}

            {/* 技能标签 — 贴纸风 */}
            <div className="mt-10">
              <h4 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                <Sparkles className="h-4 w-4" />
                技能点
              </h4>
              {member.tags.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {member.tags.map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 ${STICKER_COLORS[i % STICKER_COLORS.length]}`}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-muted">暂未添加技能标签</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 底部渐变过渡：从米色回到深色 */}
      <div className="pointer-events-none h-32 bg-gradient-to-b from-paper to-midnight" />
    </section>
  );
}
