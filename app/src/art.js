// Procedural cover art, drawn in code: a retro striped sun disc, palm
// silhouettes, halftone dots, film grain, a vignette and a light leak. All
// original shapes — no borrowed artwork. A tiny seeded generator keeps the
// grain and halftone identical on every render of the same cover.

/** A small deterministic generator (mulberry32) so art never flickers. */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A retro sun disc with horizontal slits, centred at (cx, cy), radius r. */
export function drawStripedSun(ctx, cx, cy, r, core, ring) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const grad = ctx.createLinearGradient(0, cy - r, 0, cy + r);
  grad.addColorStop(0, core);
  grad.addColorStop(1, ring);
  ctx.fillStyle = grad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  // Slits cut the lower half of the disc, wider toward the bottom.
  // destination-out erases where the source is opaque, so fill solid.
  ctx.fillStyle = '#000000';
  ctx.globalCompositeOperation = 'destination-out';
  let y = cy + r * 0.05;
  let gap = r * 0.045;
  while (y < cy + r) {
    ctx.fillRect(cx - r, y, r * 2, gap);
    y += gap + r * 0.11;
    gap *= 1.45;
  }
  ctx.restore();
}

/** One palm silhouette: a leaning trunk and a crown of curved fronds. */
export function drawPalm(ctx, x, y, s, lean, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  // Trunk: a gentle S-curve rising from the ground.
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(14, -70, 4, -150);
  ctx.stroke();
  // Fronds fan out from the crown at the top of the trunk.
  ctx.translate(4, -150);
  for (let i = 0; i < 7; i++) {
    const angle = -Math.PI * 0.08 - (i * Math.PI) / 7.2;
    const len = 105 - Math.abs(i - 3) * 12;
    ctx.save();
    ctx.rotate(angle);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.45, -16 - i * 2, len, 26 + i * 3);
    ctx.stroke();
    // Leaflets along the frond.
    ctx.lineWidth = 3;
    for (let t = 0.25; t < 0.95; t += 0.14) {
      const lx = len * t;
      const ly = -16 * t + 26 * t * t + 4;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 14, ly + 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 12, ly - 16);
      ctx.stroke();
    }
    ctx.restore();
  }
  // A couple of coconuts under the crown.
  ctx.beginPath();
  ctx.arc(-6, 6, 7, 0, Math.PI * 2);
  ctx.arc(8, 10, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Halftone dots fading down a band, for the sky area. */
export function drawHalftone(ctx, x, y, w, h, color, seed) {
  const rnd = seededRandom(seed);
  const step = Math.max(10, Math.round(w / 46));
  ctx.save();
  ctx.fillStyle = color;
  for (let row = 0; row * step < h; row++) {
    for (let col = 0; col * step < w; col++) {
      const px = x + col * step + step / 2 + (row % 2 ? step / 2 : 0);
      const py = y + row * step + step / 2;
      const fade = 1 - row * step / h;
      const r = step * 0.16 * fade + rnd() * 0.6;
      if (r < 0.4) continue;
      ctx.globalAlpha = 0.5 * fade;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Fine film grain over the whole cover. */
export function drawGrain(ctx, w, h, seed) {
  const rnd = seededRandom(seed);
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#ffffff';
  const dots = Math.round((w * h) / 2600);
  for (let i = 0; i < dots; i++) {
    const s = 1 + rnd() * 1.6;
    ctx.fillRect(rnd() * w, rnd() * h, s, s);
  }
  ctx.globalAlpha = 0.045;
  ctx.fillStyle = '#000000';
  for (let i = 0; i < dots; i++) {
    const s = 1 + rnd() * 1.6;
    ctx.fillRect(rnd() * w, rnd() * h, s, s);
  }
  ctx.restore();
}

/** Darkened corners that pull the eye to the middle of the cover. */
export function drawVignette(ctx, w, h) {
  const grad = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.42,
    w / 2, h / 2, Math.max(w, h) * 0.78,
  );
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.34)');
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** A warm diagonal light leak from the top-right corner. */
export function drawLightLeak(ctx, w, h, color) {
  const grad = ctx.createLinearGradient(w, 0, w * 0.45, h * 0.55);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
