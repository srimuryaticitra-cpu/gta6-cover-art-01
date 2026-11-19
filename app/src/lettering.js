// Bold cover lettering: a main title with a gradient fill, a dark outline
// and a slight tilt, a smaller subtitle line, and a badge ribbon carrying
// the invented place name. Lettering is drawn with the system sans-serif in
// bold, so the app ships no font file at all.

/** Shrinks `size` until `text` fits `maxWidth`, then returns the size. */
export function fitTextSize(ctx, text, size, maxWidth, weight = 'bold') {
  let s = size;
  ctx.font = `${weight} ${s}px system-ui, sans-serif`;
  while (ctx.measureText(text).width > maxWidth && s > 10) {
    s -= 2;
    ctx.font = `${weight} ${s}px system-ui, sans-serif`;
  }
  return s;
}

/** Draws the main title, centred in `zone`, tilted a touch, with a gradient fill. */
export function drawTitle(ctx, text, zone, grade) {
  const words = (text || 'TELUK KURA').trim().toUpperCase();
  if (!words) return;
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h * 0.42;
  const maxW = zone.w * 0.96;
  let size = Math.round(zone.h * 0.52);
  size = fitTextSize(ctx, words, size, maxW);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.022); // a slight poster tilt
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${size}px system-ui, sans-serif`;
  const grad = ctx.createLinearGradient(0, -size * 0.55, 0, size * 0.55);
  grad.addColorStop(0, grade.titleTop);
  grad.addColorStop(1, grade.titleBottom);
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(3, size * 0.09);
  ctx.strokeStyle = grade.titleOutline;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = size * 0.16;
  ctx.shadowOffsetY = size * 0.05;
  ctx.strokeText(words, 0, 0);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = grad;
  ctx.fillText(words, 0, 0);
  // A thin bright edge on the top of the letters.
  ctx.lineWidth = Math.max(1, size * 0.015);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.strokeText(words, 0, -size * 0.02);
  ctx.restore();
}

/** Draws the subtitle in spaced capitals under the title. */
export function drawSubtitle(ctx, text, zone, grade) {
  const line = (text || '').trim();
  if (!line) return;
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h * 0.78;
  const maxW = zone.w * 0.9;
  let size = Math.round(zone.h * 0.13);
  // Letter-spacing by hand: canvas has no letterSpacing everywhere, so join with thin spaces.
  const spaced = line.toUpperCase().split('').join(' ');
  size = fitTextSize(ctx, spaced, size, maxW, '700');
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${size}px system-ui, sans-serif`;
  ctx.lineWidth = Math.max(2, size * 0.14);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.strokeText(spaced, cx, cy);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(spaced, cx, cy);
  ctx.restore();
}

/** Draws the badge ribbon: a slanted strip with the place name in it. */
export function drawBadge(ctx, text, zone, grade) {
  const label = (text || 'NEON SHORE').trim().toUpperCase();
  if (!label) return;
  const h = zone.h;
  const pad = h * 0.5;
  ctx.save();
  ctx.font = `800 ${Math.round(h * 0.52)}px system-ui, sans-serif`;
  const tw = ctx.measureText(label).width;
  const w = tw + pad * 2;
  ctx.translate(zone.x, zone.y);
  ctx.rotate(-0.03);
  // Ribbon body with notched ends.
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w - h * 0.35, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, grade.accent);
  grad.addColorStop(1, grade.titleBottom);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = Math.max(2, h * 0.08);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.stroke();
  ctx.fillStyle = grade.titleOutline;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, w / 2, h * 0.54);
  ctx.restore();
}
