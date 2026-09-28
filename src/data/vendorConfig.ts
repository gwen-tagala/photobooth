import { photoboothLocations } from "./photoboothLocations";

const HUE_STEP = 7;

function getVendorSeed(vendor: string, country: string) {
    const value = `${vendor}|${country}`;

    let hash = 0;

    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }

    return hash;
}

function getHueDistance(a: number, b: number) {
    const distance = Math.abs(a - b);

    return Math.min(distance, 360 - distance);
}

function getMinimumDistance(hue: number, usedHues: number[]) {
    if (usedHues.length === 0) {
        return 360;
    }

    return Math.min(...usedHues.map((usedHue) => getHueDistance(hue, usedHue)));
}

function getHueFromSeed(seed: number, usedHues: number[]) {
    /*
     * First vendor gets its natural seeded hue.
     */
    if (usedHues.length === 0) {
        return seed % 360;
    }

    /*
     * Start from the seeded hue.
     */
    const startingHue = seed % 360;

    let bestHue = startingHue;
    let bestDistance = getMinimumDistance(startingHue, usedHues);

    /*
     * Search the entire color wheel.
     *
     * Instead of stopping at the first acceptable color,
     * find the hue that is furthest away from all existing
     * vendor colors.
     */
    for (let offset = 0; offset < 360; offset += HUE_STEP) {
        const hue = (startingHue + offset) % 360;

        const distance = getMinimumDistance(hue, usedHues);

        if (distance > bestDistance) {
            bestDistance = distance;
            bestHue = hue;
        }

        /*
         * Also search in the opposite direction.
         */
        const reverseHue = (startingHue - offset + 360) % 360;

        const reverseDistance = getMinimumDistance(reverseHue, usedHues);

        if (reverseDistance > bestDistance) {
            bestDistance = reverseDistance;
            bestHue = reverseHue;
        }
    }

    return bestHue;
}

function createVendorColorMap(locations: typeof photoboothLocations) {
    const colors: Record<string, string> = {};
    const usedHues: number[] = [];

    const vendorCountries = new Map<string, Set<string>>();

    /*
     * Group countries by vendor.
     */
    for (const location of locations) {
        if (!vendorCountries.has(location.vendor)) {
            vendorCountries.set(location.vendor, new Set());
        }

        vendorCountries.get(location.vendor)!.add(location.country);
    }

    /*
     * Sort vendors so the result doesn't depend
     * on the order of photoboothLocations.
     */
    const vendors = [...vendorCountries.keys()].sort((a, b) =>
        a.localeCompare(b),
    );

    for (const vendor of vendors) {
        const countries = vendorCountries.get(vendor) ?? new Set<string>();

        /*
         * One vendor = one color.
         *
         * If a vendor has multiple countries,
         * only the first country alphabetically
         * contributes to the seed.
         */
        const country = [...countries].sort((a, b) => a.localeCompare(b))[0];

        const seed = getVendorSeed(vendor, country);

        const hue = getHueFromSeed(seed, usedHues);

        usedHues.push(hue);

        colors[vendor] = `hsl(${hue} 68% 42%)`;
    }

    return colors;
}

export const vendorColors = createVendorColorMap(photoboothLocations);

export const getVendorColor = (vendor: string) =>
    vendorColors[vendor] ?? "hsl(210 68% 42%)";
