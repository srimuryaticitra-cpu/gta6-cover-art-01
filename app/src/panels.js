// Panel photos: how one photo fills one panel. A panel holds a photo
// index, a zoom and a pan offset; the photo is drawn cover-fit (it always
// fills the panel), then the grade tint is laid over it. Dragging a panel
// pans its photo, a slider zooms it.

/** Draws `photo` into panel rect `r`, cover-fit, with pan and zoom. */
export function drawPanelPhoto(ctx, photo, r, pan, zoom, grade) {
  if (!photo) {
    // Empty panel: a soft placeholder the editor replaces once a photo lands.
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.setLineDash([10, 8]);
    ctx.lineWidth = 2;
    ctx.strokeRect(r.x + 6, r.y + 6, r.w - 12, r.h - 12);
    ctx.restore();
    return;
  }
  const iw = photo.naturalWidth;
  const ih = photo.naturalHeight;
  const base = Math.max(r.w / iw, r.h / ih);
  const scale = base * (zoom || 1);
  const pw = iw * scale;
  const ph = ih * scale;
  // Pan is a fraction of the overflow: 0 centres the photo, ±1 pushes it to an edge.
  const ox = (pw - r.w) / 2;
  const oy = (ph - r.h) / 2;
  const dx = r.x + (r.w - pw) / 2 - (pan?.x ?? 0) * ox;
  const dy = r.y + (r.h - ph) / 2 - (pan?.y ?? 0) * oy;
  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();
  ctx.filter = grade?.filter ?? 'none';
  ctx.drawImage(photo, dx, dy, pw, ph);
  ctx.filter = 'none';
  // Grade tint: a warm wash over the photo, deeper toward its foot.
  const tint = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
  tint.addColorStop(0, grade?.tint ?? 'rgba(255, 94, 120, 0.18)');
  tint.addColorStop(1, grade?.tintDeep ?? 'rgba(255, 126, 95, 0.14)');
  ctx.fillStyle = tint;
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.restore();
}

/** A white frame around a panel, like a poster collage. */
export function drawPanelFrame(ctx, r, width) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = width;
  ctx.strokeRect(r.x + width / 2, r.y + width / 2, r.w - width, r.h - width);
  ctx.restore();
}

/** The panel (if any) whose rect holds point (x, y). */
export function panelAt(panels, x, y) {
  for (let i = panels.length - 1; i >= 0; i--) {
    const r = panels[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
  }
  return -1;
}
