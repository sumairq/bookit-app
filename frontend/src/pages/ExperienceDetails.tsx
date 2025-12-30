import { useParams } from "react-router-dom";
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

import { useExperience } from "../hooks/useExperience";
import ReviewCard from "../components/ReviewCard";
import { OverviewDetail } from "../components/OverviewDetail";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

export default function ExperienceDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { experience, loading, error } = useExperience(slug);
  console.log(slug, experience);

  // -----------------------------
  // Mapbox initialization
  // -----------------------------
  useEffect(() => {
    if (!experience) return;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v12",
      scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    experience.locations.forEach((loc) => {
      new mapboxgl.Marker({ color: "#C47A2C" }) // warm professional color
        .setLngLat(loc.coordinates)
        .addTo(map);

      bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, { padding: 150 });

    return () => map.remove();
  }, [experience]);

  // -----------------------------
  // Loading & error states
  // -----------------------------
  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!experience) return <p>No experience found.</p>;

  // -----------------------------
  // Derived values
  // -----------------------------
  const paragraphs = experience.description.split("\n");

  const nextDate =
    experience.timeSlots?.length > 0
      ? new Date(experience.timeSlots[0]).toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        })
      : "To be announced";

  return (
    <main className="main">
      {/* ================= HEADER ================= */}
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={`/img/experiences/${experience.imageCover}`}
            alt={experience.name}
          />
        </div>

        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{experience.name}</span>
          </h1>

          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use href="/img/icons.svg#icon-clock" />
              </svg>
              <span className="heading-box__text">
                {experience.duration} days
              </span>
            </div>

            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use href="/img/icons.svg#icon-map-pin" />
              </svg>
              <span className="heading-box__text">
                {experience.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DESCRIPTION ================= */}
      <section className="section-description">
        <div className="overview-box">
          <div>
            {/* QUICK FACTS */}
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>

              <OverviewDetail
                label="Next date"
                text={nextDate}
                icon="calendar"
              />

              <OverviewDetail
                label="Category"
                text={experience.category}
                icon="trending-up"
              />

              <OverviewDetail
                label="Participants"
                text={`${experience.capacity} people`}
                icon="user"
              />

              <OverviewDetail
                label="Rating"
                text={`${experience.ratingsAverage} / 5`}
                icon="star"
              />
            </div>

            {/* HOSTS */}
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">
                Your experience hosts
              </h2>

              {experience.hosts.map((host) => (
                <div className="overview-box__detail" key={host._id}>
                  <img
                    className="overview-box__img"
                    src={`/img/users/${host.photo}`}
                    alt={host.name}
                  />

                  <span className="overview-box__label">
                    {host.role === "lead-guide" ? "Lead host" : "Host"}
                  </span>

                  <span className="overview-box__text">{host.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TEXT DESCRIPTION */}
          <div className="description-box">
            <h2 className="heading-secondary ma-bt-lg">
              About {experience.name}
            </h2>

            {paragraphs.map((p, i) => (
              <p className="description__text" key={i}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PICTURES ================= */}
      <section className="section-pictures">
        {experience.images.map((img, i) => (
          <div className="picture-box" key={i}>
            <img
              src={`/img/experiences/${img}`}
              alt={`${experience.name} image ${i + 1}`}
              className={`picture-box__img picture-box__img--${i + 1}`}
            />
          </div>
        ))}
      </section>

      {/* ================= MAP ================= */}
      <section className="section-map">
        <div id="map" style={{ height: "500px" }} />
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="section-reviews">
        <div className="reviews">
          {experience.reviews.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Logo" />
          </div>

          {experience.images[1] && (
            <img
              className="cta__img cta__img--1"
              src={`/img/experiences/${experience.images[1]}`}
              alt="Experience image"
            />
          )}

          {experience.images[2] && (
            <img
              className="cta__img cta__img--2"
              src={`/img/experiences/${experience.images[2]}`}
              alt="Experience image"
            />
          )}

          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>

            <p className="cta__text">
              {experience.duration} days. One unforgettable experience.
            </p>

            <button
              className="btn btn--green span-all-rows"
              onClick={() => console.log("Book experience:", experience._id)}
            >
              Book now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
