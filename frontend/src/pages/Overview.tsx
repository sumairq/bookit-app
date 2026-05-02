import { useLocation } from "react-router-dom";
import { useExperiences } from "../hooks/useExperiences";
import { useMyExperiences } from "../hooks/useMyExperiences";
import ExperienceCard from "../components/ExperienceCard";
import "../components/ExperienceCard.css";
import { useState } from "react";

const categories = ["all", "art", "fitness", "outdoors", "food", "craft", "tech"];

const tickerItems = [
  "Hand-curated by editors",
  "500+ experiences worldwide",
  "Verified local hosts",
  "No hidden fees",
  "Booked in seconds",
  "Refundable up to 48 hours",
];

const Overview = () => {
  const { pathname } = useLocation();
  const isMyExperiences = pathname === "/my-experiences";

  const allExperiences = useExperiences();
  const myExperiences = useMyExperiences();
  const [category, setCategory] = useState("all");

  const { data, loading, error } = isMyExperiences ? myExperiences : allExperiences;

  const filtered = category === "all" ? data : data.filter((e) => e.category === category);

  const today = new Date().toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {!isMyExperiences && (
        <>
          <section className="hero">
            <div className="container">
              <div className="hero__inner">
                <div className="hero__masthead">
                  <div className="hero__topline">
                    <span className="eyebrow eyebrow--ember">Bookit · A Field Guide</span>
                    <span className="kicker">Vol. 042 — {today}</span>
                  </div>

                  <h1 className="hero__title">
                    <span className="hero__title-line">A field guide</span>
                    <span className="hero__title-line">
                      to <em>extraordinary</em>
                    </span>
                    <span className="hero__title-line">days out.</span>
                  </h1>

                  <p className="hero__lede">
                    Five hundred meticulously chosen experiences — kayak at first
                    light, learn from a third-generation potter, dine on a rooftop
                    nobody told you about. Booked in a tap.
                  </p>

                  <div className="hero__actions">
                    <a href="#experiences" className="btn btn--ember btn--lg">
                      <span>Begin browsing</span>
                      <span aria-hidden="true">↘</span>
                    </a>
                    <a href="#experiences" className="link">How it works</a>
                  </div>
                </div>

                <aside className="hero__sidecard" aria-label="By the numbers">
                  <div className="hero__sidecard-head">
                    <span className="hero__sidecard-title">By the numbers</span>
                    <span className="hero__sidecard-issue">FY 26</span>
                  </div>

                  <div className="hero__stats">
                    <div>
                      <div className="stat__num">
                        500<em>+</em>
                      </div>
                      <div className="stat__label">Experiences</div>
                    </div>
                    <div>
                      <div className="stat__num">
                        <em>50</em>
                      </div>
                      <div className="stat__label">Cities worldwide</div>
                    </div>
                    <div>
                      <div className="stat__num">
                        4.9<sup>★</sup>
                      </div>
                      <div className="stat__label">Average rating</div>
                    </div>
                    <div>
                      <div className="stat__num">
                        10<em>k</em>
                      </div>
                      <div className="stat__label">Curious travelers</div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <div className="ticker" aria-hidden="true">
            <div className="ticker__track">
              {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
                <span className="ticker__item" key={i}>
                  <span className="star">✦</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <section id="experiences" className="container">
        <div className="filter-bar">
          <div className="filter-bar__head">
            <h2 className="filter-bar__title">
              {isMyExperiences ? (
                <>
                  Your <em>itinerary</em>.
                </>
              ) : (
                <>
                  This season's <em>selection</em>.
                </>
              )}
            </h2>

            <span className="filter-bar__count">
              {loading ? "Loading…" : `${filtered.length} entries`}
            </span>
          </div>

          {!isMyExperiences && (
            <div className="chips" role="tablist" aria-label="Filter by category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={category === cat}
                  className={`chip ${category === cat ? "chip--on" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && <p className="state">Loading the field guide…</p>}
        {error && <p className="state state--err">{error}</p>}

        {!loading && !error && (
          <div className="xgrid">
            {filtered.length === 0 ? (
              <p className="empty">
                Nothing here yet. <em>Try another category.</em>
              </p>
            ) : (
              filtered.map((experience, i) => (
                <div
                  key={experience._id}
                  className="xgrid__cell"
                  style={{ animationDelay: `${Math.min(i, 12) * 60}ms` }}
                >
                  <ExperienceCard experience={experience} index={i} />
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Overview;
