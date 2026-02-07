"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, onHide }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className="bg-bg-surface-raised border border-border rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A9B5A" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-sm text-text-primary">{message}</span>
      </div>
    </div>
  );
};
