import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />,
    info: <Info className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />,
  };

  const styles = {
    success: 'bg-emerald-500 text-white shadow-emerald-200',
    error: 'bg-red-500 text-white shadow-red-200',
    info: 'bg-blue-500 text-white shadow-blue-200',
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-[100]
        sm:bottom-6 sm:right-6
        md:bottom-8 md:right-8
        flex items-start gap-3
        px-4 py-3 sm:px-5 sm:py-4
        rounded-xl
        shadow-2xl
        backdrop-blur-sm
        min-w-[280px] max-w-[calc(100vw-2rem)]
        sm:min-w-[320px] sm:max-w-[400px]
        md:max-w-[450px]
        animate-slideInRight
        ${styles[type]}
      `}
      role="alert"
    >
      <div className="mt-0.5">{icons[type]}</div>
      <p className="flex-1 text-sm sm:text-base font-medium leading-relaxed pr-2">
        {message}
      </p>
      <button
        onClick={onClose}
        className="hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200 flex-shrink-0 -mt-0.5"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default Toast;


