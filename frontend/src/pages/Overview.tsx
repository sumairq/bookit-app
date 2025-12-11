import { useLocation } from "react-router-dom";
import useMyTours from "../hooks/useMyTours";
import useTours from "../hooks/useTours";
import TourCard from "../components/TourCard";
import "../components/TourCard.css";

const Overview = () => {
  const { pathname } = useLocation();

  const isMyTours = pathname === "/my-tours";

  // Call BOTH hooks unconditionally
  const toursAll = useTours(); // {data, loading, error}
  const toursMine = useMyTours(); // {data, loading, error}

  // Decide which data to display
  const { data, loading, error } = isMyTours ? toursMine : toursAll;
  if (loading) return <p>Loading...</p>;
  if (error) return <div>{error}</div>;

  return (
    <main className="main">
      <div className="card-container">
        {data.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </div>
    </main>
  );
};

export default Overview;
