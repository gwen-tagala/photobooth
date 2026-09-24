import { useEffect, useState } from "react";
import type { PhotoFrame } from "../types/photobooth";

interface Props {
    image: string | null;
    frame: PhotoFrame;
}

export function PhotostripPreview({ image, frame }: Props) {
    const [minimumLoadingComplete, setMinimumLoadingComplete] = useState(false);

    useEffect(() => {
        const timeout = window.setTimeout(
            () => setMinimumLoadingComplete(true),
            3000,
        );
        return () => window.clearTimeout(timeout);
    }, []);

    const isLoading = !image || !minimumLoadingComplete;

    return (
        <div className="strip-preview" aria-busy={isLoading}>
            {!isLoading && image ? (
                <img src={image} alt="Completed HOT NERD THEORY photostrip" />
            ) : (
                <div
                    className="preview-skeleton"
                    style={{
                        width: `${frame.width * 0.75}px`,
                        maxWidth: "75%",
                        aspectRatio: `${frame.width} / ${frame.height}`,
                        marginInline: "auto",
                    }}
                    aria-label="Composing photo strip"
                >
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            )}
        </div>
    );
}
