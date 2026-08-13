import type { RefObject } from "react";
import type { CameraMode } from "../types/photobooth";
import { CameraControls } from "./CameraControls";
import { Countdown } from "./Countdown";
import { PhotoProgress } from "./PhotoProgress";

interface Props {
    videoRef: RefObject<HTMLVideoElement | null>;
    cameraMode: CameraMode;
    countdown: number | null;
    currentPhotoIndex: number;
    photoCount: number;
    error: string | null;
    isStarting: boolean;
    onSwitch: () => void;
    onCapture: () => void;
    onRetry: () => void;
}

export function CameraView(props: Props) {
    const mirrored = props.cameraMode === "user";
    return (
        <main className="camera-page page-shell">
            <div className="camera-top">
                <span className="eyebrow">HOT NERD THEORY</span>
                <span className="camera-label">4-CUT PHOTOBOOTH</span>
            </div>

            <div className="camera-stage">
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
            <CameraControls
                onSwitch={props.onSwitch}
                onCapture={props.onCapture}
                disabled={
                    props.isStarting ||
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
