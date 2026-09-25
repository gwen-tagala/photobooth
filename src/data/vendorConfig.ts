import { photoboothLocations } from "./photoboothLocations";

function hashLocation(vendor: string, branchName: string) {
    const value = `${vendor}::${branchName}`;

    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }

    return hash;
}

function createLocationColorMap(locations: typeof photoboothLocations) {
    const colors: Record<string, string> = {};
    const usedHues = new Set<number>();

    locations.forEach((location) => {
        const key = `${location.vendor}::${location.branchName}`;

        let hue = hashLocation(location.vendor, location.branchName) % 360;

        // Avoid colors that are too close to existing colors.
        while (
            [...usedHues].some(
                (usedHue) =>
                    Math.abs(hue - usedHue) < 25 ||
                    Math.abs(hue - usedHue) > 335,
            )
        ) {
            hue = (hue + 137) % 360;
        }

        usedHues.add(hue);

        colors[key] = `hsl(${hue} 68% 42%)`;
    });

    return colors;
}

export const locationColors = createLocationColorMap(photoboothLocations);

export const getLocationColor = (vendor: string, branchName: string) => {
    const key = `${vendor}::${branchName}`;

    return (
        locationColors[key] ??
        `hsl(${hashLocation(vendor, branchName) % 360} 68% 42%)`
    );
};
