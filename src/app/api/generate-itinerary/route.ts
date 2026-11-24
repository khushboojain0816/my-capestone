import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ItineraryRequest, Itinerary } from "@/lib/types";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to your .env.local file." },
      { status: 500 }
    );
  }

  try {
    const client = new OpenAI({ apiKey });

    const body: ItineraryRequest = await req.json();
    const { destination, days, purpose } = body;

    if (!destination || !days || !purpose) {
      return NextResponse.json(
        { error: "destination, days, and purpose are required" },
        { status: 400 }
      );
    }

    if (days < 1 || days > 30) {
      return NextResponse.json(
        { error: "days must be between 1 and 30" },
        { status: 400 }
      );
    }

    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}.
Purpose of trip: ${purpose}

Return ONLY a valid JSON object (no markdown, no code fences) in this exact structure:
{
  "overview": "2-3 sentence trip summary",
  "dayPlans": [
    {
      "day": 1,
      "title": "Day theme/title",
      "activities": [
        {
          "time": "9:00 AM",
          "duration": "1.5 hours",
          "place": "Exact name of the specific place or attraction",
          "description": "What to do, see, eat, or experience here. Include entrance fees, what not to miss, and any booking advice.",
          "mapQuery": "Exact Place Name, Area, City, Country — optimized for Google Maps search"
        }
      ],
      "tips": "One practical tip for the day covering transport, local customs, payment, or booking."
    }
  ]
}

Rules:
- Each day must have 6-8 activities scheduled from roughly 8:00 AM to 10:00 PM.
- Times must be realistic — include travel time between locations (add a travel entry if needed).
- "place" must be the real, specific name of a venue (not generic like "a local restaurant" — use actual names).
- "mapQuery" must be precise enough to find the exact spot on Google Maps.
- "duration" should reflect realistic visit time including queues.
- Create exactly ${days} day plan objects, tailored to the purpose: ${purpose}.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner. You create detailed, practical, and engaging travel itineraries. Always respond with valid JSON only — no explanations, no markdown, no code fences.",
        },
        { role: "user", content: prompt },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("No content in response");

    const parsed = JSON.parse(text);

    const itinerary: Itinerary = {
      destination,
      days,
      purpose,
      overview: parsed.overview,
      dayPlans: parsed.dayPlans,
    };

    return NextResponse.json(itinerary);
  } catch (error: unknown) {
    console.error("Error generating itinerary:", error);

    let message = "Failed to generate itinerary.";
    if (error && typeof error === "object") {
      const err = error as { status?: number; message?: string; code?: string };
      if (err.status === 401) {
        message = "Invalid OpenAI API key. Check your .env.local file.";
      } else if (err.status === 429 || err.code === "insufficient_quota") {
        message =
          "No OpenAI API credits. Add credits at platform.openai.com/billing — a ChatGPT Plus subscription does NOT include API credits.";
      } else if (typeof err.message === "string" && err.message) {
        message = err.message;
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
