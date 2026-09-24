import { useCallback, useEffect, useRef, useState } from "react";
import type { CameraMode } from "../types/photobooth";

export function useCamera(mode: CameraMode) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const requestIdRef = useRef(0);
    const [error, setError] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);

    const stopCamera = useCallback(() => {
        streamRef.current
            ?.getTracks()
            .forEach((track: MediaStreamTrack) => track.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
    }, []);

    const startCamera = useCallback(async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setError(
                "Your browser does not support camera access. Please use a modern Safari, Chrome, or Edge browser.",
            );
            return false;
        }

        setIsStarting(true);
        setError(null);
        const requestId = ++requestIdRef.current;
        stopCamera();

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: mode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });
            if (requestId !== requestIdRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return false;
            }
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            return true;
        } catch {
            setError(
                "Camera access is needed to use the photobooth. Please allow camera access in your browser settings and try again.",
            );
            return false;
        } finally {
            setIsStarting(false);
        }
    }, [mode, stopCamera]);

    useEffect(() => () => stopCamera(), [stopCamera]);

    return { videoRef, error, isStarting, startCamera, stopCamera };
}
