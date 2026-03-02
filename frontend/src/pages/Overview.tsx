import { useLocation } from "react-router-dom";
import { useExperiences } from "../hooks/useExperiences";
import { useMyExperiences } from "../hooks/useMyExperiences";
import ExperienceCard from "../components/ExperienceCard";
import "../components/ExperienceCard.css";
import { useState } from "react";

const Overview = () => {
  const { pathname } = useLocation();

  const isMyExperiences = pathname === "/my-experiences";

  // Hooks must always be called unconditionally
  const allExperiences = useExperiences();
  const myExperiences = useMyExperiences();
  const [category, setCategory] = useState("outdoors");

  const categories = ["art", "fitness", "outdoors", "food", "craft", "tech"];

  const { data, loading, error } = isMyExperiences
    ? myExperiences
    : allExperiences;

  if (loading) return <p>Loading...</p>;
  if (error) return <div>{error}</div>;

  return (
    <main className="main">
      <div className="flex categories-container">
        <h2>Categories</h2>

        <div className="flex categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-select ${
                category === cat ? "btn-active" : ""
              }`}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="card-container">
        {data.map(
          (experience) =>
            experience.category === category && (
              <ExperienceCard key={experience._id} experience={experience} />
            ),
        )}
      </div>
    </main>
  );
};

export default Overview;
