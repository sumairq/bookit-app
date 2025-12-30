import { useLocation } from "react-router-dom";
import { useExperiences } from "../hooks/useExperiences";
import { useMyExperiences } from "../hooks/useMyExperiences";
import ExperienceCard from "../components/ExperienceCard";
import "../components/ExperienceCard.css";

const Overview = () => {
  const { pathname } = useLocation();

  const isMyExperiences = pathname === "/my-experiences";

  // Hooks must always be called unconditionally
  const allExperiences = useExperiences();
  const myExperiences = useMyExperiences();

  const { data, loading, error } = isMyExperiences
    ? myExperiences
    : allExperiences;

  if (loading) return <p>Loading...</p>;
  if (error) return <div>{error}</div>;

  return (
    <main className="main">
      <div className="card-container">
        {data.map((experience) => (
          <ExperienceCard key={experience._id} experience={experience} />
        ))}
      </div>
    </main>
  );
};

export default Overview;
