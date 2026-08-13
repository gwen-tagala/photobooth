# Jisung Global — HOT NERD THEORY Online Photobooth

Client-side React + TypeScript + Vite 4-cut photobooth. Camera access uses `getUserMedia`; photos are kept in browser memory and composed with Canvas. Nothing is uploaded.

## Add the supplied frame

Copy the supplied transparent PNG into:

`public/frames/hot-nerd-theory.png`

It must be the original 682 × 2048 RGBA artwork.

## Photo slot calibration

`src/data/frames.ts` contains the four source-frame photo slots. The current coordinates are a safe placeholder layout because the original PNG file was not available to the build environment. Once the actual PNG is present, calibrate these four rectangles to the transparent windows in the artwork. The composition engine itself is frame-agnostic and preserves the PNG's alpha layer by drawing it last.

For precise calibration, use the frame's pixel dimensions (682 × 2048) and record each transparent photo-window rectangle as `{ x, y, width, height }`.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Camera notes

- Production camera access requires HTTPS (localhost works for development).
- Front preview is mirrored and the captured front image is mirrored consistently.
- Camera tracks are stopped before switching cameras, when leaving the camera step, and on reset.
- Browser permissions are handled with a friendly user-facing error.
