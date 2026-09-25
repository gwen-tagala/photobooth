import { useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { PhotoboothMap } from "./PhotoboothMap";
// import { VendorLegend } from "./VendorLegend";
import { photoboothLocations } from "../data/photoboothLocations";
import { getVendorColor } from "../data/vendorConfig";

interface Props {
    onBack: () => void;
}

export function OfflinePhotoboothsPage({ onBack }: Props) {
    const [layerGroup, setLayerGroup] = useState<"country" | "vendor">(
        "country",
    );
    const [selectedCountries, setSelectedCountries] = useState<string[] | null>(
        null,
    );
    const [selectedVendors, setSelectedVendors] = useState<string[] | null>(
        null,
    );
    const [collapsedLayers, setCollapsedLayers] = useState<string[]>([]);
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
        () => [...new Set(photoboothLocations.map((location) => location.vendor))].sort(),
        [],
    );
    const layerItems = layerGroup === "country" ? countries : vendors;
    const selectedLayers =
        layerGroup === "country" ? selectedCountries : selectedVendors;
    const layerTree = useMemo(
        () =>
            layerItems.map((parent) => {
                const parentLocations = photoboothLocations.filter((location) =>
                    layerGroup === "country"
                        ? location.country === parent
                        : location.vendor === parent,
                );
                const childKey = layerGroup === "country" ? "vendor" : "country";
                const children = [...new Set(parentLocations.map((location) => location[childKey]))]
                    .sort()
                    .map((child) => ({
                        name: child,
                        count: parentLocations.filter((location) => location[childKey] === child).length,
                        color: getVendorColor(
                            layerGroup === "country" ? child : parent,
                        ),
                    }));
                return { name: parent, children };
            }),
        [layerGroup, layerItems],
    );
    const visibleLocations = useMemo(
        () =>
            photoboothLocations.filter(
                (location) =>
                    selectedLayers === null ||
                    selectedLayers.includes(
                        layerGroup === "country"
                            ? location.country
                            : location.vendor,
                    ),
            ),
        [layerGroup, selectedLayers],
    );
    const hasFilters = selectedLayers !== null;
    const selectLocation = (id: string) => {
        setSelectedLocationId(id);
        cardRefs.current
            .get(id)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    const toggleLayer = (item: string) => {
        const setter = layerGroup === "country" ? setSelectedCountries : setSelectedVendors;
        const next = selectedLayers === null
            ? layerItems.filter((layer) => layer !== item)
            : selectedLayers.includes(item)
              ? selectedLayers.filter((layer) => layer !== item)
              : [...selectedLayers, item];
        setter(next);
    };
    const toggleAllLayers = () =>
        (layerGroup === "country" ? setSelectedCountries : setSelectedVendors)(
            selectedLayers === null ? [] : null,
        );
    const toggleLayerBranch = (layer: string) => {
        const key = `${layerGroup}:${layer}`;
        setCollapsedLayers((current) =>
            current.includes(key)
                ? current.filter((item) => item !== key)
                : [...current, key],
        );
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
                        aria-label="Photobooth layers and visible branches"
                    >
                        <div className="layer-controls">
                            <label className="layer-group-select" htmlFor="layer-group">
                                SHOW LAYERS BY
                                <select
                                    id="layer-group"
                                    value={layerGroup}
                                    onChange={(event) =>
                                        setLayerGroup(event.target.value as "country" | "vendor")
                                    }
                                >
                                    <option value="country">Country</option>
                                    <option value="vendor">Photobooth Vendor</option>
                                </select>
                            </label>
                            <div className="layer-tree">
                                <label className="layer-option is-all">
                                    <input type="checkbox" checked={selectedLayers === null} onChange={toggleAllLayers} />
                                    ALL {layerGroup === "country" ? "COUNTRIES" : "VENDORS"}
                                </label>
                                {layerTree.map((layer) => {
                                    const layerKey = `${layerGroup}:${layer.name}`;
                                    const isCollapsed = collapsedLayers.includes(layerKey);
                                    return (
                                        <div className="layer-parent" key={layer.name}>
                                            <div className="layer-parent-main">
                                                <label className="layer-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLayers === null || selectedLayers.includes(layer.name)}
                                                        onChange={() => toggleLayer(layer.name)}
                                                    />
                                                    {layer.name}
                                                </label>
                                                <button
                                                    className="layer-branch-toggle"
                                                    type="button"
                                                    onClick={() => toggleLayerBranch(layer.name)}
                                                    aria-expanded={!isCollapsed}
                                                    aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${layer.name}`}
                                                >
                                                    {isCollapsed ? <ChevronRight aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                                                </button>
                                            </div>
                                            {!isCollapsed && (
                                                <div className="layer-children">
                                                    <span className="layer-children-title">
                                                        GROUPED BY {layerGroup === "country" ? "VENDOR" : "COUNTRY"}
                                                    </span>
                                                    {layer.children.map((child) => (
                                                        <span className="layer-child" key={child.name}>
                                                            <i style={{ backgroundColor: child.color }} />
                                                            {child.name} <small>({child.count})</small>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="location-list-heading">
                            <strong>
                                {visibleLocations.length}{" "}
                                {hasFilters ? "LOCATIONS FOUND" : "LOCATIONS"}
                            </strong>
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
                {/* <VendorLegend vendors={vendors} /> */}
            </section>
            {/* <p className="offline-footnote">
                Branch details will appear here once confirmed by participating
                vendors.
            </p> */}
        </main>
    );
}
