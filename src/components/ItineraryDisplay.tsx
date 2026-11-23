"use client";

import { useState } from "react";
import { Itinerary } from "@/lib/types";

interface Props {
  itinerary: Itinerary;
  onReset: () => void;
}

export default function ItineraryDisplay({ itinerary, onReset }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/save-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itinerary),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{itinerary.destination}</h2>
            <p className="text-blue-100 text-sm mt-1">
              {itinerary.days} {itinerary.days === 1 ? "day" : "days"} &bull; {itinerary.purpose}
            </p>
          </div>
          <span className="shrink-0 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {itinerary.days}D
          </span>
        </div>
        <p className="mt-4 text-blue-50 text-sm leading-relaxed">{itinerary.overview}</p>
      </div>

      {/* Day Plans */}
      <div className="space-y-4">
        {itinerary.dayPlans.map((day) => (
          <div key={day.day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 flex items-center gap-3 border-b border-gray-100">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Day {day.day}
              </span>
              <h3 className="font-semibold text-gray-800">{day.title}</h3>
            </div>
            <div className="p-5 grid gap-3">
              <TimeBlock icon="🌅" label="Morning" content={day.morning} />
              <TimeBlock icon="☀️" label="Afternoon" content={day.afternoon} />
              <TimeBlock icon="🌙" label="Evening" content={day.evening} />
              <div className="mt-1 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="text-base">💡</span>
                <p className="text-sm text-amber-800">{day.tips}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving || saved || !process.env.NEXT_PUBLIC_SUPABASE_URL}
          className="flex-1 py-3 px-5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
        >
          {saved ? "Saved!" : saving ? "Saving..." : "Save Itinerary"}
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
        >
          Plan Another Trip
        </button>
      </div>
      {saveError && (
        <p className="text-sm text-red-600 text-center">{saveError}</p>
      )}
      {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <p className="text-xs text-gray-400 text-center">
          Add Supabase credentials to enable saving itineraries.
        </p>
      )}
    </div>
  );
}

function TimeBlock({
  icon,
  label,
  content,
}: {
  icon: string;
  label: string;
  content: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base w-6 shrink-0">{icon}</span>
      <div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
