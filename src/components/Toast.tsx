import { useEffect } from "react";

interface ToastProps {
  message: string;
  variant?: "success" | "error" | "info";
  onClose: () => void;
}

const styles: Record<string, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-rose-600 text-white",
  info: "bg-slate-900 text-white",
};

export function Toast({ message, variant = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => onClose(), 4000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed right-4 top-4 z-50 w-full max-w-sm rounded-3xl p-4 shadow-2xl shadow-slate-900/10 transition all duration-200 sm:w-auto">
      <div
        className={`flex items-start gap-3 rounded-3xl border border-white/10 px-4 py-4 ${styles[variant]}`}
      >
        <div className="flex-1 text-sm leading-6">
          <p className="font-semibold">
            {variant === "success"
              ? "Success"
              : variant === "error"
                ? "Error"
                : "Info"}
          </p>
          <p className="mt-1 text-sm">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 transition hover:text-white"
          aria-label="Close toast"
        >
          ×
        </button>
      </div>
    </div>
  );
}
