import { ArrowRight, RotateCcw } from "lucide-react";
import type { CapturedPhoto, PhotoFrame } from "../types/photobooth";

interface Props {
    photos: CapturedPhoto[];
    frame: PhotoFrame;
    image: string | null;
    selectedIndex: number | null;
    onSelect: (index: number | null) => void;
    onRetake: () => void;
    onContinue: () => void;
}

export function PhotoReview({
    photos,
    frame,
    image,
    selectedIndex,
    onSelect,
    onRetake,
    onContinue,
}: Props) {
    return (
        <main className="review-page page-shell">
            <div className="section-heading">
                <span className="eyebrow">PHOTO REVIEW</span>
                <h2>
                    CHECK THE
                    <br />
                    <em>STRIP.</em>
                </h2>
                <p>Tap a photo to select it for a retake.</p>
            </div>
            <div className="burst-review-preview">
                {image ? (
                    <img
                        src={image}
                        alt="Composed HOT NERD THEORY photo strip"
                    />
                ) : (
                    <div className="preview-loading" role="status">
                        COMPOSING
                        <span className="loading-dots" aria-hidden="true">
                            <i>.</i>
                            <i>.</i>
                            <i>.</i>
                        </span>
                    </div>
                )}
                {photos.map((_, index) => {
                    const slot = frame.photoSlots[index].compose;
                    return (
                        <button
                            key={index}
                            className={`photo-region ${selectedIndex === index ? "is-selected" : ""}`}
                            style={{
                                left: `${(slot.x / frame.width) * 100}%`,
                                top: `${(slot.y / frame.height) * 100}%`,
                                width: `${(slot.width / frame.width) * 100}%`,
                                height: `${(slot.height / frame.height) * 100}%`,
                            }}
                            onClick={() =>
                                onSelect(selectedIndex === index ? null : index)
                            }
                            aria-label={`Select photo ${index + 1} for retake`}
                        >
                            <span>{index + 1}</span>
                        </button>
                    );
                })}
            </div>
            {/* <div className="review-selection-label">
                {selectedIndex === null
                    ? "NO PHOTO SELECTED"
                    : `PHOTO ${selectedIndex + 1} SELECTED`}
            </div> */}
            <div className="review-actions">
                <button
                    className="primary-button wide"
                    onClick={onRetake}
                    disabled={selectedIndex === null}
                >
                    RETAKE
                    <RotateCcw className="button-icon" />
                </button>
                <button className="primary-button wide" onClick={onContinue}>
                    SKIP
                    <ArrowRight className="button-icon" />
                </button>
            </div>
        </main>
    );
}
