import { useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, MapPin, X } from "lucide-react";
import { PhotoboothMap } from "./PhotoboothMap";
import { VendorLegend } from "./VendorLegend";
import { photoboothLocations } from "../data/photoboothLocations";
import { getVendorColor } from "../data/vendorConfig";

interface Props {
    onBack: () => void;
}

export function OfflinePhotoboothsPage({ onBack }: Props) {
    const [country, setCountry] = useState("");
    const [vendor, setVendor] = useState("");
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
        null,
    );
    const cardRefs = useRef(new Map<string, HTMLDivElement>());
    const countries = useMemo(
        () =>
            [
                ...new Set(
                    photoboothLocations.map((location) => location.country),
                ),
            ].sort(),
        [],
    );
    const vendors = useMemo(
        () =>
            [
                ...new Set(
                    photoboothLocations
                        .filter(
                            (location) =>
                                !country || location.country === country,
                        )
                        .map((location) => location.vendor),
                ),
            ].sort(),
        [country],
    );
    const visibleLocations = useMemo(
        () =>
            photoboothLocations.filter(
                (location) =>
                    (!country || location.country === country) &&
                    (!vendor || location.vendor === vendor),
            ),
        [country, vendor],
    );
    const hasFilters = Boolean(country || vendor);
    const selectLocation = (id: string) => {
        setSelectedLocationId(id);
        cardRefs.current
            .get(id)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    const selectCountry = (nextCountry: string) => {
        setCountry(nextCountry);
        if (
            vendor &&
            nextCountry &&
            !photoboothLocations.some(
                (location) =>
                    location.country === nextCountry &&
                    location.vendor === vendor,
            )
        ) {
            setVendor("");
        }
    };

    return (
        <main className="offline-page page-shell">
            <button className="offline-back text-button" onClick={onBack}>
                <ArrowLeft className="button-icon" /> BACK TO PHOTOBOOTH
            </button>
            <header className="offline-heading">
                <div className="eyebrow">JISUNG GLOBAL · BIRTHDAY PROJECT</div>
                <h2>
                    OFFLINE <em>PHOTOBOOTHS</em>
                </h2>
                <p>Find the HOT NERD THEORY frame out in the world.</p>
            </header>

            <section
                className="offline-panel paper-card"
                aria-label="Photobooth locations"
            >
                <div className="offline-results-layout">
                    <aside
                        className="location-list-panel"
                        aria-label="Photobooth filters and visible branches"
                    >
                        <div className="offline-controls">
                            <div className="filter-field">
                                <div className="filter-label-row">
                                    <label htmlFor="offline-country">
                                        COUNTRY
                                    </label>
                                    {country && (
                                        <button
                                            className="filter-clear"
                                            type="button"
                                            onClick={() => selectCountry("")}
                                            aria-label="Clear country filter"
                                            title="Clear country filter"
                                        >
                                            <X aria-hidden="true" />
                                        </button>
                                    )}
                                </div>
                                <select
                                    id="offline-country"
                                    value={country}
                                    onChange={(event) =>
                                        selectCountry(event.target.value)
                                    }
                                >
                                    <option value="">All Countries</option>
                                    {countries.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-field">
                                <div className="filter-label-row">
                                    <label htmlFor="offline-vendor">
                                        PHOTOBOOTH VENDOR
                                    </label>
                                    {vendor && (
                                        <button
                                            className="filter-clear"
                                            type="button"
                                            onClick={() => setVendor("")}
                                            aria-label="Clear vendor filter"
                                            title="Clear vendor filter"
                                        >
                                            <X aria-hidden="true" />
                                        </button>
                                    )}
                                </div>
                                <select
                                    id="offline-vendor"
                                    value={vendor}
                                    onChange={(event) =>
                                        setVendor(event.target.value)
                                    }
                                >
                                    <option value="">All Vendors</option>
                                    {vendors.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="location-list-heading">
                            <strong>
                                {visibleLocations.length}{" "}
                                {hasFilters ? "LOCATIONS FOUND" : "LOCATIONS"}
                            </strong>
                            <span>
                                {visibleLocations.length === 1
                                    ? "1 BRANCH"
                                    : `${visibleLocations.length} BRANCHES`}
                            </span>
                        </div>
                        {visibleLocations.length > 0 ? (
                            <div className="location-list">
                                {visibleLocations.map((location) => (
                                    <div
                                        key={location.id}
                                        ref={(element) => {
                                            if (element)
                                                cardRefs.current.set(
                                                    location.id,
                                                    element,
                                                );
                                            else
                                                cardRefs.current.delete(
                                                    location.id,
                                                );
                                        }}
                                        className={`location-card${selectedLocationId === location.id ? " is-active" : ""}`}
                                        style={
                                            {
                                                "--vendor-color":
                                                    getVendorColor(
                                                        location.vendor,
                                                    ),
                                            } as CSSProperties
                                        }
                                        onClick={() =>
                                            selectLocation(location.id)
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {
                                                event.preventDefault();
                                                selectLocation(location.id);
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={
                                            selectedLocationId === location.id
                                        }
                                    >
                                        <span className="location-vendor">
                                            {location.vendorLogo ? (
                                                <img
                                                    className="vendor-logo"
                                                    src={location.vendorLogo}
                                                    alt=""
                                                />
                                            ) : (
                                                <span
                                                    className="vendor-logo vendor-logo-placeholder"
                                                    aria-hidden="true"
                                                >
                                                    {location.vendor.charAt(0)}
                                                </span>
                                            )}
                                            {location.vendor}
                                        </span>
                                        <strong className="location-branch">
                                            {location.branchName}
                                        </strong>
                                        <span className="location-city">
                                            {location.country}
                                        </span>
                                        {location.address && (
                                            <span className="location-address">
                                                <MapPin aria-hidden="true" />
                                                {location.address}
                                            </span>
                                        )}
                                        <a
                                            className="location-directions"
                                            href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >
                                            GET DIRECTIONS ↗
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="list-empty">
                                <strong>
                                    {hasFilters
                                        ? "NO PHOTOBOOTHS FOUND"
                                        : "LOCATIONS COMING SOON"}
                                </strong>
                                <p>
                                    {hasFilters
                                        ? "Try changing your country or vendor filters."
                                        : "Confirmed branches will appear here."}
                                </p>
                            </div>
                        )}
                    </aside>
                    <div className="offline-map-wrap">
                        <PhotoboothMap
                            locations={visibleLocations}
                            selectedLocationId={selectedLocationId}
                            onSelectLocation={selectLocation}
                        />
                        {visibleLocations.length === 0 && (
                            <div className="map-empty" role="status">
                                <div className="empty-pin">
                                    <MapPin aria-hidden="true" />
                                </div>
                                <strong>
                                    {hasFilters
                                        ? "NO PHOTOBOOTHS FOUND"
                                        : "LOCATIONS COMING SOON"}
                                </strong>
                                <p>
                                    {hasFilters
                                        ? "Try changing your country or vendor filters."
                                        : "We’re getting the offline booth list ready. Check back soon!"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <VendorLegend vendors={vendors} />
            </section>
            {/* <p className="offline-footnote">
                Branch details will appear here once confirmed by participating
                vendors.
            </p> */}
        </main>
    );
}
