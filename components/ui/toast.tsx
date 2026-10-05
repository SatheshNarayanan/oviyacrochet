"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface ToastContextValue {
  toast: (message: string, type?: "default" | "success" | "error") => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

interface ToastMessage {
  id: number;
  message: string;
  type: "default" | "success" | "error";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counterRef = useRef(0);

  const toast = useCallback(
    (message: string, type: "default" | "success" | "error" = "default") => {
      const id = ++counterRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2600);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 200 }}>
        {toasts.map((t, i) => (
          <ToastItem key={t.id} message={t.message} type={t.type} index={i} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  message,
  type,
  index,
}: {
  message: string;
  type: string;
  index: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const bg =
    type === "error"
      ? "#c53030"
      : type === "success"
      ? "#276749"
      : "var(--ink)";

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        bottom: `${24 + index * 56}px`,
        transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
        background: bg,
        color: "var(--surface)",
        padding: "12px 18px",
        borderRadius: "var(--r-pill)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s, transform 0.25s",
        pointerEvents: "none",
        maxWidth: "90vw",
        textAlign: "center",
        fontWeight: 500,
        fontSize: 14,
        whiteSpace: "nowrap",
        zIndex: 200,
      }}
    >
      {message}
    </div>
  );
}
