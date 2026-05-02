import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useExperience } from "../hooks/useExperience";
import { useAuth } from "../context/useAuth";
import ReviewCard from "../components/ReviewCard";
import { OverviewDetail } from "../components/OverviewDetail";
import { api } from "../api/axios";
import { getExperienceImage, getUserAvatar } from "../utils/images";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

export default function ExperienceDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { experience, loading, error } = useExperience(slug);
  const { user } = useAuth();
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!experience) return;
    if (!mapboxgl.accessToken) return;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    experience.locations.forEach((loc) => {
      const el = document.createElement("div");
      el.style.cssText =
        "width:14px;height:14px;border-radius:50%;background:#d2451e;border:2px solid #f1ece1;box-shadow:0 0 0 4px rgba(210,69,30,0.2);";
      new mapboxgl.Marker({ element: el }).setLngLat(loc.coordinates).addTo(map);
      bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, { padding: 120 });

    return () => map.remove();
  }, [experience]);

  async function bookExperience() {
    if (!experience) return;
    setBooking(true);
    try {
      const res = await api.get(`/bookings/checkout-session/${experience._id}`);
      window.location.assign(res.data.session.url);
    } catch {
      setBooking(false);
    }
  }

  if (loading) return <p className="state">Loading…</p>;
  if (error) return <p className="state state--err">{error}</p>;
  if (!experience) return <p className="state">No experience found.</p>;

  const paragraphs = experience.description.split("\n").filter(Boolean);

  const nextDate =
    experience.timeSlots?.length > 0
      ? new Date(experience.timeSlots[0]).toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        })
      : "To be announced";

  return (
    <>
      {/* HERO */}
      <section className="x-hero">
        <img
          className="x-hero__img"
          src={getExperienceImage(experience.imageCover, 1800, 1100)}
          alt={experience.name}
        />
        <div className="x-hero__veil" />
        <div className="x-hero__inner">
          <div className="x-hero__content">
            <span className="x-hero__eyebrow">
              {experience.category} · Field entry
            </span>
            <h1 className="x-hero__title">{experience.name}</h1>
            <div className="x-hero__meta">
              <span className="x-hero__meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {experience.duration} days
              </span>
              <span className="x-hero__meta-sep" />
              <span className="x-hero__meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                {experience.startLocation.description}
              </span>
              <span className="x-hero__meta-sep" />
              <span className="x-hero__meta-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.5l2.95 6.45 7.05.62-5.35 4.7 1.6 6.93L12 17.7l-6.25 3.5 1.6-6.93L2 9.57l7.05-.62L12 2.5z" />
                </svg>
                {experience.ratingsAverage.toFixed(1)} · {experience.ratingsQuantity} reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="x-section">
        <div className="container">
          <div className="x-about">
            <aside className="spec" aria-label="Quick facts">
              <h3 className="spec__title">Quick facts</h3>
              <OverviewDetail label="Next date" text={nextDate} icon="calendar" />
              <OverviewDetail label="Category" text={experience.category} icon="trending-up" />
              <OverviewDetail label="Group size" text={`${experience.capacity} people`} icon="user" />
              <OverviewDetail label="Rating" text={`${experience.ratingsAverage} / 5`} icon="star" />

              <div className="spec__hosts">
                <h4 className="spec__hosts-title">Your hosts</h4>
                {experience.hosts.map((host) => (
                  <div className="host" key={host._id}>
                    <img
                      className="host__avatar"
                      src={getUserAvatar(host.photo, 80)}
                      alt={host.name}
                    />
                    <div>
                      <div className="host__name">{host.name}</div>
                      <div className="host__role">
                        {host.role === "lead-guide" ? "Lead host" : "Host"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <div>
              <h2 className="about__heading">
                About <em>{experience.name}</em>
              </h2>
              {paragraphs.length > 0 && (
                <p className="about__lead">{paragraphs[0]}</p>
              )}
              {paragraphs.slice(1).map((p, i) => (
                <p className="about__body" key={i}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="x-section x-section--narrow">
        <div className="container">
          <div className="x-map-head">
            <h2 className="about__heading" style={{ marginBottom: 0 }}>
              In <em>frame</em>.
            </h2>
            <span className="kicker">Plates I — III</span>
          </div>
        </div>
        <div className="x-gallery">
          {experience.images.slice(0, 3).map((img, i) => (
            <div className="x-gallery__cell" key={i}>
              <img
                src={getExperienceImage(img, 1000, 800)}
                alt={`${experience.name} plate ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* MAP */}
      <section className="x-section">
        <div className="container">
          <div className="x-map-head">
            <h2 className="about__heading" style={{ marginBottom: 0 }}>
              Where <em>we wander</em>.
            </h2>
            <span className="kicker">{experience.locations.length} stops</span>
          </div>
        </div>
        <div className="x-map">
          <div id="map" className="x-map__inner" />
        </div>
      </section>

      {/* REVIEWS */}
      {experience.reviews.length > 0 && (
        <section className="x-reviews">
          <div className="x-reviews__head">
            <h2 className="x-reviews__title">
              From the <em>guestbook</em>.
            </h2>
            <span className="kicker">{experience.reviews.length} entries</span>
          </div>
          <div className="x-reviews__rail">
            {experience.reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="x-cta">
        <div className="x-cta__panel">
          <div>
            <span className="eyebrow" style={{ color: "var(--ember)" }}>
              ◇ Reserve your spot
            </span>
            <h2 className="x-cta__title" style={{ marginTop: "0.6rem" }}>
              {experience.duration} days. One <em>unforgettable</em> chapter.
            </h2>
            <p className="x-cta__text">
              Small groups. Local hosts. No tourist traps. We promise.
            </p>
          </div>

          <div>
            <div className="x-cta__price">
              <span className="x-cta__price-value">${experience.price}</span>
              <span className="x-cta__price-unit">per person</span>
            </div>

            {user ? (
              <button
                className="btn btn--ember btn--lg btn--block x-cta__btn"
                onClick={bookExperience}
                disabled={booking}
              >
                {booking ? "Processing…" : "Book this experience"}
                <span aria-hidden="true">↗</span>
              </button>
            ) : (
              <Link className="btn btn--ember btn--lg btn--block x-cta__btn" to="/login">
                Sign in to book
                <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
