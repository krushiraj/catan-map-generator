"use client";

import { useState, useCallback, useRef } from "react";

export function useBoardAnimation() {
  const [animatingTiles, setAnimatingTiles] = useState<Set<number>>(new Set());
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "tiles" | "colors" | "numbers" | "complete"
  >("idle");
  const generateCountRef = useRef(0);
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const triggerBoardAnimation = useCallback(
    (tileCount: number, rings: number[][]) => {
      generateCountRef.current += 1;
      const count = generateCountRef.current;

      if (count > 3 && !reducedMotion) {
        setAnimationPhase("complete");
        return;
      }

      if (reducedMotion) {
        setAnimationPhase("complete");
        return;
      }

      setAnimationPhase("tiles");
      const allTiles = new Set<number>();

      rings.forEach((ring, ringIndex) => {
        setTimeout(() => {
          ring.forEach((tileIndex) => allTiles.add(tileIndex));
          setAnimatingTiles(new Set(allTiles));
        }, ringIndex * 100);
      });

      setTimeout(() => setAnimationPhase("colors"), rings.length * 100 + 200);
      setTimeout(() => setAnimationPhase("numbers"), rings.length * 100 + 400);
      setTimeout(() => setAnimationPhase("complete"), rings.length * 100 + 800);
    },
    [reducedMotion]
  );

  const resetAnimation = useCallback(() => {
    setAnimatingTiles(new Set());
    setAnimationPhase("idle");
  }, []);

  const resetGenerateCount = useCallback(() => {
    generateCountRef.current = 0;
  }, []);

  return {
    animatingTiles,
    animationPhase,
    triggerBoardAnimation,
    resetAnimation,
    resetGenerateCount,
  };
}
