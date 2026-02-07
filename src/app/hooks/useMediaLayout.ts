"use client";

import { useState, useEffect } from "react";

export type LayoutMode = "mobile" | "tablet" | "desktop";

export function useMediaLayout(): LayoutMode | null {
  const [layout, setLayout] = useState<LayoutMode | null>(null);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1024) setLayout("desktop");
      else if (width >= 640) setLayout("tablet");
      else setLayout("mobile");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}
