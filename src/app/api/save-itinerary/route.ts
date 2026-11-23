import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Itinerary } from "@/lib/types";

export async function POST(req: NextRequest) {
  const itinerary: Itinerary = await req.json();

  const { data, error } = await supabase
    .from("itineraries")
    .insert({
      destination: itinerary.destination,
      days: itinerary.days,
      purpose: itinerary.purpose,
      overview: itinerary.overview,
      day_plans: itinerary.dayPlans,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
