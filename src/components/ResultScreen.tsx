import { Download } from "lucide-react";
import type { PhotoFrame } from "../types/photobooth";
import { PhotostripPreview } from "./PhotostripPreview";

interface Props {
    image: string | null;
    frame: PhotoFrame;
    onDownload: () => void;
    onReset: () => void;
}

export function ResultScreen({ image, frame, onDownload, onReset }: Props) {
    return (
        <main className="result-page page-shell">
            <div className="result-copy">
                <span className="eyebrow">HOT NERD THEORY</span>
                <h2>
                    HYPOTHESIS
                    <br />
                    <em>CONFIRMED.</em>
                </h2>
                <p>Your photo strip is ready.</p>
            </div>
            <PhotostripPreview image={image} frame={frame} />
            <div className="result-actions">
                <button
                    className="primary-button wide"
                    onClick={onDownload}
                    disabled={!image}
                >
                    SAVE PHOTO STRIP
                    <Download className="button-icon" />
                </button>
                <button className="text-button" onClick={onReset}>
                    START AGAIN
                </button>
            </div>
            <p className="privacy-note">Your photos stay on this device.</p>
        </main>
    );
}
