export const vendorColors: Record<string, string> = {
    "Hello Photo": "#d73732",
    "Life4Cuts": "#426a98",
    "Photoism": "#d29422",
    "Don’t Lxxk Up": "#43836f",
};

export const getVendorColor = (vendor: string) =>
    vendorColors[vendor] ?? "#7257a5";
