interface Props {
    onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
    return (
        <main className="landing page-shell">
            <div className="landing-card paper-card">
                <div className="eyebrow">JISUNG GLOBAL</div>
                <div className="stamp">BIRTHDAY PROJECT</div>
                <h1>
                    HOT
                    <br />
                    <span>NERD</span> THEORY
                </h1>
                <p className="lead">ONLINE PHOTOBOOTH</p>
                <p className="copy">
                    Take 4 photos.
                    <br />
                    Review your shots.
                    <br />
                    Save your photostrip.
                </p>
                <button className="primary-button" onClick={onStart}>
                    START PHOTOBOOTH <span>→</span>
                </button>
                <div className="scribble">made for Jisung ♡</div>
            </div>
        </main>
    );
}
