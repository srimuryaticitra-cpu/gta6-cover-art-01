// Fixed scenes for screenshots: ?shot=cover shows the cover alone at a post
// size, ?shot=editor shows the editor with a photo loaded. Query keys:
// photo (pier or boulevard, the first sample), photo2 (the second sample),
// layout (hero3, four, strip, bleed), grade (sunset, neon, golden, teal,
// mono), size (square, portrait, wide), title, subtitle, place.
// window.__shotReady is set once the scene has painted.

import { EXPORT_SIZES } from './export.js';

/** Reads the screenshot scene out of the page's query string. */
export function shotScene() {
  const q = new URLSearchParams(location.search);
  const shot = q.get('shot');
  if (!shot) return null;
  const size = EXPORT_SIZES.find((s) => s.id === (q.get('size') ?? 'square')) ?? EXPORT_SIZES[0];
  return {
    kind: shot,
    size,
    photo: q.get('photo') ?? 'pier',
    photo2: q.get('photo2') ?? 'boulevard',
    layout: q.get('layout') ?? 'hero3',
    grade: q.get('grade') ?? 'sunset',
    title: q.get('title') ?? 'TELUK KURA',
    subtitle: q.get('subtitle') ?? 'A slow heist in the neon sun',
    place: q.get('place') ?? 'NEON SHORE',
  };
}

/** Marks the scene painted, on the next two frames, for the screenshot tool. */
export function markShotReady() {
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}

/** Hides the editor chrome so a cover shot shows the cover alone. */
export function hideEditorForCoverShot() {
  document.body.classList.add('shot-cover');
}
