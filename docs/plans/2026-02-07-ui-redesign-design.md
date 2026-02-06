# Catan Map Generator — UI/UX Redesign

**Date:** 2026-02-07
**Goal:** Redesign the app with Apple game-companion-app quality, targeting phone-first (phone > tablet > desktop) with a dark immersive + warm Catan-themed aesthetic. The app should feel premium, delightful, and share-worthy — something people screenshot and send to their Catan group chat.

---

## Design Principles

- **Phone-first, single page** — Everything on one screen with instant feedback. Controls adapt their container (bottom sheet on mobile, side panel on tablet, split panels on desktop) but the board is always the hero
- **Set once, generate many** — Settings are configured once per session then tucked away. The Generate button is always one tap away
- **Wow factor for shareability** — Full animation treatment: tile build sequences, 3D flips, particle effects, caustic shimmers. People should want to show this to friends
- **Apple-level craft** — Every interaction has weight, every transition has purpose, every pixel is intentional

---

## 1. Visual Foundation & Theme

### Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#0D0D0F` | Root background, deep charcoal with warm undertone |
| `--bg-surface` | `#1A1714` | Cards, sheets, panels |
| `--bg-surface-raised` | `#242019` | Elevated surfaces, hover states |
| `--accent-gold` | `#D4A546` | Primary actions, Generate button, active states |
| `--accent-gold-dark` | `#B8922E` | Gold gradient end, pressed states |
| `--text-primary` | `#F0E6D6` | Warm off-white, main text |
| `--text-secondary` | `#9B8B6E` | Muted gold, labels, hints |
| `--border` | `#2A2520` | Dividers, subtle borders |

### Resource Colors (Glowing Variants)

| Resource | Hex | Effect |
|----------|-----|--------|
| Brick | `#E85D4A` | Ember red, subtle inner glow |
| Wheat | `#E8C44A` | Warm amber |
| Ore | `#8A9BAE` | Cool silver-blue, metallic sheen |
| Wood | `#4A9B5A` | Rich forest green |
| Sheep | `#8BBF7A` | Sage green |
| Desert | `#C4956A` | Sandy gold |
| Sea/Hidden | `#1A6B6B` | Deep teal, shimmer animation |

### Player Colors

Red (`#ff0000`), Blue (`#0000ff`), Green (`#008000`), Brown (`#a52a2a`), Orange (`#ffa500`), White (`#ffffff`), Yellow (`#ffff00`) — unchanged from current.

### Typography

- **Headlines:** SF Pro Display / Inter (web fallback), semibold, slight letter-spacing
- **Body/labels:** SF Pro Text / Inter, medium weight
- **Tile numbers:** Tabular numerals, bold, subtle text-shadow for readability

### Elevation & Depth

- No flat cards — everything uses warm-toned box shadows for layered depth
- Interactive elements have faint golden rim-light on focus/active
- Board area has a radial gradient vignette pushing focus to center

---

## 2. Layout Architecture

### Mobile (< 640px) — Primary Experience

```
┌─────────────────────────┐
│  Status Bar (system)    │
├─────────────────────────┤
│  App Header             │  48px: Logo mark + minimal action icons
├─────────────────────────┤
│                         │
│                         │
│     HEX BOARD           │  Takes all remaining space
│     (SVG canvas)        │  Centered, padded, breathable
│                         │  Pinch-to-zoom enabled
│                         │
│                         │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │  ── drag handle ──│  │  Bottom sheet (collapsed)
│  │  [4] [5] [6]      │  │  Player count pills + Generate CTA
│  │  [✦ Generate Map]  │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

**Bottom sheet — three snap points:**

- **Collapsed (~120px):** Generate button + player count pills only. The "set once, generate many" state
- **Half-open (~45%):** Constraint toggles, scarce resource picker, Surprise Mode toggle
- **Full-open (~85%):** Player setup (names, colors), share/export options. Board dims behind with dark overlay

### Tablet (640px–1024px)

```
┌──────────────────────────────────────┐
│  App Header                          │
├──────────────────────────────────────┤
│                    │                 │
│                    │  Side Panel     │
│    HEX BOARD       │  (always open)  │
│    65% width       │  35% width     │
│                    │                 │
│                    │  All controls   │
│                    │  vertically     │
│                    │  stacked        │
│                    │                 │
└──────────────────────────────────────┘
```

- Side panel replaces bottom sheet — no swiping needed, all controls visible
- Panel has own scroll if content overflows
- Board scales up, no pinch-zoom needed

### Desktop (> 1024px)

```
┌───────────────────────────────────────────────┐
│  App Header (centered, max-width 1280px)      │
├───────────────────────────────────────────────┤
│           │                    │              │
│  Quick    │                    │   Player     │
│  Controls │    HEX BOARD       │   Setup &    │
│  20%      │    50%             │   Info 30%   │
│           │                    │              │
│  Count    │                    │  Names       │
│  Generate │                    │  Colors      │
│  Toggles  │                    │  Surprise    │
│           │                    │  Share       │
└───────────────────────────────────────────────┘
```

- Three-column layout, max-width container centered
- Dark background extends full bleed, content is contained

---

## 3. Interactions & Animations

### Board Generation — The Hero Moment

1. **Tiles ripple in** from center outward in concentric rings (100ms stagger per ring). Each tile starts at scale 0 + opacity 0, springs into place with overshoot bounce
2. **Resource colors fade in** 200ms after each tile lands, washing across the hex like watercolor
3. **Number tokens drop in** last with scale-bounce, staggered randomly (not uniform — feels organic)
4. **Ports slide in** from board edges with gentle deceleration

Total sequence: ~1.2s. Fast enough for repeated generates, delightful enough to share.

**Quick-regenerate:** After first generate, shake gesture (mobile) or spacebar (desktop) triggers a faster ~0.6s animation where tiles flip/rotate to new resources instead of full rebuild.

### Bottom Sheet Interactions (Mobile)

- Drag handle has subtle pulse glow on first load hinting "pull me up"
- Physics-based spring momentum with rubber-band overscroll
- Background board blurs and dims progressively (0% at collapsed → 40% blur at full)
- Snap points have micro-bounce at detent
- Swipe past collapsed → minimal floating Generate button in bottom-right, board gets 100% screen

### Control Interactions

- **Player count pills:** Scale-press animation (0.95 → 1.0), active pill gets golden rim-light. Switching count morphs board — existing tiles reposition, new tiles animate in/out
- **Constraint toggles:** Custom toggle with warm amber glow state. Toggling on sends golden ripple across board tiles
- **Scarce resource picker:** Tapping a resource icon pulses that resource type across all board tiles
- **Generate button:** Golden gradient, compresses on press with radial light burst on release. Animated gradient shimmer sweeps across it every 5s when idle

### Surprise Mode Animations

- **Activating:** Wave animation flips all tiles face-down (Y-axis 180deg rotation, center-outward ripple), revealing teal-shimmer backs
- **Hidden tile surface:** Animated caustic light effect (2-3s CSS loop, each tile offset so they don't pulse in unison)
- **Revealing a tile (tap):** 3D Y-axis flip with white flash at midpoint, resource color appears, number token drops in. Neighbors get subtle nudge reaction
- **Settlement placement:** Marker scales from 0 with golden particle burst, player color radiates outward
- **Exiting:** Cascade reveal of remaining tiles, teal mood fades to standard theme over ~500ms

### Micro-interactions

- All button presses: 0.96 scale-down with spring-back
- Sheet content: Fade up with 20px translate, staggered
- Share action: Camera-flash overlay → "Map copied!" toast with checkmark animation
- Error states: Tiles shake side-to-side (iOS wrong-password style) before retrying
- Generate loading: Button border becomes animated gradient sweep

### Performance Guardrails

- All animations use CSS transforms and opacity only (GPU-accelerated)
- `prefers-reduced-motion` disables decorative animations, keeps functional transitions
- Animations skip after 3rd consecutive quick-regenerate (instant swap)

---

## 4. Component Design Details

### App Header (48px, fixed top)

- **Left:** Minimal hexagon logo with golden gradient outline. No text on mobile, "Catan Map Generator" on tablet/desktop
- **Right:** Share icon + info icon. Muted gold (`#9B8B6E`), brighten to full gold on tap
- Translucent dark blur backdrop (`backdrop-filter: blur(12px)`)
- Thin 1px bottom border in `#2A2520` with faint warm glow

### Hex Board Canvas

- Subtle circular radial gradient background creating vignette
- 1px gap between tiles (separated, premium feel)
- Each hex has subtle inner shadow ("pressed into table" depth)
- Number tokens: 30px circles with drop shadow. Red numbers (6, 8) use ember red with subtle pulsing glow
- Ports: Small rounded badges on board edge with resource icon, connected by thin dashed golden line
- Sea border: Dark teal with slow-moving wave pattern (CSS animated gradient)

### Bottom Sheet Contents

**Collapsed (~120px):**
- Drag handle: 4px x 36px rounded bar, muted gold
- Player count: 40px rounded capsules. Active = golden fill + dark text
- Generate button: Golden gradient, rounded-xl, bold text, ~55% width

**Half-open (~45%):**
- Sections divided by thin lines with small-caps muted gold headings
- Constraint toggles: 48px wide, dark track, golden thumb when active, inner shadow on track
- Scarce resource icons: 36px circles in resource color, golden outer ring when selected

**Full-open (~85%):**
- Player name inputs: Dark surface, warm border, rounded. 20px color indicator circle
- Color dots tappable to cycle available colors
- Add/remove player rows animate with smooth height transitions
- Share buttons: "Copy Map" + "Share" side by side

### Tablet/Desktop Panels

Same content hierarchy as bottom sheet but with more breathing room. Generate button full-width within panel. Desktop splits: left panel (count + generate + constraints), right panel (players + surprise + share).

---

## 5. Surprise Mode — Dedicated Game State

### Mode Activation

- Header gains animated gradient border-bottom (gold ↔ teal shift)
- Small pulsing "SURPRISE" badge next to logo
- Bottom sheet auto-collapses and locks. Lock icon on drag handle. Tap shows toast: "Settings locked during Surprise Mode"

### Hidden Board State

- All tiles show teal-shimmer back face with caustic light animation (offset per tile)
- Number tokens replaced with "?" glyph in muted teal
- Sea area deepens to darker teal

### Player Turn Bar (new element, 40px, below header)

```
┌─────────────────────────────────┐
│  🔴 Player 1's Turn         ▶  │
└─────────────────────────────────┘
```

- Current player's color dot + name + "Next" arrow
- Background tints to player color at ~8% opacity
- "Next" slides current bar left, new player slides in from right

### Settlement Placement Flow

1. Available vertices glow faintly in current player's color, pulsing
2. Tap vertex → settlement marker appears with golden particle burst
3. Adjacent tiles auto-reveal with 3D flip (150ms stagger) — the magical moment
4. Available edges connected to settlement glow for road placement
5. Tap edge → road draws with SVG stroke-dashoffset line-draw animation (~300ms)

### Exiting Surprise Mode

- Tap-and-hold lock icon to unlock sheet (prevents accidental exit)
- Toggle off → cascade reveal of remaining tiles (center-outward wave)
- Teal mood fades to standard theme over ~500ms
- Player Turn Bar slides down and disappears

---

## 6. Share & Export

### Quick Share (header icon)

1. Board does camera-shutter white flash (~150ms)
2. Generates clean PNG of board only (no UI chrome) at 2x resolution
3. Opens native share sheet via Web Share API
4. Fallback: copies to clipboard with toast confirmation

### Copy Map (in sheet)

- Generates text summary: "4-player Catan | No same resources | Scarce: Ore, Brick" + simplified grid
- Copies to clipboard for pasting in group chats

### Share Image Watermark

- Subtle bottom-right watermark: hex logo + "catanmapgen.app" in 8px muted text
- Organic growth engine — recipients see where the map came from

---

## 7. Accessibility

- All touch targets minimum 44px (Apple HIG)
- Color contrast WCAG AA (warm off-white on dark = 7:1+)
- Number tokens always on contrasting circle for readability regardless of tile color
- `prefers-reduced-motion`: Decorative animations disabled, functional transitions reduce to 200ms fades
- No light theme in v1 — dark theme is the brand
- SVG `aria-label` on tiles ("Brick tile, number 8"), `role="img"` on board
- Keyboard navigation on desktop: Tab through controls, Enter to generate

---

## 8. Performance

- **First paint:** < 1.5s on 3G. Dark background + header renders instantly, board shows skeleton shimmer
- **Generation + animation:** < 200ms algorithm + 1.2s animation (CSS/transform driven)
- **Bundle:** Silk ~8KB gz + html-to-image ~3KB gz. Total JS < 100KB
- **SVG:** Keep current approach. `will-change: transform` on animating tiles, removed after completion
- **Image export:** `html-to-image` generates PNG on-demand only

---

## 9. Tech Approach

### New Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `@silk-hq/components` | Swipeable bottom sheet with snap detents | ~8KB gz |
| `html-to-image` | Board PNG export for sharing | ~3KB gz |

Everything else: Tailwind CSS + native browser APIs. No animation library for v1.

### Responsive Strategy

- Tailwind breakpoints: `sm:640px`, `md:768px`, `lg:1024px`
- Container queries (`@container`) on main content area for board layout
- `useMediaLayout` hook returns `'mobile' | 'tablet' | 'desktop'`

### State Management

- Keep React `useState` — app state is simple enough
- New `useSurpriseMode` hook for Surprise Mode state logic

---

## 10. File Structure

```
src/app/
├── components/
│   ├── Board/
│   │   ├── Board.tsx            SVG container + layout logic (from Map.tsx)
│   │   ├── HexTile.tsx          Enhanced with animations
│   │   ├── TriangleTile.tsx     Port badges redesign
│   │   ├── Vertex.tsx           Settlement placement
│   │   └── Edge.tsx             Road drawing
│   ├── Controls/
│   │   ├── BottomSheet.tsx      Silk sheet wrapper
│   │   ├── GenerateButton.tsx
│   │   ├── PlayerCountPills.tsx
│   │   ├── ConstraintToggles.tsx
│   │   ├── ScarceResourcePicker.tsx
│   │   └── SurpriseToggle.tsx
│   ├── Players/
│   │   ├── PlayerSetup.tsx      Rewrite from .js to .tsx
│   │   └── PlayerTurnBar.tsx
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── MobileLayout.tsx
│   │   ├── TabletLayout.tsx
│   │   └── DesktopLayout.tsx
│   └── Share/
│       └── ShareActions.tsx
├── styles/
│   ├── globals.css              Tailwind + CSS custom properties
│   └── animations.css           All keyframe definitions
└── hooks/
    ├── useMediaLayout.ts        Returns 'mobile'|'tablet'|'desktop'
    └── useSurpriseMode.ts       Surprise mode state logic
```

---

## Summary

This redesign transforms the Catan Map Generator from a functional tool into a premium game companion experience. The dark-immersive-Catan theme, physics-based interactions, and cinematic board generation animation create the "wow" factor needed for organic sharing and repeat usage. The responsive architecture ensures the experience is optimized for the primary use case (phone at the game table) while scaling gracefully to tablet and desktop.
