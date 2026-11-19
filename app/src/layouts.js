// Panel geometry for the four cover layouts. Each layout returns the panel
// rectangles (in cover pixels) plus the zones where the sky art, the title and
// the badge ribbon live. All coordinates are fractions of the cover size, so
// one layout works at 1080 x 1080, 1080 x 1350 and 1920 x 1080 alike.

export const LAYOUTS = {
  hero3: { id: 'hero3', name: 'Hero + Three', panels: 4 },
  four: { id: 'four', name: 'Four Square', panels: 4 },
  strip: { id: 'strip', name: 'Triple Strip', panels: 3 },
  bleed: { id: 'bleed', name: 'Full Bleed', panels: 1 },
};

/** Returns { panels, sky, title, badge } for a layout at cover size w x h. */
export function layoutPanels(layoutId, w, h) {
  const g = Math.round(Math.min(w, h) * 0.022); // gutter between panels
  const m = Math.round(Math.min(w, h) * 0.03); // outer margin
  const skyH = Math.round(h * 0.16); // sky band along the top
  const titleH = Math.round(h * 0.24); // title band along the bottom
  const bodyTop = skyH;
  const bodyBottom = h - titleH;
  const bodyH = bodyBottom - bodyTop;
  const bodyW = w - m * 2;

  let panels = [];
  if (layoutId === 'hero3') {
    // One big hero panel on top, three small panels in a row beneath it.
    const heroH = Math.round(bodyH * 0.62);
    const smallH = bodyH - heroH - g;
    const smallW = Math.round((bodyW - g * 2) / 3);
    panels = [
      { x: m, y: bodyTop, w: bodyW, h: heroH },
      { x: m, y: bodyTop + heroH + g, w: smallW, h: smallH },
      { x: m + smallW + g, y: bodyTop + heroH + g, w: smallW, h: smallH },
      { x: m + (smallW + g) * 2, y: bodyTop + heroH + g, w: smallW, h: smallH },
    ];
  } else if (layoutId === 'four') {
    // A 2 x 2 grid of equal panels.
    const pw = Math.round((bodyW - g) / 2);
    const ph = Math.round((bodyH - g) / 2);
    panels = [
      { x: m, y: bodyTop, w: pw, h: ph },
      { x: m + pw + g, y: bodyTop, w: pw, h: ph },
      { x: m, y: bodyTop + ph + g, w: pw, h: ph },
      { x: m + pw + g, y: bodyTop + ph + g, w: pw, h: ph },
    ];
  } else if (layoutId === 'strip') {
    // Three tall vertical panels side by side.
    const pw = Math.round((bodyW - g * 2) / 3);
    panels = [
      { x: m, y: bodyTop, w: pw, h: bodyH },
      { x: m + pw + g, y: bodyTop, w: pw, h: bodyH },
      { x: m + (pw + g) * 2, y: bodyTop, w: pw, h: bodyH },
    ];
  } else {
    // Full Bleed: one photo fills the whole body, edge to edge.
    panels = [{ x: 0, y: bodyTop, w, h: bodyH }];
  }

  return {
    panels,
    sky: { x: 0, y: 0, w, h: skyH },
    title: { x: m, y: h - titleH, w: bodyW, h: titleH },
    badge: { x: m, y: Math.round(h * 0.035), w: Math.round(w * 0.34), h: Math.round(h * 0.055) },
    gutter: g,
    margin: m,
  };
}

/** How many panels a layout shows. */
export function panelCount(layoutId) {
  return LAYOUTS[layoutId]?.panels ?? 4;
}
