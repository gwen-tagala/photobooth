import locationsCsv from "./photoboothLocations.csv?raw";

export interface PhotoboothLocation {
    id: string;
    vendor: string;
    country: string;
    branchName: string;
    address?: string;
    latitude: number;
    longitude: number;
    operatingDates?: string;
    pricing?: string;
    website?: string;
    instagram?: string;
    notes?: string;
    vendorLogo?: string;
    posterUrls?: string[];
}

function parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let quoted = false;
    const input = text.replace(/^\uFEFF/, "");

    for (let index = 0; index < input.length; index += 1) {
        const character = input[index];
        if (quoted) {
            if (character === '"' && input[index + 1] === '"') {
                field += '"';
                index += 1;
            } else if (character === '"') quoted = false;
            else field += character;
        } else if (character === '"') quoted = true;
        else if (character === ",") {
            row.push(field);
            field = "";
        } else if (character === "\n" || character === "\r") {
            if (character === "\r" && input[index + 1] === "\n") index += 1;
            row.push(field);
            if (row.some((value) => value.trim())) rows.push(row);
            row = [];
            field = "";
        } else field += character;
    }

    row.push(field);
    if (row.some((value) => value.trim())) rows.push(row);
    return rows;
}

function loadLocations(csv: string): PhotoboothLocation[] {
    const [headerRow, ...dataRows] = parseCsv(csv);
    if (!headerRow) return [];
    const headers = headerRow.map((header) => header.trim());
    const column = (row: string[], name: string) =>
        row[headers.indexOf(name)]?.trim() ?? "";

    return dataRows.flatMap((row) => {
        const latitude = Number(column(row, "latitude"));
        const longitude = Number(column(row, "longitude"));
        const id = column(row, "id");
        const vendor = column(row, "vendor");
        const country = column(row, "country");
        const branchName = column(row, "branchName");

        // Skip incomplete rows so one typo does not prevent the map from loading.
        if (
            !id ||
            !vendor ||
            !country ||
            !branchName ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        )
            return [];

        const optional = (name: string) => column(row, name) || undefined;
        return [
            {
                id,
                vendor,
                country,
                branchName,
                latitude,
                longitude,
                address: optional("address"),
                operatingDates: optional("operatingDates"),
                pricing: optional("pricing"),
                vendorLogo: optional("vendorLogo"),
                posterUrls: optional("posterUrls")
                    ?.split("|")
                    .map((url) => url.trim())
                    .filter(Boolean),
                website: optional("website"),
                instagram: optional("instagram"),
                notes: optional("notes"),
            },
        ];
    });
}

export const photoboothLocations = loadLocations(locationsCsv);
