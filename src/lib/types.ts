export interface ItineraryRequest {
  destination: string;
  days: number;
  purpose: string;
}

export interface DayPlan {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tips: string;
}

export interface Itinerary {
  id?: string;
  destination: string;
  days: number;
  purpose: string;
  overview: string;
  dayPlans: DayPlan[];
  createdAt?: string;
}
