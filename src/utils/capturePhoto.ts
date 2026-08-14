// export function captureVideoFrame(
//     video: HTMLVideoElement,
//     mirror: boolean,
// ): string {
//     const width = video.videoWidth || 1280;
//     const height = video.videoHeight || 720;
//     const canvas = document.createElement("canvas");
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) throw new Error("Canvas is not supported by this browser.");

//     if (mirror) {
//         ctx.translate(width, 0);
//         ctx.scale(-1, 1);
//     }
//     ctx.drawImage(video, 0, 0, width, height);
//     return canvas.toDataURL("image/jpeg", 0.94);
// }

export function captureVideoFrame(
    video: HTMLVideoElement,
    mirror: boolean,
    targetWidth: number,
    targetHeight: number,
): string {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (!videoWidth || !videoHeight) {
        throw new Error("Camera video is not ready.");
    }

    const targetAspect = targetWidth / targetHeight;
    const videoAspect = videoWidth / videoHeight;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = videoWidth;
    let sourceHeight = videoHeight;

    if (videoAspect > targetAspect) {
        // Video is wider than the target.
        // Crop the left and right sides.
        sourceWidth = videoHeight * targetAspect;
        sourceX = (videoWidth - sourceWidth) / 2;
    } else if (videoAspect < targetAspect) {
        // Video is taller than the target.
        // Crop the top and bottom.
        sourceHeight = videoWidth / targetAspect;
        sourceY = (videoHeight - sourceHeight) / 2;
    }

    const canvas = document.createElement("canvas");

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Canvas is not supported by this browser.");
    }

    if (mirror) {
        ctx.translate(targetWidth, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        targetWidth,
        targetHeight,
    );

    return canvas.toDataURL("image/jpeg", 0.94);
}
