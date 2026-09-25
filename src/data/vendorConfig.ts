import { photoboothLocations } from "./photoboothLocations";

function hashVendorName(vendor: string) {
    let hash = 0;
    for (let index = 0; index < vendor.length; index += 1) {
        hash = (hash * 42 + vendor.charCodeAt(index)) >>> 0;
    }
    return hash;
}

function createVendorColorMap(vendors: string[]) {
    const colors: Record<string, string> = {};
    const usedHues = new Set<number>();

    [...new Set(vendors)]
        .sort((a, b) => a.localeCompare(b))
        .forEach((vendor) => {
            // Start from a stable position based on the vendor name, then move by
            // the golden angle until this vendor has a color no other vendor uses.
            let hue = hashVendorName(vendor) % 360;
            while (usedHues.has(hue)) hue = (hue + 137) % 360;
            usedHues.add(hue);
            colors[vendor] = `hsl(${hue} 68% 42%)`;
        });

    return colors;
}

// Generated directly from the vendors in photoboothLocations.csv. No manual
// vendor-to-color entries are needed; every vendor keeps one color everywhere.
export const vendorColors = createVendorColorMap(
    photoboothLocations.map((location) => location.vendor),
);

export const getVendorColor = (vendor: string) =>
    vendorColors[vendor] ?? `hsl(${hashVendorName(vendor) % 360} 68% 42%)`;
