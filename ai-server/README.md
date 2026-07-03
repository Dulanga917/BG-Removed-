---
title: BG Remover AI Server
emoji: ✂️
colorFrom: purple
colorTo: cyan
sdk: docker
pinned: false
---

# BG Remover AI Server

FastAPI server for background removal using `rembg` + `u2net`.

## Endpoints

- `GET /health` — health check
- `POST /api/remove-background` — remove background (returns transparent PNG)
- `POST /api/replace-background-color` — replace with solid colour
- `POST /api/replace-background-image` — replace with custom image
