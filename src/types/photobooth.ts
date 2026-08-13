export type BoothStep =
    | "landing"
    | "camera"
    | "review"
    | "frame-selection"
    | "result";
export type CameraMode = "user" | "environment";

export interface PhotoSlot {
    x: number;
    y: number;
    width: number;
    height: number;
    objectPosition?: string;
}

export interface PhotoFrame {
    id: string;
    name: string;
    image: string;
    width: number;
    height: number;
    photoSlots: PhotoSlot[];
}

export interface CapturedPhoto {
    id: number;
    dataUrl: string;
}
