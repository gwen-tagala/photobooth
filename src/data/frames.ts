import type { PhotoFrame } from "../types/photobooth";

/**
 * IMPORTANT: replace the slot coordinates below with the exact transparent
 * window bounds from the supplied PNG if the artwork's openings differ.
 * Coordinates are in source-frame pixels and are intentionally kept in data,
 * not in the composition logic, so additional frames can be added later.
 */
export const frames: PhotoFrame[] = [
    {
        id: "hot-nerd-theory",
        name: "HOT NERD THEORY",
        image: "/frames/hot-nerd-theory.png",
        width: 840,
        height: 2520,
        showCameraOverlay: true,
        showReviewOverlay: true,
        photoSlots: [
            {
                camera: {
                    x: 71,
                    y: 124,
                    width: 696,
                    height: 521,
                },
                review: {
                    x: 71,
                    y: 121,
                    width: 696,
                    height: 521,
                },
                compose: {
                    x: 71,
                    y: 90,
                    width: 696,
                    height: 521,
                },
                objectPosition: "50% 50%",
            },
            {
                camera: {
                    x: 71,
                    y: 890,
                    width: 696,
                    height: 521,
                },
                review: {
                    x: 71,
                    y: 882,
                    width: 696,
                    height: 521,
                },
                compose: {
                    x: 71,
                    y: 660,
                    width: 696,
                    height: 521,
                },
                objectPosition: "50% 50%",
            },
            {
                camera: {
                    x: 71,
                    y: 1655,
                    width: 696,
                    height: 521,
                },
                review: {
                    x: 71,
                    y: 1645,
                    width: 696,
                    height: 521,
                },
                compose: {
                    x: 71,
                    y: 1230,
                    width: 696,
                    height: 521,
                },
                objectPosition: "50% 50%",
            },
            {
                camera: {
                    x: 71,
                    y: 2420,
                    width: 696,
                    height: 521,
                },
                review: {
                    x: 71,
                    y: 2405,
                    width: 696,
                    height: 521,
                },
                compose: {
                    x: 71,
                    y: 1800,
                    width: 696,
                    height: 521,
                },
                objectPosition: "50% 50%",
            },
        ],
    },
];
