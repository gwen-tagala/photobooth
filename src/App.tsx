/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CameraView } from "./components/CameraView";
import { LandingPage } from "./components/LandingPage";
import { PhotoReview } from "./components/PhotoReview";
import { ResultScreen } from "./components/ResultScreen";
import { SingleCapture } from "./components/SingleCapture";
import { frames } from "./data/frames";
import { useCamera } from "./hooks/useCamera";
import { usePhotobooth } from "./hooks/usePhotobooth";
import type { CaptureStatus } from "./types/photobooth";
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
    const [captureStatus, setCaptureStatus] = useState<CaptureStatus>({
        state: "idle",
    });
    const [selectedRetakeIndex, setSelectedRetakeIndex] = useState<
        number | null
    >(null);
    const [isRetaking, setIsRetaking] = useState(false);
    const [reviewComposite, setReviewComposite] = useState<string | null>(null);
    const captureTimeout = useRef<number | null>(null);
    const isCapturingRef = useRef(false);
    const retakeIndexRef = useRef<number | null>(null);
    const photosRef = useRef(booth.photos);

    const cancelCaptureSequence = () => {
        if (captureTimeout.current !== null) {
            window.clearTimeout(captureTimeout.current);
            window.clearInterval(captureTimeout.current);
            captureTimeout.current = null;
        }
        isCapturingRef.current = false;
        setIsCapturing(false);
        setCaptureStatus({ state: "idle" });
        booth.setCountdown(null);
    };

    const showResult = async (photos = booth.photos) => {
        const result = await composePhotostrip(photos, booth.selectedFrame, 2);
        booth.setComposite(result);
        booth.setStep("result");
    };

    const finishCapture = (photoIndex: number, dataUrl: string) => {
        const nextPhotos = [...photosRef.current];
        nextPhotos[photoIndex] = { id: photoIndex + 1, dataUrl };
        photosRef.current = nextPhotos;
        booth.setPhotos(nextPhotos);

        if (booth.captureMode === "single") {
            isCapturingRef.current = false;
            setIsCapturing(false);
            setIsRetaking(false);
            camera.stopCamera();
            booth.setStep("single-capture");
            return;
        }
        if (retakeIndexRef.current !== null || photoIndex === 3) {
            retakeIndexRef.current = null;
            isCapturingRef.current = false;
            setIsCapturing(false);
            setIsRetaking(false);
            camera.stopCamera();
            setSelectedRetakeIndex(null);
            booth.setStep("burst-review");
            void composePhotostrip(nextPhotos, booth.selectedFrame, 2).then(
                setReviewComposite,
            );
        } else {
            booth.setCurrentPhotoIndex(photoIndex + 1);
            captureTimeout.current = window.setTimeout(
                () => captureNextPhoto(photoIndex + 1),
                700,
            );
        }
    };

    const captureNextPhoto = (photoIndex: number) => {
        if (!camera.videoRef.current) {
            cancelCaptureSequence();
            return;
        }
        setCaptureStatus({ state: "taking", photoIndex });
        let value = booth.countdownSeconds;
        booth.setCountdown(value);
        const timer = window.setInterval(() => {
            value -= 1;
            if (value > 0) {
                booth.setCountdown(value);
                return;
            }
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
            setCaptureStatus({ state: "captured", photoIndex });
            finishCapture(photoIndex, dataUrl);
        }, 1000);
        captureTimeout.current = timer;
    };

    const takePhoto = () => {
        if (isCapturingRef.current || !camera.videoRef.current) return;
        isCapturingRef.current = true;
        setIsCapturing(true);
        captureNextPhoto(booth.currentPhotoIndex);
    };

    const retakeBurstPhoto = () => {
        if (selectedRetakeIndex === null) return;
        retakeIndexRef.current = selectedRetakeIndex;
        setIsRetaking(true);
        booth.setCurrentPhotoIndex(selectedRetakeIndex);
        booth.setStep("camera");
    };

    const nextSinglePhoto = () => {
        if (booth.currentPhotoIndex === 3) void showResult();
        else {
            booth.setCurrentPhotoIndex(booth.currentPhotoIndex + 1);
            booth.setStep("camera");
        }
    };

    const retakeSinglePhoto = () => {
        setIsRetaking(true);
        booth.setStep("camera");
    };

    const start = () => booth.setStep("camera");
    const switchCamera = () =>
        booth.setCameraMode(
            booth.cameraMode === "user" ? "environment" : "user",
        );
    const reset = () => {
        cancelCaptureSequence();
        camera.stopCamera();
        setSelectedRetakeIndex(null);
        setIsRetaking(false);
        setReviewComposite(null);
        photosRef.current = [];
        booth.reset();
    };

    useEffect(() => {
        if (booth.step === "camera") void camera.startCamera();
        else camera.stopCamera();
        return cancelCaptureSequence;
    }, [booth.step, booth.cameraMode]);

    useEffect(() => {
        if (booth.step === "burst-review" && booth.photos.length === 4) {
            void composePhotostrip(booth.photos, booth.selectedFrame, 2).then(
                setReviewComposite,
            );
        }
    }, [booth.step, booth.photos, booth.selectedFrame]);

    return (
        <>
            <div className={`app ${flash ? "is-flashing" : ""}`}>
                {booth.step === "landing" && <LandingPage onStart={start} />}
                {booth.step === "camera" && (
                    <CameraView
                        videoRef={camera.videoRef}
                        cameraMode={booth.cameraMode}
                        frame={booth.selectedFrame}
                        frames={frames}
                        countdown={booth.countdown}
                        countdownSeconds={booth.countdownSeconds}
                        currentPhotoIndex={booth.currentPhotoIndex}
                        activeSlotIndex={booth.currentPhotoIndex}
                        previewSlotIndex={null}
                        photoCount={booth.photos.length}
                        error={camera.error}
                        isStarting={camera.isStarting}
                        isCapturing={isCapturing}
                        captureStatus={captureStatus}
                        captureMode={booth.captureMode}
                        showCameraFrame={booth.showCameraFrame}
                        onSwitch={switchCamera}
                        onCapture={takePhoto}
                        onRetry={camera.startCamera}
                        onCountdownSecondsChange={booth.setCountdownSeconds}
                        onPreviewSlotChange={() => undefined}
                        onCaptureModeChange={booth.setCaptureMode}
                        onShowCameraFrameChange={booth.setShowCameraFrame}
                        onFrameChange={booth.setSelectedFrame}
                        isRetaking={isRetaking}
                    />
                )}
                {booth.step === "single-capture" && (
                    <SingleCapture
                        photo={booth.photos[booth.currentPhotoIndex]}
                        index={booth.currentPhotoIndex}
                        frame={booth.selectedFrame}
                        onRetake={retakeSinglePhoto}
                        onNext={nextSinglePhoto}
                        isLast={booth.currentPhotoIndex === 3}
                    />
                )}
                {booth.step === "burst-review" && (
                    <PhotoReview
                        photos={booth.photos}
                        frame={booth.selectedFrame}
                        image={reviewComposite}
                        selectedIndex={selectedRetakeIndex}
                        onSelect={setSelectedRetakeIndex}
                        onRetake={retakeBurstPhoto}
                        onContinue={() => void showResult()}
                    />
                )}
                {booth.step === "result" && (
                    <ResultScreen
                        image={booth.composite}
                        frame={booth.selectedFrame}
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
