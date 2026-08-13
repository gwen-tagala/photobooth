import type { RefObject } from "react";
import type { CountdownSeconds } from "../hooks/usePhotobooth";
import type { CameraMode, PhotoFrame } from "../types/photobooth";
import { CameraControls } from "./CameraControls";
import { Countdown } from "./Countdown";
import { PhotoProgress } from "./PhotoProgress";

interface Props {
    videoRef: RefObject<HTMLVideoElement | null>;
    cameraMode: CameraMode;
    frame: PhotoFrame;
    countdown: number | null;
    countdownSeconds: CountdownSeconds;
    currentPhotoIndex: number;
    photoCount: number;
    error: string | null;
    isStarting: boolean;
    isCapturing: boolean;
    onSwitch: () => void;
    onCapture: () => void;
    onRetry: () => void;
    onCountdownSecondsChange: (seconds: CountdownSeconds) => void;
}

export function CameraView(props: Props) {
    const mirrored = props.cameraMode === "user";
    const slot = props.frame.photoSlots[props.currentPhotoIndex];
    const overlayStyle = {
        width: `${(props.frame.width / slot.width) * 100}%`,
        left: `${(-slot.x / slot.width) * 100}%`,
        top: `${(-slot.y / slot.width) * 100}%`,
    };
    return (
        <main className="camera-page page-shell">
            <div className="camera-top">
                <span className="eyebrow">HOT NERD THEORY</span>
                <span className="camera-label">4-CUT PHOTOBOOTH</span>
            </div>

            <div
                className="camera-stage"
                style={{ aspectRatio: `${slot.width} / ${slot.height}` }}
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
                {!props.error && (
                    <img
                        className="camera-frame-overlay"
                        src={props.frame.image}
                        style={overlayStyle}
                        alt=""
                        aria-hidden="true"
                    />
                )}
                <div className="viewfinder-corner tl" />
                <div className="viewfinder-corner tr" />
                <div className="viewfinder-corner bl" />
                <div className="viewfinder-corner br" />
                <Countdown value={props.countdown} />
                <div className="flash" />
            </div>

            <PhotoProgress
                current={props.currentPhotoIndex}
                photos={props.photoCount}
            />
            <div className="countdown-settings" aria-label="Countdown timer">
                <span>TIMER</span>
                {[3, 5, 10].map((seconds) => (
                    <button
                        key={seconds}
                        className={
                            props.countdownSeconds === seconds
                                ? "timer-option is-selected"
                                : "timer-option"
                        }
                        onClick={() =>
                            props.onCountdownSecondsChange(
                                seconds as CountdownSeconds,
                            )
                        }
                        disabled={props.countdown !== null || props.isCapturing}
                    >
                        {seconds}S
                    </button>
                ))}
            </div>
            <CameraControls
                onSwitch={props.onSwitch}
                onCapture={props.onCapture}
                disabled={
                    props.isStarting ||
                    props.isCapturing ||
                    props.countdown !== null ||
                    !!props.error
                }
            />
            <p className="camera-hint">
                Smile, genius. The countdown starts when you tap the shutter.
            </p>
        </main>
    );
}
