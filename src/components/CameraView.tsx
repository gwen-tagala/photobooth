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
    activeSlotIndex: number;
    previewSlotIndex: number | null;
    photoCount: number;
    error: string | null;
    isStarting: boolean;
    isCapturing: boolean;
    onSwitch: () => void;
    onCapture: () => void;
    onRetry: () => void;
    onCountdownSecondsChange: (seconds: CountdownSeconds) => void;
    onPreviewSlotChange: (index: number | null) => void;
}

export function CameraView(props: Props) {
    const mirrored = props.cameraMode === "user";
    const slot = props.frame.photoSlots[props.activeSlotIndex];
    const cameraSlot = slot.camera;

    const overlayStyle = {
        width: `${(props.frame.width / cameraSlot.width) * 100}%`,
        left: `${(-cameraSlot.x / cameraSlot.width) * 100}%`,
        top: `${(-cameraSlot.y / cameraSlot.width) * 100}%`,
    };

    return (
        <main className="camera-page page-shell">
            <div className="camera-top">
                <span className="eyebrow">HOT NERD THEORY</span>
                <span className="camera-label">PHOTOBOOTH SESSION</span>
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
                {!props.error && (
                    <img
                        className="camera-frame-overlay"
                        src={props.frame.image}
                        style={overlayStyle}
                        alt=""
                        aria-hidden="true"
                    />
                )}
                {/* <div className="viewfinder-corner tl" />
                <div className="viewfinder-corner tr" />
                <div className="viewfinder-corner bl" />
                <div className="viewfinder-corner br" /> */}
                <Countdown value={props.countdown} />
                <div className="flash" />
            </div>

            <PhotoProgress
                current={props.currentPhotoIndex}
                photos={props.photoCount}
            />
            {/* <div className="slot-check" aria-label="Slot alignment check">
                <span>SLOT CHECK</span>
                {[0, 1, 2, 3].map((index) => (
                    <button
                        key={index}
                        className={
                            props.activeSlotIndex === index
                                ? "slot-check-option is-selected"
                                : "slot-check-option"
                        }
                        onClick={() => props.onPreviewSlotChange(index)}
                        disabled={props.countdown !== null || props.isCapturing}
                    >
                        {index + 1}
                    </button>
                ))}
            </div> */}
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
                Choose a timer, then take your four photos.
            </p>
        </main>
    );
}
