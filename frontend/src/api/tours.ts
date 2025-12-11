import { api } from "./axios";

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

// export interface Tour {
//   _id: string;
//   name: string;
//   duration: number;
//   maxGroupSize: number;
//   difficulty: string;
//   guides: string[]; // or Guide[] if you want full population later
//   ratingsAverage: number;
//   ratingsQuantity: number;
//   price: number;
//   summary: string;
//   description: string;
//   imageCover: string;
//   images: string[];
//   startLocation: StartLocation;
//   startDates: string[];
//   locations: Location[];
//   slug: string;
// }

interface ToursResponse {
  status: string;
  results: number;
  data: {
    data: Tour[];
  };
}

export const getAllTours = async (): Promise<ToursResponse> => {
  const res = await api.get("/tours");
  console.log(res.data.data);
  return res.data;
};
