import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTour } from "../hooks/useTour";
import mapboxgl from "mapbox-gl";
import ReviewCard from "../components/ReviewCard";
import { OverviewDetail } from "../components/OverviewDetail";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

export default function TourDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { tour, loading, error } = useTour(slug);

  // Mapbox initialization
  useEffect(() => {
    if (!tour) return;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v12",
      scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    tour.locations.forEach((loc) => {
      new mapboxgl.Marker({ color: "#55c57a" })
        .setLngLat(loc.coordinates)
        .addTo(map);

      bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, { padding: 150 });

    return () => map.remove();
  }, [tour]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!tour) return <p>No tour found.</p>;

  const paragraphs = tour.description.split("\n");
  const nextDate = new Date(tour.startDates[0]).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <main className="main">
        {/* SECTION: HEADER */}
        <section className="section-header">
          <div className="header__hero">
            <div className="header__hero-overlay">&nbsp;</div>
            <img
              className="header__hero-img"
              src={`/img/tours/${tour.imageCover}`}
              alt={tour.name}
            />
          </div>

          <div className="heading-box">
            <h1 className="heading-primary">
              <span>{tour.name} tour</span>
            </h1>

            <div className="heading-box__group">
              <div className="heading-box__detail">
                <svg className="heading-box__icon">
                  <use href="/img/icons.svg#icon-clock" />
                </svg>
                <span className="heading-box__text">{tour.duration} days</span>
              </div>

              <div className="heading-box__detail">
                <svg className="heading-box__icon">
                  <use href="/img/icons.svg#icon-map-pin" />
                </svg>
                <span className="heading-box__text">
                  {tour.startLocation.description}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: DESCRIPTION */}
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
                  label="Difficulty"
                  text={tour.difficulty}
                  icon="trending-up"
                />

                <OverviewDetail
                  label="Participants"
                  text={`${tour.maxGroupSize} people`}
                  icon="user"
                />

                <OverviewDetail
                  label="Rating"
                  text={`${tour.ratingsAverage} / 5`}
                  icon="star"
                />
              </div>

              {/* TOUR GUIDES */}
              <div className="overview-box__group">
                <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>

                {tour.guides.map((guide) => (
                  <div className="overview-box__detail" key={guide._id}>
                    <img
                      className="overview-box__img"
                      src={`/img/users/${guide.photo}`}
                      alt={guide.name}
                    />

                    <span className="overview-box__label">
                      {guide.role === "lead-guide"
                        ? "Lead guide"
                        : "Tour guide"}
                    </span>

                    <span className="overview-box__text">{guide.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TOUR DESCRIPTION */}
            <div className="description-box">
              <h2 className="heading-secondary ma-bt-lg">
                About {tour.name} tour
              </h2>

              {paragraphs.map((p, i) => (
                <p className="description__text" key={i}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: PICTURES */}
        <section className="section-pictures">
          {tour.images.map((img, i) => (
            <div className="picture-box" key={i}>
              <img
                src={`/img/tours/${img}`}
                alt={`${tour.name} picture ${i + 1}`}
                className={`picture-box__img picture-box__img--${i + 1}`}
              />
            </div>
          ))}
        </section>

        {/* SECTION: MAP */}
        <section className="section-map">
          <div id="map" style={{ height: "500px" }} />
        </section>

        {/* SECTION: REVIEWS */}
        <section className="section-reviews">
          <div className="reviews">
            {tour.reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        </section>

        {/* SECTION: CTA */}
        <section className="section-cta">
          <div className="cta">
            <div className="cta__img cta__img--logo">
              <img src="/img/logo-white.png" alt="Natours logo" />
            </div>

            <img
              className="cta__img cta__img--1"
              src={`/img/tours/${tour.images[1]}`}
              alt="Tour picture"
            />

            <img
              className="cta__img cta__img--2"
              src={`/img/tours/${tour.images[2]}`}
              alt="Tour picture"
            />

            <div className="cta__content">
              <h2 className="heading-secondary">What are you waiting for?</h2>
              <p className="cta__text">
                {tour.duration} days. 1 adventure. Infinite memories. Make it
                yours today!
              </p>

              <button
                className="btn btn--green span-all-rows"
                onClick={() => console.log("Book:", tour._id)}
              >
                Book tour now!
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
