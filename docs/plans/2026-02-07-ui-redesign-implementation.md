# UI/UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Catan Map Generator from a functional tool into a premium, Apple-quality game companion app with dark immersive theme, responsive layouts (mobile/tablet/desktop), swipeable bottom sheet, cinematic animations, and share-worthy interactions.

**Architecture:** Single-page app rebuilt with component decomposition. The monolithic `Map.tsx` (1132 lines) gets split into Board/, Controls/, Players/, Layout/, and Share/ modules. Mobile uses a vaul-powered bottom sheet with 3 snap points; tablet uses a side panel; desktop uses a 3-column layout. All animations are CSS-driven (transforms + opacity only). Board generation logic (`createInitialBoard`) is extracted unchanged into a pure utility.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 3.4, vaul (bottom sheet), html-to-image (share export)

**Design Doc:** `docs/plans/2026-02-07-ui-redesign-design.md`

**Worktree:** `.worktrees/ui-redesign` on branch `feature/ui-redesign`

---

## Task 1: Install Dependencies & Configure Theme

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Delete: `src/app/styles/global.css` (merge into globals.css)

**Step 1: Install vaul and html-to-image**

```bash
cd .worktrees/ui-redesign
yarn add vaul html-to-image
```

**Step 2: Update Tailwind config with design system**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0D0D0F",
          surface: "#1A1714",
          "surface-raised": "#242019",
        },
        accent: {
          gold: "#D4A546",
          "gold-dark": "#B8922E",
        },
        text: {
          primary: "#F0E6D6",
          secondary: "#9B8B6E",
        },
        border: {
          DEFAULT: "#2A2520",
        },
        resource: {
          brick: "#E85D4A",
          wheat: "#E8C44A",
          ore: "#8A9BAE",
          wood: "#4A9B5A",
          sheep: "#8BBF7A",
          desert: "#C4956A",
          sea: "#1A6B6B",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "shimmer": "shimmer 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "tile-enter": "tile-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "number-drop": "number-drop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-up": "fade-up 0.3s ease-out forwards",
        "wave": "wave 8s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(212, 165, 70, 0.3)" },
          "50%": { boxShadow: "0 0 12px rgba(212, 165, 70, 0.6)" },
        },
        "tile-enter": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "number-drop": {
          "0%": { transform: "scale(0) translateY(-4px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        wave: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

**Step 3: Rewrite globals.css with dark theme foundation**

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg-base: #0D0D0F;
    --bg-surface: #1A1714;
    --bg-surface-raised: #242019;
    --accent-gold: #D4A546;
    --accent-gold-dark: #B8922E;
    --text-primary: #F0E6D6;
    --text-secondary: #9B8B6E;
    --border: #2A2520;

    --resource-brick: #E85D4A;
    --resource-wheat: #E8C44A;
    --resource-ore: #8A9BAE;
    --resource-wood: #4A9B5A;
    --resource-sheep: #8BBF7A;
    --resource-desert: #C4956A;
    --resource-sea: #1A6B6B;
  }

  body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  .gold-gradient {
    background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark));
  }

  .glass-surface {
    background: rgba(26, 23, 20, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .btn-press {
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .btn-press:active {
    transform: scale(0.96);
  }

  .gold-ring {
    box-shadow: 0 0 0 2px var(--accent-gold), 0 0 8px rgba(212, 165, 70, 0.3);
  }

  .vignette {
    background: radial-gradient(ellipse at center, transparent 40%, rgba(13, 13, 15, 0.6) 100%);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.2s !important;
  }
}

/* Vaul drawer overrides */
[vaul-drawer] {
  background: var(--bg-surface) !important;
}
```

**Step 4: Delete old styles file**

```bash
rm src/app/styles/global.css
rm -r src/app/styles
```

**Step 5: Update layout.tsx**

Modify `src/app/layout.tsx` — remove `bg-blue-100` from body, update metadata:

```tsx
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="CatanMapGen" />
        <meta name="theme-color" content="#0D0D0F" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-base text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
```

**Step 6: Verify build**

```bash
yarn build
```

Expected: Build succeeds with no errors.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: install deps and configure dark Catan theme system"
```

---

## Task 2: Extract Board Logic into Pure Utility

**Files:**
- Create: `src/app/utils/board.ts`
- Modify: `src/app/utils/index.ts` (keep randomiser, export from board.ts too)
- Modify: `src/app/components/Map.tsx` (import from new location)

**Goal:** Extract `createInitialBoard`, all type definitions, hex position data, port positions, resource/number arrays, and the recursive assignment algorithm from `Map.tsx` into a pure utility file. This is a **zero-behavior-change refactor** — the board generation stays identical.

**Step 1: Create `src/app/utils/board.ts`**

Extract from `Map.tsx` lines 1-716 (everything before `CatanBoard` component):
- Type exports: `Resource`, `NumberOfPlayers`, `HexPosition`
- Constants: `resources4p`, `resources6p`, `numbers4p`, `numbers6p`, `portPositions`
- Data: `playerTurns` (the turn order arrays)
- Function: `createInitialBoard(numberOfPlayer, sameNumberShouldTouch, sameResourcesShouldTouch, scarceResource)` — copy exactly as-is
- Import `randomiser` from `./index`

The file should export all types and the `createInitialBoard` function. Also export `portPositions` and `playerTurns` since components need them.

**Step 2: Update Map.tsx imports**

Replace the inline definitions in `Map.tsx` with:

```ts
import { createInitialBoard, portPositions, playerTurns, type Resource, type NumberOfPlayers, type HexPosition } from "../utils/board";
```

Remove all the extracted code from `Map.tsx`. The `CatanBoard` component (lines ~746-1132) stays in `Map.tsx` for now.

**Step 3: Verify build**

```bash
yarn build
```

Expected: Build passes. No behavior change.

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: extract board generation logic into utils/board.ts"
```

---

## Task 3: Create Shared Hooks

**Files:**
- Create: `src/app/hooks/useMediaLayout.ts`
- Create: `src/app/hooks/useBoardAnimation.ts`

**Step 1: Create useMediaLayout hook**

Create `src/app/hooks/useMediaLayout.ts`:

```ts
"use client";

import { useState, useEffect } from "react";

export type LayoutMode = "mobile" | "tablet" | "desktop";

export function useMediaLayout(): LayoutMode {
  const [layout, setLayout] = useState<LayoutMode>("mobile");

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
```

**Step 2: Create useBoardAnimation hook**

Create `src/app/hooks/useBoardAnimation.ts`:

```ts
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

      // Skip animation after 3rd consecutive quick generate
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
```

**Step 3: Verify build**

```bash
yarn build
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add useMediaLayout and useBoardAnimation hooks"
```

---

## Task 4: Build Header Component

**Files:**
- Create: `src/app/components/Layout/Header.tsx`

**Step 1: Create Header component**

Create `src/app/components/Layout/Header.tsx`:

```tsx
"use client";

import React from "react";
import { useMediaLayout } from "../../hooks/useMediaLayout";

interface HeaderProps {
  onShare?: () => void;
  surpriseMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onShare, surpriseMode }) => {
  const layout = useMediaLayout();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4 glass-surface border-b border-border ${
        surpriseMode
          ? "border-b-2 border-b-transparent bg-gradient-to-r from-accent-gold/20 via-resource-sea/20 to-accent-gold/20"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Hex logo */}
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
          <polygon
            points="12,1 22,7 22,21 12,27 2,21 2,7"
            stroke="url(#gold-gradient)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient id="gold-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D4A546" />
              <stop offset="100%" stopColor="#B8922E" />
            </linearGradient>
          </defs>
        </svg>
        {layout !== "mobile" && (
          <span className="text-text-primary font-semibold tracking-wide text-sm">
            Catan Map Generator
          </span>
        )}
        {surpriseMode && (
          <span className="text-xs font-bold text-resource-sea animate-pulse-glow px-2 py-0.5 rounded-full bg-resource-sea/10 ml-2">
            SURPRISE
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onShare && (
          <button
            onClick={onShare}
            className="btn-press text-text-secondary hover:text-accent-gold transition-colors p-2"
            aria-label="Share map"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};
```

**Step 2: Verify build**

```bash
yarn build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add glass-morphism Header component with hex logo"
```

---

## Task 5: Build Control Components

**Files:**
- Create: `src/app/components/Controls/GenerateButton.tsx`
- Create: `src/app/components/Controls/PlayerCountPills.tsx`
- Create: `src/app/components/Controls/ConstraintToggles.tsx`
- Create: `src/app/components/Controls/ScarceResourcePicker.tsx`
- Create: `src/app/components/Controls/SurpriseToggle.tsx`

**Step 1: Create GenerateButton**

Create `src/app/components/Controls/GenerateButton.tsx`:

```tsx
"use client";

import React from "react";

interface GenerateButtonProps {
  onClick: () => void;
  isAnimating?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isAnimating }) => {
  return (
    <button
      onClick={onClick}
      disabled={isAnimating}
      className="btn-press gold-gradient text-bg-base font-bold text-sm px-6 py-3 rounded-xl
        shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/40 transition-shadow
        disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden min-w-[140px]"
    >
      <span className="relative z-10">Generate Map</span>
      {!isAnimating && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          animate-[shimmer-sweep_5s_ease-in-out_infinite] -translate-x-full" />
      )}
      {isAnimating && (
        <div className="absolute inset-0 rounded-xl border-2 border-accent-gold
          animate-[border-sweep_1s_linear_infinite]" />
      )}
    </button>
  );
};
```

**Step 2: Create PlayerCountPills**

Create `src/app/components/Controls/PlayerCountPills.tsx`:

```tsx
"use client";

import React from "react";
import type { NumberOfPlayers } from "../../utils/board";

interface PlayerCountPillsProps {
  value: NumberOfPlayers;
  onChange: (count: NumberOfPlayers) => void;
}

export const PlayerCountPills: React.FC<PlayerCountPillsProps> = ({ value, onChange }) => {
  const counts: NumberOfPlayers[] = [4, 5, 6];

  return (
    <div className="flex gap-2">
      {counts.map((count) => (
        <button
          key={count}
          onClick={() => onChange(count)}
          className={`btn-press w-10 h-10 rounded-full text-sm font-semibold transition-all
            ${
              value === count
                ? "gold-gradient text-bg-base shadow-lg shadow-accent-gold/30"
                : "bg-bg-surface-raised text-text-secondary border border-border hover:border-accent-gold/50"
            }`}
        >
          {count}
        </button>
      ))}
    </div>
  );
};
```

**Step 3: Create ConstraintToggles**

Create `src/app/components/Controls/ConstraintToggles.tsx`:

```tsx
"use client";

import React from "react";

interface ConstraintTogglesProps {
  noSameResources: boolean;
  noSameNumbers: boolean;
  onToggleResources: (value: boolean) => void;
  onToggleNumbers: (value: boolean) => void;
}

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <label className="flex items-center justify-between py-2 cursor-pointer">
    <span className="text-sm text-text-primary">{label}</span>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        checked ? "bg-accent-gold" : "bg-bg-surface-raised border border-border"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </label>
);

export const ConstraintToggles: React.FC<ConstraintTogglesProps> = ({
  noSameResources,
  noSameNumbers,
  onToggleResources,
  onToggleNumbers,
}) => {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
        Constraints
      </h3>
      <Toggle
        label="No Same Resources Touch"
        checked={noSameResources}
        onChange={onToggleResources}
      />
      <Toggle
        label="No Same Numbers Touch"
        checked={noSameNumbers}
        onChange={onToggleNumbers}
      />
    </div>
  );
};
```

**Step 4: Create ScarceResourcePicker**

Create `src/app/components/Controls/ScarceResourcePicker.tsx`:

```tsx
"use client";

import React from "react";
import type { Resource } from "../../utils/board";

interface ScarceResourcePickerProps {
  value: string;
  onChange: (resource: string) => void;
}

const RESOURCES: { key: string; label: string; color: string; icon: string }[] = [
  { key: "brick", label: "Brick", color: "bg-resource-brick", icon: "🧱" },
  { key: "hay", label: "Wheat", color: "bg-resource-wheat", icon: "🌾" },
  { key: "ore", label: "Ore", color: "bg-resource-ore", icon: "🪨" },
  { key: "wood", label: "Wood", color: "bg-resource-wood", icon: "🪵" },
  { key: "sheep", label: "Sheep", color: "bg-resource-sheep", icon: "🐏" },
];

export const ScarceResourcePicker: React.FC<ScarceResourcePickerProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
        Scarce Resource
      </h3>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onChange("")}
          className={`btn-press px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            value === ""
              ? "gold-gradient text-bg-base"
              : "bg-bg-surface-raised text-text-secondary border border-border"
          }`}
        >
          None
        </button>
        {RESOURCES.map((res) => (
          <button
            key={res.key}
            onClick={() => onChange(res.key)}
            className={`btn-press w-9 h-9 rounded-full text-lg transition-all flex items-center justify-center ${
              value === res.key
                ? "ring-2 ring-accent-gold ring-offset-2 ring-offset-bg-base"
                : "opacity-60 hover:opacity-100"
            } ${res.color}`}
            title={res.label}
          >
            {res.icon}
          </button>
        ))}
        <button
          onClick={() => {
            const resources = ["brick", "hay", "ore", "wood", "sheep"];
            onChange(resources[Math.floor(Math.random() * resources.length)]);
          }}
          className={`btn-press px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !["", "brick", "hay", "ore", "wood", "sheep"].includes(value)
              ? "gold-gradient text-bg-base"
              : "bg-bg-surface-raised text-text-secondary border border-border"
          }`}
        >
          Random
        </button>
      </div>
    </div>
  );
};
```

**Step 5: Create SurpriseToggle**

Create `src/app/components/Controls/SurpriseToggle.tsx`:

```tsx
"use client";

import React from "react";

interface SurpriseToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export const SurpriseToggle: React.FC<SurpriseToggleProps> = ({
  enabled,
  onToggle,
  disabled,
}) => {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
        Mode
      </h3>
      <label className="flex items-center justify-between py-2 cursor-pointer">
        <span className="text-sm text-text-primary">Surprise Mode</span>
        <button
          role="switch"
          aria-checked={enabled}
          onClick={() => !disabled && onToggle(!enabled)}
          disabled={disabled}
          className={`relative w-12 h-7 rounded-full transition-colors ${
            enabled
              ? "bg-resource-sea shadow-[0_0_12px_rgba(26,107,107,0.5)]"
              : "bg-bg-surface-raised border border-border"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </label>
    </div>
  );
};
```

**Step 6: Verify build**

```bash
yarn build
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add all control components with dark Catan theme"
```

---

## Task 6: Redesign HexTile with Animations

**Files:**
- Modify: `src/app/components/HexTile.tsx` (rewrite in place)

**Step 1: Rewrite HexTile.tsx**

Replace the entire file with the redesigned version. Key changes:
- New glowing resource colors from design system
- Animation support via `animationDelay` and `animationPhase` props
- 3D flip support for Surprise Mode via `flipped` prop
- Inner shadow depth effect on tiles
- Number token as separate circle with drop shadow
- Red glow on high-probability numbers (6, 8)
- `aria-label` for accessibility

```tsx
"use client";

import React from "react";

export const resourceColors: Record<string, string> = {
  wood: "#4A9B5A",
  brick: "#E85D4A",
  ore: "#8A9BAE",
  hay: "#E8C44A",
  sheep: "#8BBF7A",
  desert: "#C4956A",
  inverted: "#1A6B6B",
  all: "#C4956A",
};

export const icons: Record<string, string> = {
  wood: "🪵",
  brick: "🧱",
  ore: "🪨",
  hay: "🌾",
  sheep: "🐏",
  desert: "🏜️",
  all: "❓",
};

interface HexTileProps {
  x: number;
  y: number;
  rotation: number;
  resource: string;
  number?: number;
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
  reveal?: boolean;
  animationDelay?: number;
  animationPhase?: "idle" | "tiles" | "colors" | "numbers" | "complete";
  visible?: boolean;
}

export const HexTile: React.FC<HexTileProps> = ({
  x,
  y,
  rotation,
  resource,
  number,
  isHovered,
  onHover,
  onHoverEnd,
  reveal = true,
  animationDelay = 0,
  animationPhase = "complete",
  visible = true,
}) => {
  const hexPoints = "0,-1 0.866,-0.5 0.866,0.5 0,1 -0.866,0.5 -0.866,-0.5";
  const showContent = reveal && (animationPhase === "colors" || animationPhase === "numbers" || animationPhase === "complete");
  const showNumbers = reveal && (animationPhase === "numbers" || animationPhase === "complete");
  const color = !reveal ? resourceColors.inverted : resourceColors[resource];
  const isHighProb = number === 6 || number === 8;
  const scale = isHovered ? 1.05 : 1;

  if (!visible && animationPhase !== "complete") return null;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      style={{
        transition: "transform 0.2s ease",
        opacity: animationPhase === "idle" ? 0 : 1,
        animation:
          animationPhase === "tiles"
            ? `tile-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${animationDelay}ms both`
            : undefined,
      }}
    >
      {/* Hex shape */}
      <polygon
        points={hexPoints}
        transform={`rotate(${rotation})`}
        fill={showContent ? color : resourceColors.inverted}
        stroke="#2A2520"
        strokeWidth={0.03}
        style={{
          transition: "fill 0.3s ease",
          filter: !reveal ? "url(#shimmer)" : undefined,
        }}
      />

      {/* Inner shadow for depth */}
      <polygon
        points={hexPoints}
        transform={`rotate(${rotation})`}
        fill="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={0.06}
        style={{ pointerEvents: "none" }}
      />

      {/* Resource icon */}
      {showContent && resource !== "desert" && (
        <text
          x="0"
          y="-0.15"
          textAnchor="middle"
          fontSize="0.35"
          style={{
            transition: "opacity 0.3s ease",
          }}
        >
          {icons[resource]}
        </text>
      )}

      {/* Desert icon */}
      {showContent && resource === "desert" && (
        <text x="0" y="0.1" textAnchor="middle" fontSize="0.4">
          🏜️
        </text>
      )}

      {/* Number token */}
      {showNumbers && number && (
        <g
          style={{
            animation: `number-drop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${animationDelay + 200}ms both`,
          }}
        >
          <circle
            cx="0"
            cy="0.35"
            r="0.28"
            fill="#1A1714"
            stroke={isHighProb ? "#E85D4A" : "#2A2520"}
            strokeWidth={0.03}
          />
          <text
            x="0"
            y="0.43"
            textAnchor="middle"
            fontSize="0.25"
            fontWeight="bold"
            fill={isHighProb ? "#E85D4A" : "#F0E6D6"}
            fontFamily="var(--font-geist-sans), system-ui"
          >
            {number}
          </text>
        </g>
      )}

      {/* Hidden state question mark */}
      {!reveal && (
        <text
          x="0"
          y="0.15"
          textAnchor="middle"
          fontSize="0.4"
          fill="#1A6B6B"
          opacity="0.6"
        >
          ?
        </text>
      )}

      {/* Accessibility */}
      <title>
        {reveal ? `${resource} tile${number ? `, number ${number}` : ""}` : "Hidden tile"}
      </title>
    </g>
  );
};
```

**Step 2: Verify build**

```bash
yarn build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: redesign HexTile with dark theme, animations, and number tokens"
```

---

## Task 7: Redesign Vertex, Edge, and TriangleTile

**Files:**
- Modify: `src/app/components/Vertex.tsx`
- Modify: `src/app/components/Edge.tsx`
- Modify: `src/app/components/TriangleTile.tsx`

**Step 1: Redesign Vertex.tsx**

```tsx
"use client";

import React from "react";

interface VertexProps {
  x: number;
  y: number;
  onClick: (x: number, y: number) => void;
  color?: string;
  glowColor?: string;
  pulsing?: boolean;
}

export const Vertex: React.FC<VertexProps> = ({ x, y, onClick, color, glowColor, pulsing }) => {
  return (
    <g>
      {/* Glow effect when pulsing */}
      {pulsing && glowColor && (
        <circle
          cx={x}
          cy={y}
          r={0.35}
          fill={glowColor}
          opacity={0.3}
          style={{ animation: "pulse-glow 1.5s ease-in-out infinite" }}
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={0.2}
        fill={color || "#242019"}
        stroke={color ? "#F0E6D6" : "#2A2520"}
        strokeWidth={0.04}
        onClick={() => onClick(x, y)}
        className="cursor-pointer"
        style={{
          transition: "all 0.2s ease",
          filter: color ? "drop-shadow(0 0 3px rgba(212, 165, 70, 0.5))" : undefined,
        }}
      />
    </g>
  );
};
```

**Step 2: Redesign Edge.tsx**

```tsx
"use client";

import React from "react";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick: (x1: number, y1: number, x2: number, y2: number) => void;
  color?: string;
  animated?: boolean;
}

export const Edge: React.FC<EdgeProps> = ({ x1, y1, x2, y2, onClick, color, animated }) => {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color || "#2A2520"}
      strokeWidth={color ? 0.15 : 0.08}
      strokeLinecap="round"
      onClick={() => onClick(x1, y1, x2, y2)}
      className="cursor-pointer"
      style={{
        transition: "all 0.2s ease",
        filter: color ? "drop-shadow(0 0 2px rgba(240, 230, 214, 0.3))" : undefined,
        strokeDasharray: animated ? length : undefined,
        strokeDashoffset: animated ? length : undefined,
        animation: animated ? `road-draw 0.3s ease-out forwards` : undefined,
      }}
    />
  );
};
```

**Step 3: Redesign TriangleTile.tsx**

```tsx
"use client";

import React from "react";
import { icons, resourceColors } from "./HexTile";

interface TriangleTileProps {
  x: number;
  y: number;
  rotation: number;
  resource: string;
}

export const TriangleTile: React.FC<TriangleTileProps> = ({ x, y, rotation, resource }) => {
  const trianglePoints = "0,-0.55 0.48,0.275 -0.48,0.275";

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <polygon
        points={trianglePoints}
        fill={resourceColors[resource]}
        stroke="#2A2520"
        strokeWidth={0.03}
        opacity={0.85}
      />
      <text
        transform={`rotate(${-1 * rotation})`}
        x="0"
        y="0.05"
        textAnchor="middle"
        fontSize="0.25"
      >
        {icons[resource]}
      </text>
    </g>
  );
};
```

**Step 4: Verify build**

```bash
yarn build
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: redesign Vertex, Edge, TriangleTile with dark theme and animations"
```

---

## Task 8: Build PlayerSetup (TypeScript Rewrite) and PlayerTurnBar

**Files:**
- Create: `src/app/components/Players/PlayerSetup.tsx` (rewrite from JS)
- Create: `src/app/components/Players/PlayerTurnBar.tsx`
- Delete: `src/app/components/PlayerSetup.js`

**Step 1: Create PlayerSetup.tsx**

Rewrite the existing `PlayerSetup.js` as TypeScript with new dark theme styling:

```tsx
"use client";

import React from "react";

interface Player {
  name: string;
  color: string;
}

interface PlayerSetupProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  numberOfPlayers: number;
}

const COLORS = [
  { name: "Red", value: "#ff0000" },
  { name: "Blue", value: "#0000ff" },
  { name: "Green", value: "#008000" },
  { name: "Brown", value: "#a52a2a" },
  { name: "Orange", value: "#ffa500" },
  { name: "White", value: "#ffffff" },
];

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  players,
  setPlayers,
  numberOfPlayers,
}) => {
  const handleNameChange = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = { ...updated[index], name };
    setPlayers(updated);
  };

  const handleColorChange = (index: number) => {
    const usedColors = players.map((p) => p.color);
    const available = COLORS.filter((c) => !usedColors.includes(c.value) || players[index].color === c.value);
    const currentIdx = available.findIndex((c) => c.value === players[index].color);
    const nextIdx = (currentIdx + 1) % available.length;
    const updated = [...players];
    updated[index] = { ...updated[index], color: available[nextIdx].value };
    setPlayers(updated);
  };

  // Initialize players if needed
  React.useEffect(() => {
    if (players.length !== numberOfPlayers) {
      const newPlayers: Player[] = [];
      for (let i = 0; i < numberOfPlayers; i++) {
        newPlayers.push({
          name: players[i]?.name || `Player ${i + 1}`,
          color: players[i]?.color || COLORS[i % COLORS.length].value,
        });
      }
      setPlayers(newPlayers);
    }
  }, [numberOfPlayers]);

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
        Players
      </h3>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-text-secondary text-xs w-4">{index + 1}</span>
            <input
              type="text"
              value={player.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="flex-1 bg-bg-surface-raised border border-border rounded-lg px-3 py-2
                text-sm text-text-primary placeholder:text-text-secondary/50
                focus:outline-none focus:border-accent-gold/50 transition-colors"
              placeholder={`Player ${index + 1}`}
            />
            <button
              onClick={() => handleColorChange(index)}
              className="w-7 h-7 rounded-full border-2 border-border btn-press shrink-0"
              style={{ backgroundColor: player.color }}
              title="Click to change color"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Step 2: Create PlayerTurnBar.tsx**

Create `src/app/components/Players/PlayerTurnBar.tsx`:

```tsx
"use client";

import React from "react";

interface Player {
  name: string;
  color: string;
}

interface PlayerTurnBarProps {
  currentPlayer: Player;
  onNext: () => void;
  isLastTurn: boolean;
  onReveal: () => void;
}

export const PlayerTurnBar: React.FC<PlayerTurnBarProps> = ({
  currentPlayer,
  onNext,
  isLastTurn,
  onReveal,
}) => {
  return (
    <div
      className="flex items-center justify-between px-4 h-10 border-b border-border transition-colors"
      style={{
        backgroundColor: `${currentPlayer.color}12`,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: currentPlayer.color }}
        />
        <span className="text-sm font-medium text-text-primary">
          {currentPlayer.name}&apos;s Turn
        </span>
      </div>
      <button
        onClick={isLastTurn ? onReveal : onNext}
        className="btn-press text-xs font-semibold px-3 py-1 rounded-lg transition-colors
          bg-bg-surface-raised border border-border hover:border-accent-gold/50 text-text-primary"
      >
        {isLastTurn ? "Reveal All" : "Next →"}
      </button>
    </div>
  );
};
```

**Step 3: Delete old PlayerSetup.js**

```bash
rm src/app/components/PlayerSetup.js
```

**Step 4: Verify build**

```bash
yarn build
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add PlayerSetup (TS rewrite) and PlayerTurnBar components"
```

---

## Task 9: Build Bottom Sheet with Vaul

**Files:**
- Create: `src/app/components/Controls/BottomSheet.tsx`

**Step 1: Create BottomSheet.tsx**

```tsx
"use client";

import React from "react";
import { Drawer } from "vaul";
import type { NumberOfPlayers, Resource } from "../../utils/board";
import { GenerateButton } from "./GenerateButton";
import { PlayerCountPills } from "./PlayerCountPills";
import { ConstraintToggles } from "./ConstraintToggles";
import { ScarceResourcePicker } from "./ScarceResourcePicker";
import { SurpriseToggle } from "./SurpriseToggle";
import { PlayerSetup } from "../Players/PlayerSetup";

interface Player {
  name: string;
  color: string;
}

interface BottomSheetProps {
  numPlayers: NumberOfPlayers;
  onNumPlayersChange: (count: NumberOfPlayers) => void;
  noSameResources: boolean;
  onToggleResources: (value: boolean) => void;
  noSameNumbers: boolean;
  onToggleNumbers: (value: boolean) => void;
  scarceResource: string;
  onScarceChange: (resource: string) => void;
  surpriseMode: boolean;
  onSurpriseToggle: (value: boolean) => void;
  onGenerate: () => void;
  isAnimating: boolean;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  locked?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  numPlayers,
  onNumPlayersChange,
  noSameResources,
  onToggleResources,
  noSameNumbers,
  onToggleNumbers,
  scarceResource,
  onScarceChange,
  surpriseMode,
  onSurpriseToggle,
  onGenerate,
  isAnimating,
  players,
  setPlayers,
  locked,
}) => {
  return (
    <Drawer.Root
      snapPoints={["148px", 0.45, 0.85]}
      activeSnapPoint="148px"
      modal={false}
    >
      <Drawer.Portal>
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-40 flex flex-col rounded-t-2xl bg-bg-surface border-t border-border"
          style={{ maxHeight: "85vh" }}
        >
          {/* Drag Handle */}
          <Drawer.Handle className="mx-auto mt-3 mb-2 w-9 h-1 rounded-full bg-text-secondary/40" />

          {/* Collapsed content - always visible */}
          <div className="px-4 pb-3 flex items-center justify-between gap-3">
            <PlayerCountPills value={numPlayers} onChange={onNumPlayersChange} />
            <GenerateButton onClick={onGenerate} isAnimating={isAnimating} />
          </div>

          {/* Scrollable expanded content */}
          <div className="overflow-y-auto px-4 pb-8 space-y-6">
            <div className="h-px bg-border" />

            <ConstraintToggles
              noSameResources={noSameResources}
              noSameNumbers={noSameNumbers}
              onToggleResources={onToggleResources}
              onToggleNumbers={onToggleNumbers}
            />

            <div className="h-px bg-border" />

            <ScarceResourcePicker value={scarceResource} onChange={onScarceChange} />

            <div className="h-px bg-border" />

            <SurpriseToggle
              enabled={surpriseMode}
              onToggle={onSurpriseToggle}
            />

            <div className="h-px bg-border" />

            {surpriseMode && (
              <PlayerSetup
                players={players}
                setPlayers={setPlayers}
                numberOfPlayers={numPlayers}
              />
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
```

**Step 2: Verify build**

```bash
yarn build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add vaul-powered BottomSheet with snap points"
```

---

## Task 10: Build Responsive Layout Components

**Files:**
- Create: `src/app/components/Layout/SidePanel.tsx`
- Create: `src/app/components/Layout/DesktopLayout.tsx`

**Step 1: Create SidePanel.tsx** (shared by tablet and desktop)

```tsx
"use client";

import React from "react";
import type { NumberOfPlayers } from "../../utils/board";
import { GenerateButton } from "../Controls/GenerateButton";
import { PlayerCountPills } from "../Controls/PlayerCountPills";
import { ConstraintToggles } from "../Controls/ConstraintToggles";
import { ScarceResourcePicker } from "../Controls/ScarceResourcePicker";
import { SurpriseToggle } from "../Controls/SurpriseToggle";
import { PlayerSetup } from "../Players/PlayerSetup";

interface Player {
  name: string;
  color: string;
}

interface SidePanelProps {
  numPlayers: NumberOfPlayers;
  onNumPlayersChange: (count: NumberOfPlayers) => void;
  noSameResources: boolean;
  onToggleResources: (value: boolean) => void;
  noSameNumbers: boolean;
  onToggleNumbers: (value: boolean) => void;
  scarceResource: string;
  onScarceChange: (resource: string) => void;
  surpriseMode: boolean;
  onSurpriseToggle: (value: boolean) => void;
  onGenerate: () => void;
  isAnimating: boolean;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

export const SidePanel: React.FC<SidePanelProps> = (props) => {
  return (
    <div className="h-full overflow-y-auto bg-bg-surface border-l border-border p-5 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <PlayerCountPills value={props.numPlayers} onChange={props.onNumPlayersChange} />
      </div>

      <GenerateButton onClick={props.onGenerate} isAnimating={props.isAnimating} />

      <div className="h-px bg-border" />

      <ConstraintToggles
        noSameResources={props.noSameResources}
        noSameNumbers={props.noSameNumbers}
        onToggleResources={props.onToggleResources}
        onToggleNumbers={props.onToggleNumbers}
      />

      <div className="h-px bg-border" />

      <ScarceResourcePicker value={props.scarceResource} onChange={props.onScarceChange} />

      <div className="h-px bg-border" />

      <SurpriseToggle enabled={props.surpriseMode} onToggle={props.onSurpriseToggle} />

      {props.surpriseMode && (
        <>
          <div className="h-px bg-border" />
          <PlayerSetup
            players={props.players}
            setPlayers={props.setPlayers}
            numberOfPlayers={props.numPlayers}
          />
        </>
      )}
    </div>
  );
};
```

**Step 2: Verify build**

```bash
yarn build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add SidePanel component for tablet/desktop layouts"
```

---

## Task 11: Build Share Actions

**Files:**
- Create: `src/app/components/Share/ShareActions.tsx`
- Create: `src/app/components/Share/Toast.tsx`

**Step 1: Create Toast.tsx**

```tsx
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
```

**Step 2: Create ShareActions.tsx**

```tsx
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
```

**Step 3: Verify build**

```bash
yarn build
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add ShareActions with html-to-image export and Toast"
```

---

## Task 12: Rebuild Main Page with New Layout System

**Files:**
- Modify: `src/app/page.tsx` (complete rewrite)

**Goal:** Wire everything together. The page uses `useMediaLayout` to conditionally render: mobile gets Header + Board + BottomSheet; tablet gets Header + Board + SidePanel; desktop gets Header + SidePanel(left) + Board + SidePanel(right). The board generation logic is imported from `utils/board.ts`. All state stays in page.tsx and is passed down.

**Step 1: Rewrite page.tsx**

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { CatanBoard } from "./components/Map";
import { Header } from "./components/Layout/Header";
import { BottomSheet } from "./components/Controls/BottomSheet";
import { SidePanel } from "./components/Layout/SidePanel";
import { PlayerTurnBar } from "./components/Players/PlayerTurnBar";
import { ShareActions } from "./components/Share/ShareActions";
import { useMediaLayout } from "./hooks/useMediaLayout";
import type { NumberOfPlayers, Resource } from "./utils/board";
import { playerTurns } from "./utils/board";

interface Player {
  name: string;
  color: string;
}

const HomePage = () => {
  const layout = useMediaLayout();
  const boardRef = useRef<HTMLDivElement>(null);

  const [numPlayers, setNumPlayers] = useState<NumberOfPlayers>(4);
  const [noSameResources, setNoSameResources] = useState(false);
  const [noSameNumbers, setNoSameNumbers] = useState(false);
  const [scarceResource, setScarceResource] = useState("");
  const [surpriseMode, setSurpriseMode] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [resetMap, setResetMap] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGenerate = () => {
    setResetMap((prev) => !prev);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  const controlProps = {
    numPlayers,
    onNumPlayersChange: setNumPlayers,
    noSameResources,
    onToggleResources: setNoSameResources,
    noSameNumbers,
    onToggleNumbers: setNoSameNumbers,
    scarceResource,
    onScarceChange: setScarceResource,
    surpriseMode,
    onSurpriseToggle: setSurpriseMode,
    onGenerate: handleGenerate,
    isAnimating,
    players,
    setPlayers,
  };

  // Keyboard shortcut: spacebar to regenerate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        onShare={undefined}
        surpriseMode={surpriseMode && players.length === numPlayers}
      />

      {/* Surprise Mode: Player Turn Bar */}
      {surpriseMode && players.length === numPlayers && (
        <div className="mt-12">
          {/* PlayerTurnBar is rendered inside CatanBoard's parent for now */}
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 flex pt-12 overflow-hidden ${
        layout === "desktop" ? "max-w-[1280px] mx-auto w-full" : ""
      }`}>
        {/* Desktop: Left Panel */}
        {layout === "desktop" && (
          <aside className="w-[280px] shrink-0">
            <SidePanel {...controlProps} />
          </aside>
        )}

        {/* Board Area */}
        <div className="flex-1 flex items-center justify-center relative p-4" ref={boardRef}>
          {/* Vignette overlay */}
          <div className="absolute inset-0 vignette pointer-events-none" />

          <CatanBoard
            numberOfPlayer={numPlayers}
            sameResourcesShouldTouch={!noSameResources}
            sameNumberShouldTouch={!noSameNumbers}
            invertTiles={players.length === numPlayers ? surpriseMode : false}
            scarceResource={scarceResource as Resource}
            reset={resetMap}
            players={players}
          />
        </div>

        {/* Tablet: Right Panel */}
        {layout === "tablet" && (
          <aside className="w-[300px] shrink-0">
            <SidePanel {...controlProps} />
          </aside>
        )}

        {/* Desktop: Right Panel (Players only) */}
        {layout === "desktop" && surpriseMode && (
          <aside className="w-[260px] shrink-0 bg-bg-surface border-l border-border p-5">
            {/* Player-specific info for desktop */}
          </aside>
        )}
      </main>

      {/* Mobile: Bottom Sheet */}
      {layout === "mobile" && <BottomSheet {...controlProps} />}

      {/* Share floating button for mobile */}
      {layout === "mobile" && (
        <div className="fixed top-2 right-2 z-50">
          <ShareActions boardRef={boardRef} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
```

**Step 2: Verify build**

```bash
yarn build
```

**Step 3: Verify dev server runs**

```bash
yarn dev
```

Open http://localhost:3000 and verify:
- Dark background renders
- Board displays
- Bottom sheet appears on mobile viewport
- Side panel appears on wider viewport
- Generate button works

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: rebuild page.tsx with responsive layout system"
```

---

## Task 13: Add CSS Animations File

**Files:**
- Create: `src/app/animations.css`
- Modify: `src/app/globals.css` (import animations)

**Step 1: Create animations.css**

```css
/* Board generation animations */
@keyframes tile-enter {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes number-drop {
  0% {
    transform: scale(0) translateY(-4px);
    opacity: 0;
  }
  70% {
    transform: scale(1.15) translateY(0);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes road-draw {
  from {
    stroke-dashoffset: var(--road-length);
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Shimmer for generate button */
@keyframes shimmer-sweep {
  0% {
    transform: translateX(-100%);
  }
  50%, 100% {
    transform: translateX(100%);
  }
}

/* Border loading animation */
@keyframes border-sweep {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  50% {
    clip-path: inset(0 0 0 0);
  }
  100% {
    clip-path: inset(0 0 0 100%);
  }
}

/* Caustic light effect for hidden tiles */
@keyframes caustic {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
}

/* Fade up for toasts and sheet content */
@keyframes fade-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Pulse glow for interactive elements */
@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 2px rgba(212, 165, 70, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(212, 165, 70, 0.5));
  }
}

/* Camera flash for share */
@keyframes camera-flash {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

/* Wave animation for sea border */
@keyframes wave {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Tile shake for errors */
@keyframes tile-shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-3px);
  }
  40%, 80% {
    transform: translateX(3px);
  }
}
```

**Step 2: Import in globals.css**

Add to the top of `src/app/globals.css`, after the tailwind imports:

```css
@import "./animations.css";
```

**Step 3: Verify build**

```bash
yarn build
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add CSS keyframe animations for board, tiles, and interactions"
```

---

## Task 14: Visual Polish & Integration Testing

**Files:**
- Modify: Various files for polish and bug fixes

**Step 1: Run dev server and test all viewports**

```bash
yarn dev
```

Test in browser at:
- Mobile: 375px width (iPhone SE)
- Tablet: 768px width (iPad)
- Desktop: 1280px width

**Step 2: Check and fix any issues with:**

- [ ] Dark theme renders correctly (no blue-100 remnants)
- [ ] Bottom sheet opens/closes with snap points on mobile
- [ ] Side panel renders on tablet
- [ ] Three-column layout on desktop
- [ ] Generate button creates new board
- [ ] Resource colors match new design tokens
- [ ] Number tokens show with dark circles
- [ ] High probability numbers (6, 8) show in red
- [ ] Ports render correctly
- [ ] Player count switching works
- [ ] Constraint toggles work
- [ ] Scarce resource picker works
- [ ] Surprise mode toggle works
- [ ] Player setup form appears when surprise mode enabled
- [ ] Share button generates image (test on both mobile and desktop)
- [ ] Toast notifications appear and auto-dismiss
- [ ] Spacebar shortcut regenerates board on desktop

**Step 3: Fix any remaining TypeScript errors**

```bash
yarn build
```

Expected: Clean build with zero errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: visual polish and integration fixes across all viewports"
```

---

## Task 15: Update PWA Manifest & Meta Tags

**Files:**
- Modify: `src/app/manifest.ts`
- Modify: `public/manifest.json`

**Step 1: Update manifest.ts with new theme**

Update the theme color and background color to match the dark theme:

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Catan Map Generator",
    short_name: "CatanMapGen",
    description: "Generate randomized Catan game boards",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0F",
    theme_color: "#0D0D0F",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
```

**Step 2: Verify build**

```bash
yarn build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: update PWA manifest with dark theme colors"
```

---

## Task 16: Final Build Verification & Cleanup

**Step 1: Clean build**

```bash
rm -rf .next
yarn build
```

Expected: Clean build, no warnings about unused variables or imports.

**Step 2: Lint**

```bash
yarn lint
```

Fix any lint errors.

**Step 3: Remove any dead code**

- Check for unused imports
- Remove `src/app/styles/` directory if still exists
- Remove any commented-out code from the refactor

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup, lint fixes, and dead code removal"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Dependencies + Theme Config | package.json, tailwind.config.ts, globals.css |
| 2 | Extract Board Logic | utils/board.ts |
| 3 | Shared Hooks | hooks/useMediaLayout.ts, hooks/useBoardAnimation.ts |
| 4 | Header Component | Layout/Header.tsx |
| 5 | Control Components (5 files) | Controls/*.tsx |
| 6 | Redesign HexTile | HexTile.tsx |
| 7 | Redesign Vertex/Edge/Port | Vertex.tsx, Edge.tsx, TriangleTile.tsx |
| 8 | Player Components | Players/PlayerSetup.tsx, Players/PlayerTurnBar.tsx |
| 9 | Bottom Sheet (vaul) | Controls/BottomSheet.tsx |
| 10 | Responsive Layouts | Layout/SidePanel.tsx |
| 11 | Share & Toast | Share/ShareActions.tsx, Share/Toast.tsx |
| 12 | Rebuild Main Page | page.tsx |
| 13 | CSS Animations | animations.css |
| 14 | Visual Polish & Testing | Various |
| 15 | PWA Manifest Update | manifest.ts |
| 16 | Final Cleanup | Various |
