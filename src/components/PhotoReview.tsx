import type { CapturedPhoto, PhotoFrame } from "../types/photobooth";

interface Props {
    photos: CapturedPhoto[];
    frame: PhotoFrame;
    onRetake: (index: number) => void;
    onContinue: () => void;
}

export function PhotoReview({ photos, frame, onRetake, onContinue }: Props) {
    return (
        <main className="review-page page-shell">
            <div className="section-heading">
                <span className="eyebrow">CONTACT SHEET</span>
                <h2>
                    CHECK THE
                    <br />
                    <em>EVIDENCE.</em>
                </h2>
                <p>Retake any photo before continuing.</p>
            </div>
            <div className="review-grid">
                {photos.map((photo, index) => (
                    <article className="review-card" key={photo.id}>
                        <div className="review-number">0{index + 1}</div>
                        <div
                            className="review-photo-preview"
                            style={{
                                aspectRatio: `${frame.photoSlots[index].review.width} / ${frame.photoSlots[index].review.height}`,
                            }}
                        >
                            <img
                                src={photo.dataUrl}
                                alt={`Captured photo ${index + 1}`}
                            />
                            {frame.showReviewOverlay && (
                                <img
                                    className="review-frame-overlay"
                                    src={frame.image}
                                    style={{
                                        width: `${(frame.width / frame.photoSlots[index].review.width) * 100}%`,
                                        left: `${(-frame.photoSlots[index].review.x / frame.photoSlots[index].review.width) * 100}%`,
                                        top: `${(-frame.photoSlots[index].review.y / frame.photoSlots[index].review.width) * 100}%`,
                                    }}
                                    alt=""
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                        <button
                            className="retake-button"
                            onClick={() => onRetake(index)}
                        >
                            RETAKE ↻
                        </button>
                    </article>
                ))}
            </div>
            <button className="primary-button wide" onClick={onContinue}>
                VIEW RESULT →
            </button>
        </main>
    );
}
