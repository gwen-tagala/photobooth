import { useMemo, useState } from "react";
import { ArrowLeft, MapPin, RotateCcw } from "lucide-react";
import { PhotoboothMap } from "./PhotoboothMap";
import { VendorLegend } from "./VendorLegend";
import { photoboothLocations } from "../data/photoboothLocations";

interface Props {
    onBack: () => void;
}

export function OfflinePhotoboothsPage({ onBack }: Props) {
    const [country, setCountry] = useState("");
    const [vendor, setVendor] = useState("");
    const countries = useMemo(
        () => [...new Set(photoboothLocations.map((location) => location.country))].sort(),
        [],
    );
    const vendors = useMemo(
        () => [...new Set(photoboothLocations.map((location) => location.vendor))].sort(),
        [],
    );
    const visibleLocations = useMemo(
        () => photoboothLocations.filter((location) =>
            (!country || location.country === country) &&
            (!vendor || location.vendor === vendor),
        ),
        [country, vendor],
    );
    const hasFilters = Boolean(country || vendor);

    return (
        <main className="offline-page page-shell">
            <button className="offline-back text-button" onClick={onBack}>
                <ArrowLeft className="button-icon" /> BACK TO PHOTOBOOTH
            </button>
            <header className="offline-heading">
                <div className="eyebrow">JISUNG GLOBAL · BIRTHDAY PROJECT</div>
                <h2>OFFLINE <em>PHOTOBOOTHS</em></h2>
                <p>Find the HOT NERD THEORY frame out in the world.</p>
            </header>

            <section className="offline-panel paper-card" aria-label="Photobooth map">
                <div className="offline-controls">
                    <label>COUNTRY
                        <select value={country} onChange={(event) => setCountry(event.target.value)}>
                            <option value="">All Countries</option>
                            {countries.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </label>
                    <label>PHOTOBOOTH VENDOR
                        <select value={vendor} onChange={(event) => setVendor(event.target.value)}>
                            <option value="">All Vendors</option>
                            {vendors.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </label>
                    <button className="clear-filters" onClick={() => { setCountry(""); setVendor(""); }} disabled={!hasFilters}>
                        <RotateCcw aria-hidden="true" /> CLEAR FILTERS
                    </button>
                    <strong className="location-count">{visibleLocations.length} PHOTOBOOTHS {hasFilters ? "FOUND" : "WORLDWIDE"}</strong>
                </div>

                <div className="offline-map-wrap">
                    <PhotoboothMap locations={visibleLocations} />
                    {visibleLocations.length === 0 && (
                        <div className="map-empty" role="status">
                            <div className="empty-pin"><MapPin aria-hidden="true" /></div>
                            <strong>{hasFilters ? "NO PHOTOBOOTHS FOUND" : "LOCATIONS COMING SOON"}</strong>
                            <p>{hasFilters ? "Try changing your country or vendor filters." : "We’re getting the offline booth list ready. Check back soon!"}</p>
                        </div>
                    )}
                </div>
                <VendorLegend vendors={vendors} />
            </section>
            <p className="offline-footnote">Branch details will appear here once confirmed by participating vendors.</p>
        </main>
    );
}
