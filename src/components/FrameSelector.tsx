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
                <span className="eyebrow">HOT NERD THEORY</span>

                <h2>
                    SELECT A
                    <br />
                    <em>FRAME.</em>
                </h2>

                <p>Choose the frame for your photo strip.</p>
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
