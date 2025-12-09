import React from "react";
import type { Tour } from "../api/tours";
// import "./TourCard.css"; // optional if separating card styles

interface Props {
  tour: Tour;
}

const TourCard: React.FC<Props> = ({ tour }) => {
  const tourImage = `http://localhost:3000/img/tours/${tour.imageCover}`;

  const formattedStartDate = new Date(tour.startDates[0]).toLocaleString(
    "en-us",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="card">
      {/* HEADER */}
      <div className="card__header">
        <div className="card__picture">
          <div className="card__picture-overlay">&nbsp;</div>
          <img className="card__picture-img" src={tourImage} alt={tour.name} />
        </div>

        <h3 className="heading-tertirary">
          <span>{tour.name}</span>
        </h3>
      </div>

      {/* DETAILS */}
      <div className="card__details">
        <h4 className="card__sub-heading">
          {tour.difficulty} {tour.duration}-day tour
        </h4>

        <p className="card__text">{tour.summary}</p>

        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
          </svg>
          <span>{tour.startLocation.description}</span>
        </div>

        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="/img/icons.svg#icon-calendar"></use>
          </svg>
          <span>{formattedStartDate}</span>
        </div>

        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="/img/icons.svg#icon-flag"></use>
          </svg>
          <span>{tour.locations.length} stops</span>
        </div>

        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="/img/icons.svg#icon-user"></use>
          </svg>
          <span>{tour.maxGroupSize} people</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="card__footer">
        <p>
          <span className="card__footer-value">${tour.price}</span>{" "}
          <span className="card__footer-text">per person</span>
        </p>

        <p className="card__ratings">
          <span className="card__footer-value">{tour.ratingsAverage}</span>{" "}
          <span className="card__footer-text">
            rating ({tour.ratingsQuantity})
          </span>
        </p>

        <a href={`/tour/${tour.slug}`} className="btn btn--green btn--small">
          Details
        </a>
      </div>
    </div>
  );
};

export default TourCard;
