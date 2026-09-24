import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { PhotoboothLocation } from "../data/photoboothLocations";
import { getVendorColor } from "../data/vendorConfig";

interface Props { locations: PhotoboothLocation[]; }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

function popupContent(location: PhotoboothLocation) {
    const optionalLinks = [
        location.website && `<a href="${escapeHtml(location.website)}" target="_blank" rel="noreferrer">WEBSITE ↗</a>`,
        location.instagram && `<a href="${escapeHtml(location.instagram)}" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>`,
        `<a href="https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}" target="_blank" rel="noreferrer">GET DIRECTIONS ↗</a>`,
    ].filter(Boolean).join("");
    return `<article class="booth-popup">
        <span>${escapeHtml(location.vendor)}</span>
        <strong>${escapeHtml(location.branchName)}</strong>
        <p>${escapeHtml(location.city)}, ${escapeHtml(location.country)}</p>
        <p class="popup-address">${escapeHtml(location.address)}</p>
        ${location.operatingDates ? `<p class="popup-dates"><b>AVAILABLE</b><br>${escapeHtml(location.operatingDates)}</p>` : ""}
        ${location.notes ? `<p>${escapeHtml(location.notes)}</p>` : ""}
        <nav>${optionalLinks}</nav>
    </article>`;
}

export function PhotoboothMap({ locations }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layerRef = useRef<L.MarkerClusterGroup | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        const map = L.map(containerRef.current, { worldCopyJump: true, scrollWheelZoom: true }).setView([20, 0], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);
        const cluster = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 48 });
        map.addLayer(cluster);
        mapRef.current = map;
        layerRef.current = cluster;
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
        const cluster = layerRef.current;
        if (!map || !cluster) return;
        cluster.clearLayers();
        const markers = locations.map((location) => {
            const color = getVendorColor(location.vendor);
            const icon = L.divIcon({
                className: "vendor-marker-shell",
                html: `<span class="vendor-marker" style="--marker-color:${color}"></span>`,
                iconSize: [24, 30],
                iconAnchor: [12, 28],
                popupAnchor: [0, -28],
            });
            return L.marker([location.latitude, location.longitude], { icon })
                .bindPopup(popupContent(location), { maxWidth: 300, autoPanPadding: [20, 20] });
        });
        cluster.addLayers(markers);
        if (locations.length === 1) map.setView([locations[0].latitude, locations[0].longitude], 12);
        else if (locations.length > 1) map.fitBounds(cluster.getBounds().pad(0.12), { maxZoom: 12 });
        return () => { cluster.clearLayers(); };
    }, [locations]);

    return <div ref={containerRef} className="photobooth-map" role="application" aria-label="Interactive map of offline photobooth locations" />;
}
