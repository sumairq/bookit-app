export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "user" | "guide" | "lead-guide" | "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
