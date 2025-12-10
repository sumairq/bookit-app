interface OverviewDetailProps {
  label: string;
  text: string;
  icon: string; // name of icon in icons.svg
}

export function OverviewDetail({ label, text, icon }: OverviewDetailProps) {
  return (
    <div className="overview-box__detail">
      <svg className="overview-box__icon">
        <use href={`/img/icons.svg#icon-${icon}`} />
      </svg>

      <span className="overview-box__label">{label}</span>
      <span className="overview-box__text">{text}</span>
    </div>
  );
}
