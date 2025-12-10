import type { Review } from "../types/Tour";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="reviews__card">
      {/* Avatar + User Name */}
      <div className="reviews__avatar">
        <img
          className="reviews__avatar-img"
          src={`/img/users/${review.user.photo}`}
          alt={review.user.name}
        />
        <h6 className="reviews__user">{review.user.name}</h6>
      </div>

      {/* Review Text */}
      <p className="reviews__text">{review.review}</p>

      {/* Rating */}
      <div className="reviews__rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`reviews__star ${
              review.rating >= star
                ? "reviews__star--active"
                : "reviews__star--inactive"
            }`}
          >
            <use href="/img/icons.svg#icon-star" />
          </svg>
        ))}
      </div>
    </div>
  );
}
