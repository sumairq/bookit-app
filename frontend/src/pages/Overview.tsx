import { useEffect, useState } from "react";
import type { Tour } from "../api/tours";
import { getAllTours } from "../api/tours";
import TourCard from "../components/TourCard";
import "../components/TourCard.css";

const Overview = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTours()
      .then((res) => {
        setTours(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tours:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="main">
      <div className="card-container">
        {tours.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </div>
    </main>
  );
};

export default Overview;
