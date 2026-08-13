interface Props {
    current: number;
    photos: number;
}

export function PhotoProgress({ current, photos }: Props) {
    return (
        <div className="photo-progress">
            <strong>PHOTO {Math.min(current + 1, 4)} / 4</strong>

            <div className="progress-dots">
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className={
                            i <= current && i < photos
                                ? "done"
                                : i === current
                                  ? "active"
                                  : ""
                        }
                    >
                        {i + 1}
                    </span>
                ))}
            </div>
        </div>
    );
}
