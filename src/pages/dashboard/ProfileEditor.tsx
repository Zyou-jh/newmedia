import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Plus, X, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { saveMember } from '../../supabase/database';
import { avatarPath, backgroundPath } from '../../supabase/storage';
import ImageUploader from '../../components/ImageUploader';
import { useToast } from '../../components/Toast';

const inputCls =
  'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20';

export default function ProfileEditor() {
  const { user, member, refreshMember } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    description: '',
    avatar: '',
    backgroundImage: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [socials, setSocials] = useState<{ platform: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name,
        role: member.role,
        bio: member.bio,
        description: member.description,
        avatar: member.avatar,
        backgroundImage: member.backgroundImage,
      });
      setTags(member.tags);
      setSocials(
        member.socialLinks.length ? member.socialLinks : [{ platform: '', url: '' }]
      );
    }
  }, [member]);

  if (!user || !member) return null;

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 12) {
      setTags([...tags, t]);
    }
    setTagInput('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveMember(user!.uid, {
        ...form,
        name: form.name.trim() || member!.name,
        tags,
        socialLinks: socials.filter((s) => s.platform && s.url),
      });
      await refreshMember();
      toast('资料已保存', 'success');
    } catch {
      toast('保存失败，请重试', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8"
    >
      <div>
        <h2 className="text-2xl font-black tracking-tight">个人资料</h2>
        <p className="mt-1 text-sm text-gray-400">这些信息会展示在你的公开主页上</p>
      </div>

      {/* 图片 */}
      <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            头像
          </p>
          <ImageUploader
            value={form.avatar}
            onChange={(url) => setForm({ ...form, avatar: url })}
            path={avatarPath(user.uid)}
            variant="avatar"
            label="上传头像"
            maxSizeMB={5}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            主页背景图
          </p>
          <ImageUploader
            value={form.backgroundImage}
            onChange={(url) => setForm({ ...form, backgroundImage: url })}
            path={backgroundPath(user.uid)}
            variant="cover"
            label="上传背景图"
            maxSizeMB={10}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
            姓名 / 昵称
          </span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
            角色
          </span>
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="如：摄影组组长 / 平面设计师"
            className={inputCls}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
          届别
          <span className="normal-case tracking-normal text-gray-600">（注册时确定，不可修改）</span>
        </span>
        <input value={`${member.batch} 届`} disabled className={`${inputCls} opacity-50`} />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
          个性签名（一句话）
        </span>
        <input
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="用一句话介绍你自己"
          maxLength={60}
          className={inputCls}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
          自我介绍
        </span>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={6}
          placeholder="聊聊你是谁、擅长什么、在新媒做过什么…"
          className={`${inputCls} resize-none leading-relaxed`}
        />
      </label>

      {/* 技能标签 */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
          技能标签
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1.5 text-sm text-gray-200"
            >
              {t}
              <button
                type="button"
                aria-label={`移除标签 ${t}`}
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="text-gray-500 transition-colors hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="输入后回车添加"
            className="min-w-36 flex-1 rounded-full border border-dashed border-white/20 bg-transparent px-3.5 py-1.5 text-sm placeholder:text-gray-600 focus:border-blue-400/50 focus:outline-none"
          />
        </div>
      </div>

      {/* 社交链接 */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
          社交链接
        </p>
        <div className="flex flex-col gap-3">
          {socials.map((s, i) => (
            <div key={i} className="flex gap-3">
              <input
                value={s.platform}
                onChange={(e) => {
                  const next = [...socials];
                  next[i] = { ...s, platform: e.target.value };
                  setSocials(next);
                }}
                placeholder="平台（如：小红书 / Instagram）"
                className={`${inputCls} max-w-48`}
              />
              <input
                value={s.url}
                onChange={(e) => {
                  const next = [...socials];
                  next[i] = { ...s, url: e.target.value };
                  setSocials(next);
                }}
                placeholder="链接 URL"
                className={inputCls}
              />
              <button
                type="button"
                aria-label="删除该链接"
                onClick={() => setSocials(socials.filter((_, idx) => idx !== i))}
                className="shrink-0 rounded-2xl border border-white/10 px-3 text-gray-500 hover:text-rose-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSocials([...socials, { platform: '', url: '' }])}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gray-300 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            添加链接
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-blue-400 to-purple-500 px-8 py-3 text-sm font-bold text-midnight transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        保存资料
      </button>
    </form>
  );
}
