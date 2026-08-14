interface Props {
    onSwitch: () => void;
    onCapture: () => void;
    disabled: boolean;
}

export function CameraControls({ onSwitch, onCapture, disabled }: Props) {
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

            <button
                className="secondary-button camera-switch-button"
                onClick={onSwitch}
                disabled={disabled}
                aria-label="Switch camera"
            >
                ↻ <span>SWITCH CAMERA</span>
            </button>
        </div>
    );
}
