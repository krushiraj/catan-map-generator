# Map Sharing via URL

## Overview

Add the ability to share a Catan board via URL. A share button serializes the current map state into a compact encoded string, appends it as a query parameter, and lets the user share the link. Opening the link reconstructs the exact same board.

## Serialization & Encoding

### Encoding Scheme

- **Resource** → single char: `w`(wood), `b`(brick), `o`(ore), `h`(hay), `s`(sheep), `d`(desert)
- **Each hex** → `{resourceChar}{number}` (e.g. `w5` = wood with 5, `d0` = desert with no number)
- **Hexes** joined by `-` delimiter
- **Settings** prefix: `{playerCount}{sameResourceFlag}{sameNumberFlag}{scarceResourceChar}`
  - Flags: `1` = on, `0` = off
  - Scarce resource: single char or `n` for none
  - Example: `410w` = 4 players, same-resource constraint on, same-number off, scarce=wood
- **Placements** (optional): houses and roads encoded as-is (stored as `"x,y#color"` and `"x1,y1-x2,y2#color"` strings), joined by `;`

### Final Format

```
settings|hex0-hex1-hex2-...|houses;roads
```

The whole string is Base64-encoded and set as `?m=<base64>`.

The placements segment is omitted if the user opts out of sharing them.

### Functions

- `encodeMap(board, settings, placements?) → string` — returns Base64-encoded string
- `decodeMap(encoded) → { board, settings, placements? }` — parses and returns structured data

Both live in `src/app/utils/mapEncoding.ts`.

## Share Flow (Sender)

1. User clicks the **Share** button in the control panel
2. A **toggle** is shown: "Include placements" — defaults to ON if in surprise mode, OFF otherwise
3. `encodeMap()` builds the encoded string based on toggle state
4. Full URL constructed: `${window.location.origin}?m=${encoded}`
5. Try `navigator.share({ url })` (native Web Share API for mobile)
6. Fallback: `navigator.clipboard.writeText(url)` + toast "Link copied!"

## URL Parsing & Reconstruction (Receiver)

On page load:

1. Check `window.location.search` for `m` parameter
2. If present, Base64-decode and split by `|`
3. Parse settings → set `numPlayers`, constraint flags, scarce resource
4. Parse hex string → call `createInitialBoard()` for positions/adjacency, override each hex's `resource` and `number` from decoded data
5. If placements segment exists → restore `houses`, `roads`, `playerPlacements` state
6. Skip the automatic `generateMap()` call on mount
7. Clean URL with `window.history.replaceState`

### Error Handling

If the `m` param is malformed or decoding fails:
- Show a toast: "Shared map link was invalid, generated a new map"
- Fall back to generating a fresh random map

## UI Changes

- **Share button**: in control panel, styled consistently with existing buttons
- **Toggle**: "Include placements" next to share button, ON by default in surprise mode
- **Toast component**: small auto-dismissing notification for "Link copied!" and error messages

## Files to Modify

| File | Change |
|------|--------|
| `src/app/utils/mapEncoding.ts` | **New.** `encodeMap()` and `decodeMap()` functions |
| `src/app/components/Map.tsx` | Share button, toggle, share flow, URL param reading on mount |
| `src/app/page.tsx` | Minor — pass URL params if needed |
| Toast component (new or inline) | Auto-dismiss toast for feedback messages |

## Constraints

- No new dependencies
- No backend / database
- No routing changes
- Fully client-side
- Map is editable after loading from shared URL
