interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => (
  <div
    className={`fixed bottom-6 right-6 z-9999 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl
      ${
        type === "success"
          ? "bg-[#0a1a0c] border-emerald-500/30 text-emerald-400"
          : "bg-[#1a0a0c] border-red-500/30 text-red-400"
      }`}
    style={{ animation: "slideInToast 0.3s ease" }}
  >
    <span className="font-bold text-base">
      {type === "success" ? "✓" : "✕"}
    </span>
    <span className="text-sm text-white/80">{message}</span>
    <button
      onClick={onClose}
      className="ml-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none text-lg leading-none"
    >
      ×
    </button>
  </div>
);

export default Toast;
