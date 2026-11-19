// Wires the editor: photos in, layout and grade picks, caption edits,
// drag-to-pan on the preview, zoom sliders, and PNG export. A `?shot=`
// query sets up a fixed scene for a screenshot instead (./shots.js).

import { drawCover, defaultState } from './cover.js';
import { LAYOUTS, layoutPanels } from './layouts.js';
import { GRADES, gradeIds } from './grades.js';
import { panelAt } from './panels.js';
import { EXPORT_SIZES, exportCover, exportAllCovers } from './export.js';
import { shotScene, markShotReady, hideEditorForCoverShot } from './shots.js';

const canvas = document.getElementById('cover');
const status = document.getElementById('status');
const titleInput = document.getElementById('title');
const subtitleInput = document.getElementById('subtitle');
const placeInput = document.getElementById('place');
const photoInput = document.getElementById('photo');
const thumbRow = document.getElementById('thumbs');
const panelPhoto = document.getElementById('panel-photo');
const zoomSlider = document.getElementById('zoom');
const panXSlider = document.getElementById('pan-x');
const panYSlider = document.getElementById('pan-y');
const panelLabel = document.getElementById('panel-label');

const state = defaultState([]);
let selectedPanel = 0;
let exportSize = EXPORT_SIZES[0];
let drag = null;

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Sizes the preview canvas to the chosen export aspect and redraws. */
function redraw() {
  const scale = Math.min(760 / exportSize.w, 620 / exportSize.h);
  canvas.width = exportSize.w;
  canvas.height = exportSize.h;
  canvas.style.aspectRatio = `${exportSize.w} / ${exportSize.h}`;
  canvas.style.width = `${Math.round(exportSize.w * scale)}px`;
  drawCover(canvas, state);
  refreshPanelControls();
}

/** Rebuilds the photo thumbnails and the selected panel's controls. */
function refreshPanelControls() {
  thumbRow.innerHTML = '';
  state.photos.forEach((img, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'thumb';
    b.title = `Photo ${i + 1} — click to put it in the selected panel`;
    const t = document.createElement('canvas');
    t.width = 96;
    t.height = 72;
    const tctx = t.getContext('2d');
    const s = Math.max(96 / img.naturalWidth, 72 / img.naturalHeight);
    tctx.drawImage(img, (96 - img.naturalWidth * s) / 2, (72 - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
    b.appendChild(t);
    b.addEventListener('click', () => {
      state.panels[selectedPanel].photo = i;
      redraw();
    });
    thumbRow.appendChild(b);
  });

  panelPhoto.innerHTML = '';
  state.photos.forEach((img, i) => {
    const o = document.createElement('option');
    o.value = String(i);
    o.textContent = `Photo ${i + 1}`;
    panelPhoto.appendChild(o);
  });
  const none = document.createElement('option');
  none.value = '-1';
  none.textContent = 'Empty panel';
  panelPhoto.appendChild(none);

  const slot = state.panels[selectedPanel];
  panelLabel.textContent = `Panel ${selectedPanel + 1} of ${state.panels.length}`;
  panelPhoto.value = String(slot.photo);
  zoomSlider.value = String(slot.zoom);
  panXSlider.value = String(slot.pan.x);
  panYSlider.value = String(slot.pan.y);
}

/** Adds an uploaded photo (up to 4) and puts it in the selected panel. */
async function addPhoto(file) {
  if (!file) return;
  if (state.photos.length >= 4) {
    status.textContent = 'Four photos is the most — remove one first by loading over it.';
    return;
  }
  const img = await loadImage(URL.createObjectURL(file));
  state.photos.push(img);
  const idx = state.photos.length - 1;
  state.panels[selectedPanel].photo = idx;
  status.textContent = `Photo ${idx + 1} loaded.`;
  redraw();
}

function say(text) { status.textContent = text; }

// --- Controls -------------------------------------------------------------

photoInput.addEventListener('change', async (e) => {
  await addPhoto(e.target.files[0]);
  photoInput.value = '';
});
titleInput.addEventListener('input', () => { state.title = titleInput.value; redraw(); });
subtitleInput.addEventListener('input', () => { state.subtitle = subtitleInput.value; redraw(); });
placeInput.addEventListener('input', () => { state.place = placeInput.value; redraw(); });

document.querySelectorAll('[data-layout]').forEach((b) => {
  b.addEventListener('click', () => {
    state.layout = b.dataset.layout;
    selectedPanel = 0;
    document.querySelectorAll('[data-layout]').forEach((x) => x.classList.toggle('on', x === b));
    redraw();
  });
});
document.querySelectorAll('[data-grade]').forEach((b) => {
  b.addEventListener('click', () => {
    state.grade = b.dataset.grade;
    document.querySelectorAll('[data-grade]').forEach((x) => x.classList.toggle('on', x === b));
    redraw();
  });
});
document.querySelectorAll('[data-size]').forEach((b) => {
  b.addEventListener('click', () => {
    exportSize = EXPORT_SIZES.find((s) => s.id === b.dataset.size);
    document.querySelectorAll('[data-size]').forEach((x) => x.classList.toggle('on', x === b));
    redraw();
  });
});

panelPhoto.addEventListener('change', () => {
  state.panels[selectedPanel].photo = Number(panelPhoto.value);
  redraw();
});
zoomSlider.addEventListener('input', () => {
  state.panels[selectedPanel].zoom = Number(zoomSlider.value);
  redraw();
});
panXSlider.addEventListener('input', () => {
  state.panels[selectedPanel].pan.x = Number(panXSlider.value);
  redraw();
});
panYSlider.addEventListener('input', () => {
  state.panels[selectedPanel].pan.y = Number(panYSlider.value);
  redraw();
});

document.getElementById('export-one').addEventListener('click', () => exportCover(state, exportSize, say));
document.getElementById('export-all').addEventListener('click', () => exportAllCovers(state, say));
document.getElementById('load-samples').addEventListener('click', async () => {
  await loadSamples();
  say('Sample photos loaded — try the layouts and grades.');
});

// --- Drag to pan on the preview ------------------------------------------
function canvasPoint(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (canvas.width / r.width),
    y: (e.clientY - r.top) * (canvas.height / r.height),
  };
}
canvas.addEventListener('pointerdown', (e) => {
  const p = canvasPoint(e);
  const geo = layoutPanels(state.layout, canvas.width, canvas.height);
  const hit = panelAt(geo.panels, p.x, p.y);
  if (hit < 0) return;
  selectedPanel = hit;
  canvas.setPointerCapture(e.pointerId);
  drag = { start: p, pan: { ...state.panels[hit].pan }, rect: geo.panels[hit] };
  redraw();
});
canvas.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const p = canvasPoint(e);
  const slot = state.panels[selectedPanel];
  const rangeX = Math.max(1, (drag.rect.w * slot.zoom - drag.rect.w) / 2);
  const rangeY = Math.max(1, (drag.rect.h * slot.zoom - drag.rect.h) / 2);
  slot.pan.x = Math.max(-1, Math.min(1, drag.pan.x - (p.x - drag.start.x) / rangeX));
  slot.pan.y = Math.max(-1, Math.min(1, drag.pan.y - (p.y - drag.start.y) / rangeY));
  redraw();
});
canvas.addEventListener('pointerup', () => { drag = null; });

// --- Samples and screenshot scenes ----------------------------------------
async function loadSamples() {
  const pier = await loadImage('samples/pier.jpg');
  const boulevard = await loadImage('samples/boulevard.jpg');
  state.photos = [pier, boulevard];
  // Each panel gets its own crop so reusing a photo never repeats a frame:
  // the pier fisherman's face is at the top of his photo, the boulevard
  // woman's face at the top of hers.
  state.panels[0].photo = 0;
  state.panels[0].pan = { x: 0, y: -0.75 };
  state.panels[1].photo = 1;
  state.panels[1].pan = { x: 0, y: -0.55 };
  state.panels[2].photo = 0;
  state.panels[2].zoom = 1.15;
  state.panels[2].pan = { x: 0, y: -0.55 };
  state.panels[3].photo = 1;
  state.panels[3].zoom = 1.5;
  state.panels[3].pan = { x: 0.25, y: -0.2 };
  return state.photos;
}

const scene = shotScene();
if (scene) {
  state.layout = LAYOUTS[scene.layout] ? scene.layout : 'hero3';
  state.grade = GRADES[scene.grade] ? scene.grade : 'sunset';
  state.title = scene.title;
  state.subtitle = scene.subtitle;
  state.place = scene.place;
  exportSize = scene.size;
  if (scene.kind === 'cover') hideEditorForCoverShot();
  loadSamples().then(() => {
    redraw();
    markShotReady();
  });
} else {
  redraw();
}
