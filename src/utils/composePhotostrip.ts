import type {
    CapturedPhoto,
    ComposePhotostripOptions,
    PhotoFrame,
} from "../types/photobooth";
import { loadImage } from "./loadImage";

function parseObjectPosition(value = "50% 50%") {
    const [x = "50%", y = "50%"] = value.split(" ");
    const parse = (part: string) =>
        part.endsWith("%")
            ? Number.parseFloat(part) / 100
            : Number.parseFloat(part);
    return {
        x: Number.isFinite(parse(x)) ? parse(x) : 0.5,
        y: Number.isFinite(parse(y)) ? parse(y) : 0.5,
    };
}

function drawCover(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    slot: ComposePhotostripOptions,
    objectPosition?: string,
) {
    const scale = Math.max(
        slot.width / image.naturalWidth,
        slot.height / image.naturalHeight,
    );

    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;

    const position = parseObjectPosition(objectPosition);

    const x = slot.x + (slot.width - drawWidth) * position.x;
    const y = slot.y + (slot.height - drawHeight) * position.y;

    ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

export async function composePhotostrip(
    photos: CapturedPhoto[],
    frame: PhotoFrame,
    outputScale = 2,
): Promise<string> {
    if (photos.length !== 4 || frame.photoSlots.length !== 4) {
        throw new Error(
            "A photo strip requires exactly four photos and four frame slots.",
        );
    }

    const canvas = document.createElement("canvas");
    canvas.width = frame.width * outputScale;
    canvas.height = frame.height * outputScale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported by this browser.");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.scale(outputScale, outputScale);

    const photoImages = await Promise.all(
        photos.map((photo) => loadImage(photo.dataUrl)),
    );
    const frameImage = await loadImage(frame.image);

    ctx.clearRect(0, 0, frame.width, frame.height);

    frame.photoSlots.forEach((slot, index) => {
        drawCover(ctx, photoImages[index], slot.compose, slot.objectPosition);
    });

    ctx.drawImage(frameImage, 0, 0, frame.width, frame.height);

    return canvas.toDataURL("image/png");
}
