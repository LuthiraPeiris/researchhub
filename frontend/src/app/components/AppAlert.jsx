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
        "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
      iconBox:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
      Icon: CheckCircle,
      title: "Success",
    },
    error: {
      wrapper:
        "border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300",
      iconBox:
        "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300",
      Icon: XCircle,
      title: "Error",
    },
    warning: {
      wrapper:
        "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
      iconBox:
        "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
      Icon: AlertCircle,
      title: "Warning",
    },
    info: {
      wrapper:
        "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300",
      iconBox:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
      Icon: Info,
      title: "Info",
    },
  };

  const current = styles[type] || styles.info;
  const Icon = current.Icon;

  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 shadow-sm ${current.wrapper}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${current.iconBox}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{current.title}</div>
          <p className="mt-0.5 text-sm leading-6 opacity-90">{message}</p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 opacity-60 transition-colors hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
