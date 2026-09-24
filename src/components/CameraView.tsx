import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Eye, EyeOff, X, SwitchCamera, Timer } from "lucide-react";
import type { CountdownSeconds } from "../hooks/usePhotobooth";
import type {
    CameraMode,
    CaptureMode,
    CaptureStatus,
    PhotoFrame,
} from "../types/photobooth";
import { CameraControls } from "./CameraControls";
import { Countdown } from "./Countdown";
import { PhotoProgress } from "./PhotoProgress";

interface Props {
    videoRef: RefObject<HTMLVideoElement | null>;
    cameraMode: CameraMode;
    frame: PhotoFrame;
    frames: PhotoFrame[];
    countdown: number | null;
    countdownSeconds: CountdownSeconds;
    currentPhotoIndex: number;
    activeSlotIndex: number;
    previewSlotIndex: number | null;
    photoCount: number;
    error: string | null;
    isStarting: boolean;
    isCapturing: boolean;
    captureStatus: CaptureStatus;
    onSwitch: () => void;
    onCapture: () => void;
    onRetry: () => void;
    onCountdownSecondsChange: (seconds: CountdownSeconds) => void;
    onPreviewSlotChange: (index: number | null) => void;
    captureMode: CaptureMode;
    onCaptureModeChange: (mode: CaptureMode) => void;
    showCameraFrame: boolean;
    onShowCameraFrameChange: (show: boolean) => void;
    onFrameChange: (frame: PhotoFrame) => void;
    isRetaking: boolean;
}

export function CameraView(props: Props) {
    const [isFrameSelectorOpen, setIsFrameSelectorOpen] = useState(false);
    const [timerNotice, setTimerNotice] = useState<number | null>(null);
    const timerNoticeTimeout = useRef<number | null>(null);
    const mirrored = props.cameraMode === "user";
    const sessionControlsHidden =
        props.isRetaking || props.isCapturing || props.photoCount > 0;
    const slot = props.frame.photoSlots[props.activeSlotIndex];
    const cameraSlot = slot.camera;

    const overlayStyle = {
        width: `${(props.frame.width / cameraSlot.width) * 100}%`,
        left: `${(-cameraSlot.x / cameraSlot.width) * 100}%`,
        top: `${(-cameraSlot.y / cameraSlot.width) * 100}%`,
    };

    const cameraHint =
        props.captureStatus.state === "taking"
            ? `Get ready for photo #${props.captureStatus.photoIndex + 1}...`
            : props.captureStatus.state === "captured"
              ? `Photo #${props.captureStatus.photoIndex + 1} acquired`
              : "Tap the shutter to take a photo";
    const cycleTimer = () => {
        const nextSeconds: CountdownSeconds =
            props.countdownSeconds === 3
                ? 5
                : props.countdownSeconds === 5
                  ? 10
                  : 3;
        props.onCountdownSecondsChange(nextSeconds);
        setTimerNotice(nextSeconds);
        if (timerNoticeTimeout.current !== null) {
            window.clearTimeout(timerNoticeTimeout.current);
        }
        timerNoticeTimeout.current = window.setTimeout(
            () => setTimerNotice(null),
            900,
        );
    };

    useEffect(
        () => () => {
            if (timerNoticeTimeout.current !== null) {
                window.clearTimeout(timerNoticeTimeout.current);
            }
        },
        [],
    );

    return (
        <main className="camera-page page-shell">
            <div className="camera-top">
                <span className="eyebrow">HOT NERD THEORY</span>
                <span className="camera-label">PHOTOBOOTH SESSION</span>
            </div>

            <div className="camera-top-controls">
                <button
                    className="control-button icon-control timer-control"
                    onClick={cycleTimer}
                    disabled={props.countdown !== null || props.isCapturing}
                    aria-label={`Timer set to ${props.countdownSeconds} seconds. Tap to change.`}
                    title={`Timer: ${props.countdownSeconds}s`}
                >
                    <Timer className="control-icon" />
                    <span className="timer-indicator">
                        {props.countdownSeconds}s
                    </span>
                </button>

                <button
                    className="control-button icon-control"
                    onClick={props.onSwitch}
                    disabled={props.countdown !== null || props.isCapturing}
                    aria-label="Switch camera"
                    title="Switch camera"
                >
                    <SwitchCamera className="control-icon" />
                </button>

                <button
                    className={`control-button icon-control ${props.showCameraFrame ? "is-selected" : ""}`}
                    onClick={() =>
                        props.onShowCameraFrameChange(!props.showCameraFrame)
                    }
                    aria-label={
                        props.showCameraFrame ? "Hide frame" : "Show frame"
                    }
                    aria-pressed={props.showCameraFrame}
                    title={props.showCameraFrame ? "Hide frame" : "Show frame"}
                >
                    {props.showCameraFrame ? (
                        <Eye className="control-icon" />
                    ) : (
                        <EyeOff className="control-icon" />
                    )}
                </button>
            </div>

            <div
                className="camera-stage"
                style={{
                    aspectRatio: `${cameraSlot.width} / ${cameraSlot.height}`,
                }}
            >
                {props.error ? (
                    <div className="camera-error">
                        <div className="error-icon">!</div>

                        <h2>Camera unavailable</h2>
                        <p>{props.error}</p>

                        <button
                            className="primary-button"
                            onClick={props.onRetry}
                        >
                            TRY AGAIN
                        </button>
                    </div>
                ) : (
                    <video
                        ref={props.videoRef}
                        className={`camera-video ${mirrored ? "mirrored" : ""}`}
                        playsInline
                        muted
                        aria-label="Camera preview"
                    />
                )}

                {!props.error &&
                    props.showCameraFrame &&
                    props.frame.showCameraOverlay && (
                        <img
                            className="camera-frame-overlay"
                            src={props.frame.image}
                            style={overlayStyle}
                            alt=""
                            aria-hidden="true"
                        />
                    )}

                <Countdown value={props.countdown} />
                {timerNotice !== null && (
                    <div className="timer-notice" aria-live="polite">
                        {timerNotice}s
                    </div>
                )}
                <div className="flash" />
            </div>

            <PhotoProgress
                current={props.currentPhotoIndex}
                photos={props.photoCount}
            />

            <div
                className={`camera-bottom-controls ${sessionControlsHidden ? "is-retaking" : ""}`}
            >
                {!sessionControlsHidden && (
                    <div className="frame-selector-control">
                        <button
                            className="control-button"
                            type="button"
                            onClick={() =>
                                setIsFrameSelectorOpen((open) => !open)
                            }
                            aria-expanded={isFrameSelectorOpen}
                        >
                            FRAME: {props.frame.name}
                        </button>
                        {isFrameSelectorOpen && (
                            <div
                                className="frame-selector-backdrop"
                                onClick={() => setIsFrameSelectorOpen(false)}
                            >
                                <div
                                    className="frame-selector-popup"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-label={`${props.frame.name} frame preview`}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <button
                                        className="frame-selector-close"
                                        type="button"
                                        onClick={() =>
                                            setIsFrameSelectorOpen(false)
                                        }
                                        aria-label="Close frame preview"
                                        title="Close frame preview"
                                    >
                                        <X />
                                    </button>
                                    <div className="frame-selector-options">
                                        {props.frames.map((frame) => (
                                            <button
                                                key={frame.id}
                                                className={`frame-selector-option ${frame.id === props.frame.id ? "is-selected" : ""}`}
                                                type="button"
                                                onClick={() => {
                                                    props.onFrameChange(frame);
                                                    setIsFrameSelectorOpen(
                                                        false,
                                                    );
                                                }}
                                                aria-label={`Select ${frame.name} frame`}
                                                aria-pressed={
                                                    frame.id === props.frame.id
                                                }
                                            >
                                                <img
                                                    className="frame-selector-preview"
                                                    src={frame.image}
                                                    style={{
                                                        width: `${frame.width * 0.15}px`,
                                                        height: `${frame.height * 0.15}px`,
                                                    }}
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                                <span className="frame-selector-option-name">
                                                    {frame.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <CameraControls
                    onCapture={props.onCapture}
                    disabled={
                        props.isStarting ||
                        props.isCapturing ||
                        props.countdown !== null ||
                        !!props.error
                    }
                />

                {!sessionControlsHidden && (
                    <div className="mode-controls" aria-label="Capture mode">
                        {(["burst", "single"] as const).map((mode) => (
                            <button
                                key={mode}
                                className={`mode-button ${props.captureMode === mode ? "is-selected" : ""}`}
                                onClick={() => props.onCaptureModeChange(mode)}
                                disabled={
                                    props.isCapturing ||
                                    props.countdown !== null
                                }
                            >
                                {mode.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}

                <p className="camera-hint">{cameraHint}</p>
            </div>
        </main>
    );
}
