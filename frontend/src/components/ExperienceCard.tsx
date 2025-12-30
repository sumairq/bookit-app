import React from "react";
import type { Experience } from "../types/Experience";

interface Props {
  experience: Experience;
}

const ExperienceCard: React.FC<Props> = ({ experience }) => {
  const imageUrl = `http://localhost:3000/img/experiences/${experience.imageCover}`;

  const nextDate =
    experience.timeSlots && experience.timeSlots.length > 0
      ? new Date(experience.timeSlots[0]).toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        })
      : "No upcoming dates";

  return (
    <div className="card">
      {/* HEADER */}
      <div className="card__header">
        <div className="card__picture">
          <div className="card__picture-overlay">&nbsp;</div>
          <img
            className="card__picture-img"
            src={imageUrl}
            alt={experience.name}
          />
        </div>

        <h3 className="heading-tertirary">
          <span>{experience.name}</span>
        </h3>
      </div>

      {/* DETAILS */}
      <div className="card__details">
        <h4 className="card__sub-heading">
          {experience.category} · {experience.duration}-day experience
        </h4>

        <p className="card__text">{experience.summary}</p>

        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="/img/icons.svg#icon-map-pin" />
          </svg>
          <span>{experience.startLocation.description}</span>
        </div>

        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="/img/icons.svg#icon-calendar" />
          </svg>
          <span>{nextDate}</span>
        </div>

        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="/img/icons.svg#icon-flag" />
          </svg>
          <span>{experience.locations.length} stops</span>
        </div>

        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="/img/icons.svg#icon-user" />
          </svg>
          <span>{experience.capacity} people</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="card__footer">
        <p>
          <span className="card__footer-value">${experience.price}</span>{" "}
          <span className="card__footer-text">per person</span>
        </p>

        <p className="card__ratings">
          <span className="card__footer-value">
            {experience.ratingsAverage}
          </span>{" "}
          <span className="card__footer-text">
            rating ({experience.ratingsQuantity})
          </span>
        </p>

        <a
          href={`/experience/${experience.slug}`}
          className="btn btn--green btn--small"
        >
          Details
        </a>
      </div>
    </div>
  );
};

export default ExperienceCard;
