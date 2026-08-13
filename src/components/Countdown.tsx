interface Props {
    value: number | null;
}
export function Countdown({ value }: Props) {
    if (value === null) return null;
    return (
        <div
            className="countdown"
            aria-live="assertive"
            aria-label={`Photo in ${value}`}
        >
            {value}
        </div>
    );
}
