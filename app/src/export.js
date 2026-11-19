// PNG export: renders the cover off-screen at a post size and downloads it.
// The three common post sizes, plus an "export all three" that saves each in turn.

import { drawCover } from './cover.js';

export const EXPORT_SIZES = [
  { id: 'square', name: 'Square 1080 x 1080', w: 1080, h: 1080 },
  { id: 'portrait', name: 'Portrait 1080 x 1350', w: 1080, h: 1350 },
  { id: 'wide', name: 'Wide 1920 x 1080', w: 1920, h: 1080 },
];

/** Renders the cover at (w, h) and resolves to a PNG blob. */
export function renderCoverBlob(state, w, h) {
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  drawCover(off, state);
  return new Promise((resolve) => off.toBlob(resolve, 'image/png'));
}

/** Downloads a blob under `filename`. */
export function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/** Exports one size and reports the saved file name. */
export async function exportCover(state, size, onDone) {
  const blob = await renderCoverBlob(state, size.w, size.h);
  const filename = `kura-cover-${size.w}x${size.h}.png`;
  downloadBlob(blob, filename);
  if (onDone) onDone(`Saved ${filename}`);
  return filename;
}

/** Exports all three post sizes, one after another. */
export async function exportAllCovers(state, onDone) {
  const names = [];
  for (const size of EXPORT_SIZES) {
    names.push(await exportCover(state, size));
    // A breath between downloads so the browser keeps each one.
    await new Promise((r) => setTimeout(r, 350));
  }
  if (onDone) onDone(`Saved ${names.join(', ')}`);
  return names;
}
