import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'text-emerald-400',
  error: 'text-rose-400',
  info: 'text-blue-300',
};

let seed = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = ++seed;
      setItems((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-6 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2">
        <AnimatePresence>
          {items.map((item) => {
            const Icon = iconMap[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#121833]/90 px-4 py-3 shadow-2xl backdrop-blur-xl"
              >
                <Icon className={`h-5 w-5 shrink-0 ${colorMap[item.type]}`} />
                <p className="flex-1 text-sm font-medium text-gray-100">
                  {item.message}
                </p>
                <button
                  aria-label="关闭提示"
                  onClick={() => remove(item.id)}
                  className="text-gray-500 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast 必须在 ToastProvider 内使用');
  return ctx;
}
