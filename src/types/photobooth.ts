export type BoothStep =
    | "landing"
    | "camera"
    | "review"
    // | "frame-selection"
    | "result";
export type CameraMode = "user" | "environment";

export interface ComposePhotostripOptions {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface PhotoReviewOptions {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CameraViewOptions {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface PhotoSlot {
    camera: CameraViewOptions;
    review: PhotoReviewOptions;
    compose: ComposePhotostripOptions;
    objectPosition?: string;
}

export interface PhotoFrame {
    id: string;
    name: string;
    image: string;
    width: number;
    height: number;
    showCameraOverlay: boolean;
    showReviewOverlay: boolean;
    photoSlots: PhotoSlot[];
}

export interface CapturedPhoto {
    id: number;
    dataUrl: string;
}
