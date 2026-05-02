import type { Review } from "../types/Experience";
import { getUserAvatar } from "../utils/images";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="review">
      <p className="review__quote">{review.review}</p>

      <div className="review__person">
        <img
          className="review__avatar"
          src={getUserAvatar(review.user.photo, 60)}
          alt=""
        />
        <div>
          <p className="review__name">{review.user.name}</p>
          <span className="review__role">Verified guest</span>
        </div>

        <span className="review__stars" aria-label={`${review.rating} out of 5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`review__star ${review.rating >= star ? "" : "review__star--off"}`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2.5l2.95 6.45 7.05.62-5.35 4.7 1.6 6.93L12 17.7l-6.25 3.5 1.6-6.93L2 9.57l7.05-.62L12 2.5z" />
            </svg>
          ))}
        </span>
      </div>
    </article>
  );
}
