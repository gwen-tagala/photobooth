import { getVendorColor } from "../data/vendorConfig";

interface Props {
    vendors: string[];
}

export function VendorLegend({ vendors }: Props) {
    if (vendors.length === 0) return null;
    return (
        <div className="vendor-legend">
            <span className="eyebrow">VENDORS</span>
            {vendors.map((vendor) => (
                <span className="legend-item" key={vendor}>
                    <i style={{ backgroundColor: getVendorColor(vendor) }} />
                    {vendor}
                </span>
            ))}
        </div>
    );
}
