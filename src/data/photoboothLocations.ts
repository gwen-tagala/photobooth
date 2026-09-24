export interface PhotoboothLocation {
    id: string;
    vendor: string;
    country: string;
    city: string;
    branchName: string;
    address: string;
    latitude: number;
    longitude: number;
    operatingDates?: string;
    website?: string;
    instagram?: string;
    notes?: string;
}

// Add confirmed participating branches here. Keep this empty until locations
// are officially announced so visitors never mistake examples for real booths.
export const photoboothLocations: PhotoboothLocation[] = [];
