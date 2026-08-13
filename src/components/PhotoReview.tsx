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
                    REVIEW YOUR
                    <br />
                    <em>MASTERPIECES.</em>
                </h2>
                <p>Not feeling one? Retake just that shot.</p>
            </div>
            <div className="review-grid">
                {photos.map((photo, index) => (
                    <article className="review-card" key={photo.id}>
                        <div className="review-number">0{index + 1}</div>
                        <img
                            src={photo.dataUrl}
                            alt={`Captured photo ${index + 1}`}
                            style={{
                                aspectRatio: `${frame.photoSlots[index].width} / ${frame.photoSlots[index].height}`,
                            }}
                        />
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
                CONTINUE TO FRAME →
            </button>
        </main>
    );
}
