// The cover renderer: composes one cover at any size from the editor state.
// Order of the painting: sky gradient, striped sun, photo panels, palm
// silhouettes, title, subtitle, badge ribbon, then halftone, light leak,
// grain and vignette over the whole cover.

import { layoutPanels } from './layouts.js';
import { gradeById } from './grades.js';
import { drawPanelPhoto, drawPanelFrame } from './panels.js';
import { drawStripedSun, drawPalm, drawHalftone, drawGrain, drawVignette, drawLightLeak } from './art.js';
import { drawTitle, drawSubtitle, drawBadge } from './lettering.js';

/**
 * Draws the full cover onto `canvas` at its own size.
 * state: { layout, grade, title, subtitle, place, photos, panels }
 * panels: [{ photo, zoom, pan: {x, y} }] — one entry per layout panel.
 */
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const grade = gradeById(state.grade);
  const geo = layoutPanels(state.layout, w, h);
  const frame = Math.max(3, Math.round(Math.min(w, h) * 0.008));

  // Sky: the grade's gradient fills the whole cover first.
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, grade.skyTop);
  sky.addColorStop(0.55, grade.skyBottom);
  sky.addColorStop(1, grade.skyTop);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Striped sun, high in the sky band, half-hidden behind the panels.
  const sunR = Math.round(Math.min(w, h) * 0.115);
  const sunX = Math.round(w * 0.72);
  const sunY = Math.round(geo.sky.h * 0.62);
  drawStripedSun(ctx, sunX, sunY, sunR, grade.sunCore, grade.sunRing);

  // Photo panels, each with its grade tint and a white poster frame.
  geo.panels.forEach((r, i) => {
    const slot = state.panels[i] ?? { photo: -1, zoom: 1, pan: { x: 0, y: 0 } };
    const photo = slot.photo >= 0 ? state.photos[slot.photo] : null;
    drawPanelPhoto(ctx, photo, r, slot.pan, slot.zoom, grade);
    drawPanelFrame(ctx, r, frame);
  });

  // Palm silhouettes lean in from the lower corners, over the panels.
  const palmS = Math.min(w, h) / 1080;
  ctx.save();
  ctx.globalAlpha = 0.92;
  drawPalm(ctx, w * 0.01, h * 0.99, palmS * 1.3, 0.10, 'rgba(12, 8, 24, 0.88)');
  drawPalm(ctx, w * 0.99, h * 0.99, palmS * 1.05, -0.14, 'rgba(12, 8, 24, 0.88)');
  ctx.restore();

  // Lettering: title, subtitle and the place badge.
  drawTitle(ctx, state.title, geo.title, grade);
  drawSubtitle(ctx, state.subtitle, geo.title, grade);
  drawBadge(ctx, state.place, geo.badge, grade);

  // Finishing effects over everything.
  drawHalftone(ctx, w * 0.04, geo.sky.y + geo.sky.h * 0.1, w * 0.4, geo.sky.h * 0.85, '#ffffff', 20261119);
  drawLightLeak(ctx, w, h, grade.sunCore);
  drawGrain(ctx, w, h, 20261119);
  drawVignette(ctx, w, h);
}

/** Builds the default editor state: two sample photos, Sunset grade, Hero + Three. */
export function defaultState(photos) {
  return {
    layout: 'hero3',
    grade: 'sunset',
    title: 'TELUK KURA',
    subtitle: 'A slow heist in the neon sun',
    place: 'NEON SHORE',
    photos: photos ?? [],
    panels: [
      { photo: 0, zoom: 1, pan: { x: 0, y: 0 } },
      { photo: 1, zoom: 1, pan: { x: 0, y: 0 } },
      { photo: 0, zoom: 1.15, pan: { x: 0, y: 0 } },
      { photo: 1, zoom: 1.15, pan: { x: 0, y: 0 } },
    ],
  };
}
