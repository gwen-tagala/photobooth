import { PhotostripPreview } from "./PhotostripPreview";
interface Props {
    image: string | null;
    onDownload: () => void;
    onReset: () => void;
}
export function ResultScreen({ image, onDownload, onReset }: Props) {
    return (
        <main className="result-page page-shell">
            <div className="result-copy">
                <span className="eyebrow">EVIDENCE SAVED</span>
                <h2>
                    YOU DID IT,
                    <br />
                    <em>NERD.</em>
                </h2>
                <p>Your HOT NERD THEORY photostrip is ready.</p>
            </div>
            <PhotostripPreview image={image} />
            <div className="result-actions">
                <button
                    className="primary-button wide"
                    onClick={onDownload}
                    disabled={!image}
                >
                    DOWNLOAD PHOTO STRIP ↓
                </button>
                <button className="text-button" onClick={onReset}>
                    TAKE ANOTHER SET
                </button>
            </div>
            <p className="privacy-note">
                Your photos stay on this device. Nothing is uploaded.
            </p>
        </main>
    );
}
