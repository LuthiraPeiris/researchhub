import {
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  X,
} from "lucide-react";

export function AppAlert({ type = "info", message, onClose }) {
  if (!message) return null;

  const styles = {
    success: {
      wrapper:
        "border-green-200 bg-green-50 text-green-800 dark:border-green-900/70 dark:bg-green-950/40 dark:text-green-300",
      iconBox:
        "bg-green-100 text-green-600 dark:bg-green-950/70 dark:text-green-300",
      Icon: CheckCircle,
      title: "Success",
    },
    error: {
      wrapper:
        "border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300",
      iconBox:
        "bg-red-100 text-red-600 dark:bg-red-950/70 dark:text-red-300",
      Icon: XCircle,
      title: "Error",
    },
    warning: {
      wrapper:
        "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/70 dark:bg-yellow-950/40 dark:text-yellow-300",
      iconBox:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/70 dark:text-yellow-300",
      Icon: AlertCircle,
      title: "Warning",
    },
    info: {
      wrapper:
        "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300",
      iconBox:
        "bg-blue-100 text-[#0ea5e9] dark:bg-blue-950/70 dark:text-[#38bdf8]",
      Icon: Info,
      title: "Info",
    },
  };

  const current = styles[type] || styles.info;
  const Icon = current.Icon;

  return (
    <div
      className={`rounded-xl border px-4 py-3 shadow-sm transition-all ${current.wrapper}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${current.iconBox}`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">{current.title}</div>
          <p className="text-sm opacity-90 leading-relaxed">{message}</p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}