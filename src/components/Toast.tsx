import { CheckCircle2, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  visible: boolean;
}

export default function Toast({ message, type = 'success', visible }: ToastProps) {
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg font-body text-sm font-bold ${
          type === 'success'
            ? 'bg-brand-primary text-brand-bg'
            : 'bg-red-600 text-white'
        }`}
      >
        {type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        {message}
      </div>
    </div>
  );
}