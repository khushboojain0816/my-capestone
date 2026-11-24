export interface ItineraryRequest {
  destination: string;
  days: number;
  purpose: string;
}

export interface Activity {
  time: string;
  duration: string;
  place: string;
  description: string;
  mapQuery: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
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
