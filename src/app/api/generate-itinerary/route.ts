import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ItineraryRequest, Itinerary } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
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
      "morning": "Morning activities (9am-12pm)",
      "afternoon": "Afternoon activities (12pm-6pm)",
      "evening": "Evening activities (6pm onwards)",
      "tips": "Practical tip for the day (transport, booking, cost, etc.)"
    }
  ]
}

Create exactly ${days} day plan objects. Make the itinerary specific, practical, and tailored to the purpose: ${purpose}.`;

  try {
    const stream = await client.messages.stream({
      model: "claude-opus-5-5",
      max_tokens: 64000,
      system:
        "You are an expert travel planner. You create detailed, practical, and engaging travel itineraries. Always respond with valid JSON only — no explanations, no markdown, no code fences.",
      messages: [{ role: "user", content: prompt }],
    });

    const message = await stream.finalMessage();

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content in response");
    }

    const parsed = JSON.parse(textBlock.text);

    const itinerary: Itinerary = {
      destination,
      days,
      purpose,
      overview: parsed.overview,
      dayPlans: parsed.dayPlans,
    };

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    );
  }
}
