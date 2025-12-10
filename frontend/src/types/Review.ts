export interface ReviewUser {
  _id: string;
  name: string;
  photo: string;
}

export interface Review {
  _id: string;
  id: string; // duplicated id field returned by Mongo + your backend
  review: string;
  rating: number;
  tour: string; // reference to tour ID
  user: ReviewUser; // nested user
  createdAt: string; // ISO date string
  __v: number;
}
