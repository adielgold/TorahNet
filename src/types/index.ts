import { Tables } from "./supabase";

type User = Tables<"users">;

type PaymentDetails = Tables<"payment_details">;

type Session = Tables<"sessions">;

type Reviews = Tables<"reviews">;

type Payments = Tables<"payments">;

type SearchUserData = Omit<User,'created_at' | 'country'> & {
  hourly_rate: number | null 
  avg_rating: number | null
};

type SessionWithUsers = Session & {
  student: User;
  teacher: User;
};

interface UpdateUserData {
  name: string;
  bio: string;
  topics: string[]; // Assuming selectedTopics is already defined somewhere
  expertise?: string; // Marking expertise as optional
}

export type {
  User,
  PaymentDetails,
  UpdateUserData,
  SearchUserData,
  SessionWithUsers,
  Reviews,
  Payments,
};
