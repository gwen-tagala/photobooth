/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { LandingPage } from "./components/LandingPage";
import { CameraView } from "./components/CameraView";
import { PhotoReview } from "./components/PhotoReview";
import { FrameSelector } from "./components/FrameSelector";
import { ResultScreen } from "./components/ResultScreen";
import { frames } from "./data/frames";
import { useCamera } from "./hooks/useCamera";
import { usePhotobooth } from "./hooks/usePhotobooth";
import { captureVideoFrame } from "./utils/capturePhoto";
import { composePhotostrip } from "./utils/composePhotostrip";
import { downloadImage } from "./utils/downloadImage";
import "./styles.css";

const DEFAULT_FRAME = frames[0];

export default function App() {
    const booth = usePhotobooth(DEFAULT_FRAME);
    const camera = useCamera(booth.cameraMode);
    const [flash, setFlash] = useState(false);
    const captureTimeout = useRef<number | null>(null);

    const start = async () => {
        booth.setStep("camera");
    };

    const switchCamera = async () => {
        booth.setCameraMode(
            booth.cameraMode === "user" ? "environment" : "user",
        );
    };

    useEffect(() => {
        if (booth.step === "camera") void camera.startCamera();
        else camera.stopCamera();
        return () => {
            if (captureTimeout.current)
                window.clearTimeout(captureTimeout.current);
        };
    }, [booth.step, booth.cameraMode]);

    const takePhoto = () => {
        if (!camera.videoRef.current || booth.countdown !== null) return;
        let value = booth.countdownSeconds;
        booth.setCountdown(value);
        const timer = window.setInterval(() => {
            value -= 1;
            if (value > 0) booth.setCountdown(value);
            else {
                window.clearInterval(timer);
                booth.setCountdown(null);
                setFlash(true);
                window.setTimeout(() => setFlash(false), 180);
                const dataUrl = captureVideoFrame(
                    camera.videoRef.current!,
                    booth.cameraMode === "user",
                );
                booth.setPhotos((prev) => {
                    const next = [...prev];
                    next[booth.currentPhotoIndex] = {
                        id: booth.currentPhotoIndex + 1,
                        dataUrl,
                    };
                    return next;
                });
                if (booth.currentPhotoIndex < 3)
                    booth.setCurrentPhotoIndex((i) => i + 1);
                else {
                    camera.stopCamera();
                    booth.setStep("review");
                }
            }
        }, 1000);
        captureTimeout.current = timer;
    };

    const retake = async (index: number) => {
        booth.setCurrentPhotoIndex(index);
        booth.setStep("camera");
    };

    const continueToFrame = async () => {
        booth.setStep("frame-selection");
        const result = await composePhotostrip(
            booth.photos,
            booth.selectedFrame,
            2,
        );
        booth.setComposite(result);
    };

    const chooseFrame = async (frame: typeof DEFAULT_FRAME) => {
        booth.setSelectedFrame(frame);
        const result = await composePhotostrip(booth.photos, frame, 2);
        booth.setComposite(result);
    };

    const showResult = async () => {
        const result = await composePhotostrip(
            booth.photos,
            booth.selectedFrame,
            2,
        );
        booth.setComposite(result);
        booth.setStep("result");
    };

    const reset = () => {
        camera.stopCamera();
        booth.reset();
    };

    return (
        <>
            <div className={`app ${flash ? "is-flashing" : ""}`}>
            {booth.step === "landing" && <LandingPage onStart={start} />}
            {booth.step === "camera" && (
                <CameraView
                    videoRef={camera.videoRef}
                    cameraMode={booth.cameraMode}
                    frame={booth.selectedFrame}
                    countdown={booth.countdown}
                    countdownSeconds={booth.countdownSeconds}
                    currentPhotoIndex={booth.currentPhotoIndex}
                    photoCount={booth.photos.length}
                    error={camera.error}
                    isStarting={camera.isStarting}
                    onSwitch={switchCamera}
                    onCapture={takePhoto}
                    onRetry={camera.startCamera}
                    onCountdownSecondsChange={booth.setCountdownSeconds}
                />
            )}
            {booth.step === "review" && (
                <PhotoReview
                    photos={booth.photos}
                    onRetake={retake}
                    onContinue={continueToFrame}
                />
            )}
            {booth.step === "frame-selection" && (
                <FrameSelector
                    frames={frames}
                    selected={booth.selectedFrame}
                    onSelect={chooseFrame}
                    onContinue={showResult}
                    preview={booth.composite}
                />
            )}
            {booth.step === "result" && (
                <ResultScreen
                    image={booth.composite}
                    onDownload={() =>
                        booth.composite &&
                        downloadImage(
                            booth.composite,
                            "JISUNG_GLOBAL_HOT_NERD_THEORY_PHOTOBOOTH.png",
                        )
                    }
                    onReset={reset}
                />
            )}
            </div>
            <Analytics />
        </>
    );
}
