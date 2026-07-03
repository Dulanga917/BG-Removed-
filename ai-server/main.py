"""
FastAPI AI Server for Background Removal.

Provides endpoints for removing image backgrounds, replacing them with
a solid color, or compositing onto a custom background image.
Uses the rembg library with the u2net model.
"""

import io
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
from rembg import new_session, remove


# ---------------------------------------------------------------------------
# Lifespan – load the rembg model once at startup
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the u2net session at startup and store it in app.state."""
    print("Loading rembg model (u2net)…")
    app.state.session = new_session("u2net")
    print("Model loaded successfully.")
    yield
    print("Shutting down AI server.")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Background Removal AI Server",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def remove_bg(image_bytes: bytes, session) -> Image.Image:
    """Remove the background from raw image bytes.

    Opens *image_bytes* as an RGB PIL Image, passes it through
    ``rembg.remove()`` with the pre-loaded *session*, and returns
    the result as an RGBA image.
    """
    input_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    output_image: Image.Image = remove(input_image, session=session)
    return output_image.convert("RGBA")


def image_to_streaming_response(
    image: Image.Image,
    format: str = "PNG",
) -> StreamingResponse:
    """Encode a PIL Image into a ``StreamingResponse``.

    The image is saved to an in-memory buffer in the requested *format*
    and returned with the appropriate ``Content-Type`` header.
    """
    buf = io.BytesIO()
    image.save(buf, format=format)
    buf.seek(0)
    media_type = f"image/{format.lower()}"
    return StreamingResponse(buf, media_type=media_type)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    """Simple health-check endpoint."""
    return {"status": "ok", "model": "u2net"}


@app.post("/api/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """Remove the background from an uploaded image.

    Returns a transparent PNG.
    """
    try:
        image_bytes = await file.read()
        result = remove_bg(image_bytes, app.state.session)
        return image_to_streaming_response(result)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Background removal failed: {exc}",
        ) from exc


@app.post("/api/replace-background-color")
async def replace_background_color(
    file: UploadFile = File(...),
    color: str = Form("FFFFFF"),
):
    """Remove the background and replace it with a solid colour.

    *color* should be a hex colour string **without** the leading ``#``
    (e.g. ``FF0000`` for red).  Returns a PNG.
    """
    try:
        image_bytes = await file.read()
        fg = remove_bg(image_bytes, app.state.session)

        # Parse the hex colour and build a solid RGBA background
        r = int(color[0:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
        bg = Image.new("RGBA", fg.size, (r, g, b, 255))

        composite = Image.alpha_composite(bg, fg)
        return image_to_streaming_response(composite)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Background colour replacement failed: {exc}",
        ) from exc


@app.post("/api/replace-background-image")
async def replace_background_image(
    file: UploadFile = File(...),
    background: UploadFile = File(...),
):
    """Remove the background and composite onto a custom background image.

    Both *file* (foreground) and *background* are uploaded images.
    The background is resized to match the foreground dimensions.
    Returns a PNG.
    """
    try:
        fg_bytes = await file.read()
        bg_bytes = await background.read()

        fg = remove_bg(fg_bytes, app.state.session)
        bg = Image.open(io.BytesIO(bg_bytes)).convert("RGBA")
        bg = bg.resize(fg.size)

        composite = Image.alpha_composite(bg, fg)
        return image_to_streaming_response(composite)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Background image replacement failed: {exc}",
        ) from exc


# ---------------------------------------------------------------------------
# Entry-point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
