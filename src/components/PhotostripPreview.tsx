interface Props {
    image: string | null;
}

export function PhotostripPreview({ image }: Props) {
    return (
        <div className="strip-preview">
            {image ? (
                <img src={image} alt="Completed HOT NERD THEORY photostrip" />
            ) : (
                <div className="preview-loading">COMPOSING...</div>
            )}
        </div>
    );
}
