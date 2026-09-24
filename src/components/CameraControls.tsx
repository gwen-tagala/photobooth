interface Props {
    onCapture: () => void;
    disabled: boolean;
}

export function CameraControls({ onCapture, disabled }: Props) {
    return (
        <div className="camera-controls">
            <button
                className="shutter"
                onClick={onCapture}
                disabled={disabled}
                aria-label="Take photo"
            >
                <span />
            </button>
        </div>
    );
}
