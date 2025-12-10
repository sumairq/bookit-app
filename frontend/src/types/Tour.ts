export interface Review {
  _id: string;
  review: string;
  rating: number;
  tour: string;
  user: {
    _id: string;
    name: string;
    photo: string;
  };
  createdAt: string;
  id: string;
}

export interface StartLocation {
  description: string;
  type: "Point";
  coordinates: [number, number];
  address: string;
}

export interface Location {
  _id: string;
  description: string;
  type: "Point";
  coordinates: [number, number];
  day: number;
}

export interface Guide {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "lead-guide" | "guide"; // matches Natours roles
}

export interface Tour {
  _id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  guides: Guide[]; // or Guide[] if you want full population later
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startLocation: StartLocation;
  startDates: string[];
  locations: Location[];
  slug: string;
  reviews: Review[];
}
