import React from "react";
import { Link } from "react-router-dom";
import type { Experience } from "../types/Experience";
import { getExperienceImage } from "../utils/images";

interface Props {
  experience: Experience;
  index?: number;
}

const Icon = {
  pin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  cal: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </svg>
  ),
};

const ExperienceCard: React.FC<Props> = ({ experience, index = 0 }) => {
  const imageUrl = getExperienceImage(experience.imageCover);

  const nextDate =
    experience.timeSlots && experience.timeSlots.length > 0
      ? new Date(experience.timeSlots[0]).toLocaleString("en-us", {
          month: "short",
          year: "numeric",
        })
      : "Dates TBA";

  const filledStars = Math.round(experience.ratingsAverage);
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="xcard">
      <div className="xcard__media">
        <span className="xcard__index">№ {num}</span>
        <img
          className="xcard__img"
          src={imageUrl}
          alt={experience.name}
          loading="lazy"
        />
        <span className="xcard__category">{experience.category}</span>
      </div>

      <div className="xcard__body">
        <h3 className="xcard__title">{experience.name}</h3>
        <p className="xcard__summary">{experience.summary}</p>

        <div className="xcard__meta">
          <div className="xcard__meta-row">
            {Icon.pin}
            <span>{experience.startLocation.description}</span>
          </div>
          <div className="xcard__meta-row">
            {Icon.cal}
            <span>{nextDate}</span>
          </div>
          <div className="xcard__meta-row">
            {Icon.flag}
            <span>
              {experience.locations.length} stops · {experience.duration}d
            </span>
          </div>
          <div className="xcard__meta-row">
            {Icon.user}
            <span>Up to {experience.capacity}</span>
          </div>
        </div>

        <div className="xcard__footer">
          <div>
            <div className="xcard__price-label">From</div>
            <div className="xcard__price">
              ${experience.price}
              <small> /pp</small>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.6rem" }}>
            <span className="xcard__rating" title={`${experience.ratingsAverage} / 5`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.5l2.95 6.45 7.05.62-5.35 4.7 1.6 6.93L12 17.7l-6.25 3.5 1.6-6.93L2 9.57l7.05-.62L12 2.5z" />
              </svg>
              <span>{experience.ratingsAverage.toFixed(1)}</span>
              <span style={{ color: "var(--ink-faint)" }}>·</span>
              <span style={{ color: "var(--ink-faint)" }}>
                {experience.ratingsQuantity}
                {filledStars < 0 ? "" : ""}
              </span>
            </span>

            <Link to={`/experience/${experience.slug}`} className="xcard__cta">
              Read entry
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;
