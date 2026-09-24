import { ArrowRight, RotateCcw } from "lucide-react";
import type { CapturedPhoto, PhotoFrame } from "../types/photobooth";

interface Props {
    photo: CapturedPhoto;
    index: number;
    frame: PhotoFrame;
    onRetake: () => void;
    onNext: () => void;
    isLast: boolean;
}

export function SingleCapture({
    photo,
    index,
    frame,
    onRetake,
    onNext,
    isLast,
}: Props) {
    const slot = frame.photoSlots[index].review;
    return (
        <main className="single-capture-page page-shell">
            <div className="section-heading">
                <span className="eyebrow">SINGLE MODE</span>
                <h2>
                    PHOTO {index + 1} <em>/ 4</em>
                </h2>
                <p>Keep this shot or take it again.</p>
            </div>
            <div
                className="single-photo-preview"
                style={{ aspectRatio: `${slot.width} / ${slot.height}` }}
            >
                <img src={photo.dataUrl} alt={`Captured photo ${index + 1}`} />
                {frame.showReviewOverlay && (
                    <img
                        className="review-frame-overlay"
                        src={frame.image}
                        style={{
                            width: `${(frame.width / slot.width) * 100}%`,
                            left: `${(-slot.x / slot.width) * 100}%`,
                            top: `${(-slot.y / slot.width) * 100}%`,
                        }}
                        alt=""
                        aria-hidden="true"
                    />
                )}
            </div>
            <div className="single-actions">
                <button className="primary-button" onClick={onRetake}>
                    RETAKE
                    <RotateCcw className="button-icon" />
                </button>
                <button className="primary-button" onClick={onNext}>
                    {isLast ? "DONE" : "NEXT"}
                    <ArrowRight className="button-icon" />
                </button>
            </div>
        </main>
    );
}
