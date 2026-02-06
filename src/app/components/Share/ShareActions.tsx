"use client";

import React, { useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Toast } from "./Toast";

interface ShareActionsProps {
  boardRef: React.RefObject<HTMLDivElement | null>;
}

export const ShareActions: React.FC<ShareActionsProps> = ({ boardRef }) => {
  const [toast, setToast] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    if (!boardRef.current) return;

    try {
      const dataUrl = await toPng(boardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0D0D0F",
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "catan-map.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          title: "Catan Map",
          files: [file],
        });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setToast("Map copied to clipboard!");
      }
    } catch {
      setToast("Failed to share map");
    }
  }, [boardRef]);

  return (
    <>
      <button
        onClick={handleShare}
        className="btn-press text-text-secondary hover:text-accent-gold transition-colors p-2"
        aria-label="Share map"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>
      <Toast message={toast || ""} visible={!!toast} onHide={() => setToast(null)} />
    </>
  );
};
