export interface Review {
  _id: string;
  review: string;
  rating: number;
  experience: string;
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

export interface Host {
  _id: string;
  name: string;
  email: string;
  photo: string;
  // Align with backend roles and API types
  role: "lead-guide" | "guide" | "host";
}

export interface Experience {
  _id: string;
  name: string;
  slug: string;

  duration: number;
  capacity: number;

  category: "art" | "fitness" | "outdoors" | "food" | "craft" | "tech";

  ratingsAverage: number;
  ratingsQuantity: number;

  price: number;
  priceDiscount?: number;

  summary: string;
  description: string;

  imageCover: string;
  images: string[];

  startLocation: StartLocation;
  locations: Location[];

  timeSlots: string[];

  hosts: Host[];

  reviews: Review[];
}
