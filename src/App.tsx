/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { LandingPage } from "./components/LandingPage";
import { CameraView } from "./components/CameraView";
import { PhotoReview } from "./components/PhotoReview";
// import { FrameSelector } from "./components/FrameSelector";
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
    const [isCapturing, setIsCapturing] = useState(false);
    const [previewSlotIndex, setPreviewSlotIndex] = useState<number | null>(
        null,
    );
    const captureTimeout = useRef<number | null>(null);
    const isCapturingRef = useRef(false);
    const retakeIndexRef = useRef<number | null>(null);

    const start = async () => {
        booth.setStep("camera");
    };

    const switchCamera = async () => {
        booth.setCameraMode(
            booth.cameraMode === "user" ? "environment" : "user",
        );
    };

    const cancelCaptureSequence = () => {
        if (captureTimeout.current !== null) {
            window.clearInterval(captureTimeout.current);
            window.clearTimeout(captureTimeout.current);
            captureTimeout.current = null;
        }
        isCapturingRef.current = false;
        setIsCapturing(false);
        booth.setCountdown(null);
    };

    const captureNextPhoto = (photoIndex: number) => {
        if (!camera.videoRef.current) {
            cancelCaptureSequence();
            return;
        }

        let value = booth.countdownSeconds;
        booth.setCountdown(value);

        const timer = window.setInterval(() => {
            value -= 1;

            if (value > 0) {
                booth.setCountdown(value);
            } else {
                window.clearInterval(timer);
                booth.setCountdown(null);
                setFlash(true);
                window.setTimeout(() => setFlash(false), 180);

                const slot = booth.selectedFrame.photoSlots[photoIndex];
                const dataUrl = captureVideoFrame(
                    camera.videoRef.current!,
                    booth.cameraMode === "user",
                    slot.camera.width,
                    slot.camera.height,
                );

                booth.setPhotos((prev) => {
                    const next = [...prev];
                    next[photoIndex] = {
                        id: photoIndex + 1,
                        dataUrl,
                    };
                    return next;
                });

                // if (photoIndex < 3) {
                //     booth.setCurrentPhotoIndex(photoIndex + 1);
                //     captureTimeout.current = window.setTimeout(
                //         () => captureNextPhoto(photoIndex + 1),
                //         700,
                //     );
                // } else {
                //     camera.stopCamera();
                //     booth.setStep("review");
                //     isCapturingRef.current = false;
                //     setIsCapturing(false);
                // }

                if (retakeIndexRef.current !== null) {
                    // Retake only this photo, then return to review.
                    retakeIndexRef.current = null;
                    camera.stopCamera();
                    booth.setStep("review");
                    isCapturingRef.current = false;
                    setIsCapturing(false);
                } else if (photoIndex < 3) {
                    // Normal 4-photo sequence.
                    booth.setCurrentPhotoIndex(photoIndex + 1);
                    captureTimeout.current = window.setTimeout(
                        () => captureNextPhoto(photoIndex + 1),
                        700,
                    );
                } else {
                    // Finished all 4 photos.
                    camera.stopCamera();
                    booth.setStep("review");
                    isCapturingRef.current = false;
                    setIsCapturing(false);
                }
            }
        }, 1000);
        captureTimeout.current = timer;
    };

    const takePhoto = () => {
        if (isCapturingRef.current || !camera.videoRef.current) return;
        setPreviewSlotIndex(null);
        isCapturingRef.current = true;
        setIsCapturing(true);
        captureNextPhoto(booth.currentPhotoIndex);
    };

    useEffect(() => {
        if (booth.step === "camera") void camera.startCamera();
        else camera.stopCamera();
        return cancelCaptureSequence;
    }, [booth.step, booth.cameraMode]);

    const retake = (index: number) => {
        retakeIndexRef.current = index;
        setPreviewSlotIndex(null);
        booth.setCurrentPhotoIndex(index);
        booth.setStep("camera");
    };

    // const continueToFrame = async () => {
    //     booth.setStep("frame-selection");
    //     const result = await composePhotostrip(
    //         booth.photos,
    //         booth.selectedFrame,
    //         2,
    //     );
    //     booth.setComposite(result);
    // };

    // const chooseFrame = async (frame: typeof DEFAULT_FRAME) => {
    //     booth.setSelectedFrame(frame);
    //     const result = await composePhotostrip(booth.photos, frame, 2);
    //     booth.setComposite(result);
    // };

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
        cancelCaptureSequence();
        setPreviewSlotIndex(null);
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
                        activeSlotIndex={
                            previewSlotIndex ?? booth.currentPhotoIndex
                        }
                        previewSlotIndex={previewSlotIndex}
                        photoCount={booth.photos.length}
                        error={camera.error}
                        isStarting={camera.isStarting}
                        isCapturing={isCapturing}
                        onSwitch={switchCamera}
                        onCapture={takePhoto}
                        onRetry={camera.startCamera}
                        onCountdownSecondsChange={booth.setCountdownSeconds}
                        onPreviewSlotChange={setPreviewSlotIndex}
                    />
                )}
                {booth.step === "review" && (
                    <PhotoReview
                        photos={booth.photos}
                        frame={booth.selectedFrame}
                        onRetake={retake}
                        onContinue={showResult}
                    />
                )}
                {/* {booth.step === "frame-selection" && (
                    <FrameSelector
                        frames={frames}
                        selected={booth.selectedFrame}
                        onSelect={chooseFrame}
                        onContinue={showResult}
                        preview={booth.composite}
                    />
                )} */}
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
