// src/types/ApiError.ts
export interface ApiError {
  status: "fail" | "error";
  message: string;
}
