# Build log — Kura Cover Studio (gta6-cover-art-01)

## What was built

Kura Cover Studio, a cover maker for an invented sunny coast ("Teluk Kura" / "Neon Shore"). The app turns the user's own photos and a caption into a bold multi-panel poster cover and exports it as a PNG in 1080 × 1080, 1080 × 1350 and 1920 × 1080.

## Steps, in order

1. Read the kit's RULES.txt, the starter's main.ts / serve.ts / shots.json and the starter app (index.html, style.css, src/main.js, src/cover.js, src/shots.js). The starter was a plain one-photo square cover; it was replaced, not reused.
2. Wrote `app/src/layouts.js` first: four layout geometries (Hero + Three, Four Square, Triple Strip, Full Bleed) computed as fractions of the cover size, so one layout works at all three export sizes.
3. Wrote `app/src/grades.js`: five colour grades (Sunset, Neon Night, Golden Hour, Teal Dusk, Mono Noir), each a small palette for the sky, the photo tint, the title gradient and the accents.
4. Wrote `app/src/art.js`: procedural art drawn in code — a retro striped sun disc with horizontal slits, palm silhouettes with curved fronds and leaflets, halftone dots, film grain, a vignette and a light leak. Grain and halftone use a seeded generator so a cover renders identically every time.
5. Wrote `app/src/lettering.js`: bold system-sans lettering with a gradient fill, dark outline and slight tilt, a spaced-capital subtitle and a slanted badge ribbon. No font file is shipped, so there is no font licensing question at all.
6. Wrote `app/src/panels.js`: cover-fit photo placement with pan and zoom, the grade tint over each photo, the white poster frame, and panel hit-testing for drag-to-pan.
7. Wrote `app/src/cover.js`: the renderer that composes sky, sun, panels, palms, lettering and finishing effects at any size, plus the default editor state.
8. Wrote `app/src/export.js`: off-screen rendering at the three post sizes and PNG download, one size at a time or all three.
9. Rewrote `app/src/shots.js` for deterministic screenshot scenes (`?shot=cover` / `?shot=editor`, with layout, grade, size, photos, title, subtitle and place in the query) and `window.__shotReady` once painted.
10. Rewrote `app/src/main.js`: the editor wiring — photo upload (up to 4), thumbnails, layout/grade/size buttons, caption inputs, per-panel photo/zoom/pan controls, drag-to-pan on the preview, export buttons, and the screenshot-scene branch.
11. Rewrote `app/index.html` and `app/style.css` as a dark editor shell with the controls on the left and a live preview on the right.
12. Wrote `main.ts` (first version), then revised it after playtesting.
13. Wrote `README.md` (with the three make.fun badges), `.makefun/owner.json` and `shots.json`.
14. Playtested in headless Chrome from `file://`, took the four screenshots, and validated the entry (see below).

## Design decisions

- **Original identity, invented place.** Nothing from any commercial game: no names, logos, characters, maps, art or music. The cover says "TELUK KURA" / "NEON SHORE", an invented coast, with a tortoise-flavoured studio name.
- **Vanilla JS + 2D canvas, no libraries.** The starter's structure was kept because its pipeline is proven; every line of the app is written for this entry.
- **One layout function for all sizes.** Panel rectangles are fractions of the cover, so the same code draws the 1080 × 1080, 1080 × 1350 and 1920 × 1080 covers.
- **Deterministic art.** Grain and halftone come from a seeded generator, so the same state always paints the same cover — screenshots are reproducible.
- **No font files.** Bold system sans-serif with gradient, outline and shadow lettering keeps the app fully offline with zero licensing questions.
- **Screenshots show the best work first.** The first shot is a landscape 1920 × 1080 cover (largest on the judge's sheet), then the editor at work, then the portrait and square exports.

## Validation

- `node --check` passes on all 9 app sources (art, cover, export, grades, layouts, lettering, main, panels, shots).
- Playtested in headless Chrome (Meta Chromium 157, CDP-driven, file:// with --allow-file-access-from-files): editor and all three cover sizes render with zero console errors or exceptions; `window.__shotReady` fires in under 0.5 s.
- Export smoke test: "Export this size" and "Export all three" downloaded kura-cover-1080x1080.png (1080 × 1080), kura-cover-1080x1350.png (1080 × 1350) and kura-cover-1920x1080.png (1920 × 1080); the 1920 × 1080 PNG was opened and matches the live preview exactly.
- Screenshots (all real renders of the app's own code, kit sample photos only): 1-cover.jpg 1280 × 720, 140,289 bytes (wide Hero + Three, Sunset); 2-editor.jpg 1280 × 720, 153,098 bytes (editor with photos loaded); 3-cover-portrait.jpg 1024 × 1280, 211,906 bytes (Triple Strip, Neon Night); 4-cover-square.jpg 1080 × 1080, 216,595 bytes (Four Square, Golden Hour). All ≤ 256 KiB, long side ≤ 1280, short side ≥ 480.
- Entrypoint run twice (`MAKEFUN_OUTPUT_DIR=out1` / `out2`): `diff -r` byte-identical. dossier.json 1,003,389 bytes (≤ 1.5 MiB), dossier text 38,939 bytes (≤ 160 KiB). app/ is 156,758 bytes in 16 entries (≤ 48 MiB / 993). No http/https reference anywhere under app/.
- Kit check (`node cli/makefun.mjs check --kit . --repo …`): 4 passed (competition_open, snapshot, license_osi, entrypoint), 0 failed, 16 skipped (transcript checks run on the site), 5 checked at submission (repo public, repo owner, repo created after open, commit in repo, duplicate snapshot — the parent handles the GitHub push and submit).
- The built app in out/ was played once from file:// and renders byte-identically to the repo (same screenshot hash as 2-editor.jpg).
