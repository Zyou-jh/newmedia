import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Images } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWorks } from '../../hooks/useWorks';
import {
  createMemberWork,
  updateMemberWork,
  deleteMemberWork,
} from '../../supabase/database';
import { workImagePath } from '../../supabase/storage';
import ImageUploader from '../../components/ImageUploader';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/Toast';
import { WORK_TYPE_LABEL, type Work, type WorkType } from '../../types/member';

interface FormState {
  title: string;
  type: WorkType;
  imageUrl: string;
  description: string;
}

const EMPTY_FORM: FormState = { title: '', type: 'photo', imageUrl: '', description: '' };

export default function WorksManager() {
  const { user } = useAuth();
  const { works, reload } = useWorks(user?.uid);
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Work | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        type: editing.type,
        imageUrl: editing.imageUrl,
        description: editing.description,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editing, modalOpen]);

  if (!user) return null;

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(w: Work) {
    setEditing(w);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('请填写作品标题', 'error');
      return;
    }
    if (!form.imageUrl) {
      toast('请上传作品图片', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        type: form.type,
        imageUrl: form.imageUrl,
        description: form.description.trim(),
      };
      if (editing) {
        await updateMemberWork(user!.uid, editing.id, payload);
        toast('作品已更新', 'success');
      } else {
        await createMemberWork(user!.uid, payload);
        toast('作品已发布', 'success');
      }
      setModalOpen(false);
      await reload();
    } catch {
      toast('操作失败，请重试', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    try {
      await deleteMemberWork(user!.uid, deletingId);
      toast('作品已删除', 'success');
      await reload();
    } catch {
      toast('删除失败，请重试', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">作品管理</h2>
          <p className="mt-1 text-sm text-gray-400">共 {works.length} 件作品</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 px-5 py-2.5 text-sm font-bold text-midnight transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          添加作品
        </button>
      </div>

      {works.length === 0 ? (
        <EmptyState
          icon={Images}
          title="还没有作品"
          description="发布你的第一件作品，让它出现在作品墙和你的个人主页上。"
          action={
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black"
            >
              <Plus className="h-4 w-4" />
              添加第一件作品
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {works.map((w) => (
            <div
              key={w.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={w.imageUrl}
                  alt={w.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
                  {WORK_TYPE_LABEL[w.type]}
                </span>
              </div>
              <div className="p-4">
                <h3 className="truncate text-sm font-bold">{w.title}</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(w.createdAt).toLocaleDateString('zh-CN')}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(w)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    编辑
                  </button>
                  <button
                    onClick={() => setDeletingId(w.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 py-1.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 添加 / 编辑模态框 */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#121833] p-7 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight">
                  {editing ? '编辑作品' : '添加作品'}
                </h3>
                <button
                  type="button"
                  aria-label="关闭"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <ImageUploader
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  path={
                    editing
                      ? workImagePath(user.uid, editing.id)
                      : workImagePath(user.uid, `draft_${Date.now()}`)
                  }
                  variant="cover"
                  label="上传作品图片"
                  maxSizeMB={20}
                />

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
                    标题
                  </span>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="给作品起个名字"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
                    类型
                  </span>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as WorkType })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-400/50 focus:outline-none [&>option]:bg-[#121833]"
                  >
                    <option value="photo">摄影</option>
                    <option value="poster">海报</option>
                    <option value="video">视频</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">
                    作品描述
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    placeholder="聊聊这件作品的故事…"
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-gray-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </label>
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-gray-200 hover:bg-white/10"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 py-2.5 text-sm font-bold text-midnight transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editing ? '保存修改' : '发布作品'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={deletingId !== null}
        title="确认删除这件作品？"
        message="删除后无法恢复，作品将同时从作品墙和个人主页移除。"
        confirmText="删除"
        loading={false}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
