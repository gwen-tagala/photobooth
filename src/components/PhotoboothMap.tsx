import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PhotoboothLocation } from "../data/photoboothLocations";
import { getLocationColor } from "../data/vendorConfig";

interface Props {
    locations: PhotoboothLocation[];
    selectedLocationId: string | null;
    onSelectLocation: (id: string) => void;
}

const escapeHtml = (value: string) =>
    value.replace(
        /[&<>"']/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[character]!,
    );

function popupContent(location: PhotoboothLocation) {
    // add the frames available for this location to the popup content
    const optionalLinks = [
        location.website &&
            `<a href="${escapeHtml(location.website)}" target="_blank" rel="noreferrer">WEBSITE ↗</a>`,
        location.instagram &&
            `<a href="${escapeHtml(location.instagram)}" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>`,
        `<a href="https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}" target="_blank" rel="noreferrer">GET DIRECTIONS ↗</a>`,
    ]
        .filter(Boolean)
        .join("");
    return `<article class="booth-popup">
        <span>${escapeHtml(location.vendor)}</span>
        <strong>${escapeHtml(location.branchName)}</strong>
        <p>${escapeHtml(location.country)}</p>
        ${location.address ? `<p class="popup-address">${escapeHtml(location.address)}</p>` : ""}
        ${location.operatingDates ? `<p class="popup-dates"><b>AVAILABLE</b><br>${escapeHtml(location.operatingDates)}</p>` : ""}
        ${location.pricing ? `<p class="popup-dates"><b>PRICING</b><br>${escapeHtml(location.pricing)}</p>` : ""}
        ${location.notes ? `<p>${escapeHtml(location.notes)}</p>` : ""}
        <nav>${optionalLinks}</nav>
    </article>`;
}

export function PhotoboothMap({
    locations,
    selectedLocationId,
    onSelectLocation,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layerRef = useRef<L.LayerGroup | null>(null);
    const markersRef = useRef(new Map<string, L.Marker>());
    const selectedCallbackRef = useRef(onSelectLocation);
    selectedCallbackRef.current = onSelectLocation;

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        const map = L.map(containerRef.current, {
            worldCopyJump: true,
            scrollWheelZoom: true,
        }).setView([20, 0], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);
        const markerLayer = L.layerGroup().addTo(map);
        mapRef.current = map;
        layerRef.current = markerLayer;
        const resizeObserver = new ResizeObserver(() => map.invalidateSize());
        resizeObserver.observe(containerRef.current);
        return () => {
            resizeObserver.disconnect();
            map.remove();
            mapRef.current = null;
            layerRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        const markerLayer = layerRef.current;
        if (!map || !markerLayer) return;
        markerLayer.clearLayers();
        markersRef.current.clear();
        const markers = locations.map((location) => {
            const color = getLocationColor(
                location.vendor,
                location.branchName,
            );
            const icon = L.divIcon({
                className: "vendor-marker-shell",
                html: `<span class="vendor-marker" style="--marker-color:${color}"></span>`,
                iconSize: [24, 30],
                iconAnchor: [12, 28],
                popupAnchor: [0, -28],
            });
            const marker = L.marker([location.latitude, location.longitude], {
                icon,
            }).bindPopup(popupContent(location), {
                maxWidth: 300,
                autoPanPadding: [20, 20],
            });
            marker.on("click", () => selectedCallbackRef.current(location.id));
            markersRef.current.set(location.id, marker);
            return marker;
        });
        markers.forEach((marker) => marker.addTo(markerLayer));
        if (locations.length === 1)
            map.setView([locations[0].latitude, locations[0].longitude], 12);
        else if (locations.length > 1)
            map.fitBounds(
                L.latLngBounds(markers.map((marker) => marker.getLatLng())).pad(
                    0.12,
                ),
                { maxZoom: 12 },
            );
        return () => {
            markerLayer.clearLayers();
        };
    }, [locations]);

    useEffect(() => {
        if (!selectedLocationId || !mapRef.current || !layerRef.current) return;
        const marker = markersRef.current.get(selectedLocationId);
        if (!marker) return;
        const map = mapRef.current;
        if (!map) return;
        const targetZoom = Math.max(map.getZoom(), 15);
        map.setView(marker.getLatLng(), targetZoom);
        marker.openPopup();
    }, [selectedLocationId, locations]);

    return (
        <div
            ref={containerRef}
            className="photobooth-map"
            role="application"
            aria-label="Interactive map of offline photobooth locations"
        />
    );
}
