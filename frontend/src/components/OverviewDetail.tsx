interface OverviewDetailProps {
  label: string;
  text: string;
  icon: "calendar" | "trending-up" | "user" | "star" | "clock" | "map-pin";
}

const Icons: Record<OverviewDetailProps["icon"], React.ReactNode> = {
  calendar: (
    <svg viewBox="0 0 24 24">
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  ),
  "trending-up": (
    <svg viewBox="0 0 24 24">
      <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2.5l2.95 6.45 7.05.62-5.35 4.7 1.6 6.93L12 17.7l-6.25 3.5 1.6-6.93L2 9.57l7.05-.62L12 2.5z" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  "map-pin": (
    <svg viewBox="0 0 24 24">
      <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
};

export function OverviewDetail({ label, text, icon }: OverviewDetailProps) {
  return (
    <div className="spec__row">
      <span className="spec__icon" aria-hidden="true">
        {Icons[icon]}
      </span>
      <span>
        <span className="spec__label">{label}</span>
        <span className="spec__text" style={{ display: "block" }}>{text}</span>
      </span>
    </div>
  );
}
