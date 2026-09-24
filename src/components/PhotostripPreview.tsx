import { useEffect, useState } from "react";

interface Props {
    image: string | null;
}

export function PhotostripPreview({ image }: Props) {
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
