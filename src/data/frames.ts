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
        width: 682,
        height: 2048,
        photoSlots: [
            {
                x: 92,
                y: 225,
                width: 498,
                height: 357,
                objectPosition: "50% 50%",
            },
            {
                x: 92,
                y: 667,
                width: 498,
                height: 357,
                objectPosition: "50% 50%",
            },
            {
                x: 92,
                y: 1109,
                width: 498,
                height: 357,
                objectPosition: "50% 50%",
            },
            {
                x: 92,
                y: 1551,
                width: 498,
                height: 357,
                objectPosition: "50% 50%",
            },
        ],
    },
];
