# Kura Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/srimuryaticitra-cpu/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/srimuryaticitra-cpu/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Kura Cover Studio is a slow-but-sure cover press for an invented sunny coast — Teluk Kura, on Neon Shore. It turns your own photos and a caption into a bold multi-panel poster cover, the kind of art you would post, and exports it as a PNG to share. Everything is original: the layouts, the lettering, the striped sun, the palm silhouettes, the halftone and grain are all drawn in code. No artwork, logo, name or font is taken from any game.

## What it does

- **4 multi-panel layouts** — Hero + Three (one big panel, three small), Four Square (2×2 grid), Triple Strip (three tall panels), Full Bleed (one photo edge to edge).
- **Your photos, your way** — upload up to 4 photos, or reuse one photo across panels. Click a panel to select it, drag it to pan the photo, use the zoom and pan sliders, or pick which photo goes in each panel.
- **5 colour grades** — Sunset, Neon Night, Golden Hour, Teal Dusk and Mono Noir, applied as canvas tints over every panel.
- **Editable caption** — a main title (default "TELUK KURA"), a subtitle line and a place badge ribbon, in bold gradient lettering with an outline and a slight tilt.
- **Procedural cover art** — a retro striped sun disc, palm silhouettes, halftone dots, film grain, a vignette and a light leak, all drawn in code.
- **Export PNG** — 1080 × 1080, 1080 × 1350 and 1920 × 1080, one button per size plus "Export all three".

## How to run it

No build step, no network. Serve the `app/` folder with any static server and open it in desktop Chrome:

```sh
node serve.ts
# then open http://localhost:8080
```

Or open `app/index.html` directly from the files on your machine.

## Controls

1. **Photos** — "Add a photo" loads a photo from your machine (never uploaded); "Load the two sample photos" loads the bundled samples. Click a thumbnail to put that photo in the selected panel.
2. **Layout** — pick one of the four panel layouts.
3. **Colour grade** — pick one of the five grades.
4. **Caption** — type the title, subtitle and place badge.
5. **Selected panel** — choose the photo in the panel, zoom, and pan. Or drag the panel right on the preview.
6. **Export PNG** — pick a size and export it, or export all three at once.

Photos stay on your machine: nothing is uploaded anywhere.
