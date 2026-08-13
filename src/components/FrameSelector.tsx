import type { PhotoFrame } from "../types/photobooth";

interface Props {
    frames: PhotoFrame[];
    selected: PhotoFrame;
    onSelect: (frame: PhotoFrame) => void;
    onContinue: () => void;
    preview: string | null;
}

export function FrameSelector({
    frames,
    selected,
    onSelect,
    onContinue,
    preview,
}: Props) {
    return (
        <main className="frame-page page-shell">
            <div className="section-heading">
                <span className="eyebrow">PICK YOUR EVIDENCE</span>

                <h2>
                    YOUR PHOTOS,
                    <br />
                    <em>YOUR FRAME.</em>
                </h2>

                <p>The birthday-exclusive HOT NERD THEORY frame is ready.</p>
            </div>

            <div className="frame-layout">
                <div className="mini-strip">
                    {preview ? (
                        <img src={preview} alt="Photostrip preview" />
                    ) : null}
                </div>

                <div className="frame-options">
                    {frames.map((frame) => (
                        <button
                            key={frame.id}
                            className={`frame-option ${selected.id === frame.id ? "selected" : ""}`}
                            onClick={() => onSelect(frame)}
                        >
                            <span>{frame.name}</span>
                            <small>682 × 2048</small>
                        </button>
                    ))}
                </div>
            </div>

            <button className="primary-button wide" onClick={onContinue}>
                SEE FINAL STRIP →
            </button>
        </main>
    );
}
