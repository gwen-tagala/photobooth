import type { PhotoFrame } from "../types/photobooth";

/**
 * The supplied artwork is 682 × 2048.
 *
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
        photoSlots: [
            {
                x: 71,
                y: 90,
                width: 696,
                height: 521,
                objectPosition: "50% 50%",
            },
            {
                x: 71,
                y: 660,
                width: 696,
                height: 521,
                objectPosition: "50% 50%",
            },
            {
                x: 71,
                y: 1230,
                width: 696,
                height: 521,
                objectPosition: "50% 50%",
            },
            {
                x: 71,
                y: 1800,
                width: 696,
                height: 521,
                objectPosition: "50% 50%",
            },
        ],
    },
];
