import { useRef, useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { uploadImage } from '../supabase/storage';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  /** Storage 中的存放路径（demo 模式下仅作标识），首段为 bucket 名 */
  path: string;
  label?: string;
  variant?: 'avatar' | 'cover' | 'square';
  accept?: string;
  /** 最大文件大小（MB），默认 8 */
  maxSizeMB?: number;
}

const aspectClass = {
  avatar: 'aspect-square rounded-full',
  cover: 'aspect-[16/7] rounded-2xl',
  square: 'aspect-square rounded-2xl',
};

export default function ImageUploader({
  value,
  onChange,
  path,
  label = '点击上传图片',
  variant = 'square',
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxSizeMB = 8,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`图片不能超过 ${maxSizeMB}MB`);
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(path, file);
      onChange(url);
    } catch {
      setError('上传失败，请重试');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <div
        className={`group relative flex w-full items-center justify-center overflow-hidden border border-dashed border-white/20 bg-white/5 transition-colors hover:border-blue-400/50 ${aspectClass[variant]}`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="预览"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black"
              >
                更换
              </button>
              <button
                type="button"
                aria-label="移除图片"
                onClick={() => onChange('')}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 px-4 py-6 text-gray-400 transition-colors hover:text-white"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-neon-blue" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
            <span className="text-xs font-medium">{label}</span>
          </button>
        )}
        {uploading && value && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="h-6 w-6 animate-spin text-neon-blue" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
