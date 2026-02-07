"use client";

import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already installed as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Previously dismissed
    if (sessionStorage.getItem("install-dismissed")) {
      setDismissed(true);
      return;
    }

    // iOS detection (no beforeinstallprompt)
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !("MSStream" in window);
    setIsIOS(ios);

    // Chrome/Edge/Samsung install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setDeferredPrompt(null);
    sessionStorage.setItem("install-dismissed", "1");
  }, []);

  // Nothing to show
  if (dismissed || (!deferredPrompt && !isIOS)) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-fade-up max-w-sm mx-auto">
      <div className="bg-bg-surface-raised border border-border rounded-2xl px-4 py-3 shadow-xl">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/web-app-manifest-192x192.png"
            alt="CatanMapGen"
            className="w-10 h-10 rounded-lg shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">
              Install CatanMapGen
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {isIOS
                ? "Tap the share button, then \"Add to Home Screen\""
                : "Add to your home screen for quick access"}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-secondary hover:text-text-primary p-1 -mt-1 -mr-1"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="w-full mt-3 gold-gradient text-bg-base text-sm font-semibold py-2 rounded-xl active:scale-[0.98] transition-transform"
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
};
