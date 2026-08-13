import { useCallback, useState } from "react";
import type {
    BoothStep,
    CameraMode,
    CapturedPhoto,
    PhotoFrame,
} from "../types/photobooth";

export const COUNTDOWN_SECONDS = 3;
export const COUNTDOWN_OPTIONS = [3, 5, 10] as const;
export type CountdownSeconds = (typeof COUNTDOWN_OPTIONS)[number];

export function usePhotobooth(defaultFrame: PhotoFrame) {
    const [step, setStep] = useState<BoothStep>("landing");
    const [cameraMode, setCameraMode] = useState<CameraMode>("user");
    const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [countdownSeconds, setCountdownSeconds] =
        useState<CountdownSeconds>(COUNTDOWN_SECONDS);
    const [selectedFrame, setSelectedFrame] =
        useState<PhotoFrame>(defaultFrame);
    const [composite, setComposite] = useState<string | null>(null);

    const reset = useCallback(() => {
        setStep("landing");
        setCameraMode("user");
        setPhotos([]);
        setCurrentPhotoIndex(0);
        setCountdown(null);
        setCountdownSeconds(COUNTDOWN_SECONDS);
        setSelectedFrame(defaultFrame);
        setComposite(null);
    }, [defaultFrame]);

    return {
        step,
        setStep,
        cameraMode,
        setCameraMode,
        photos,
        setPhotos,
        currentPhotoIndex,
        setCurrentPhotoIndex,
        countdown,
        setCountdown,
        countdownSeconds,
        setCountdownSeconds,
        selectedFrame,
        setSelectedFrame,
        composite,
        setComposite,
        reset,
    };
}
