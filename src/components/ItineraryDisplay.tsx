"use client";

import { useState } from "react";
import { Itinerary, Activity } from "@/lib/types";

interface Props {
  itinerary: Itinerary;
  onReset: () => void;
}

export default function ItineraryDisplay({ itinerary, onReset }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [openDay, setOpenDay] = useState<number>(1);

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

      {/* Day tabs */}
      <div className="flex gap-2 flex-wrap">
        {itinerary.dayPlans.map((day) => (
          <button
            key={day.day}
            onClick={() => setOpenDay(day.day)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              openDay === day.day
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      {/* Active day */}
      {itinerary.dayPlans
        .filter((d) => d.day === openDay)
        .map((day) => (
          <div key={day.day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Day header */}
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Day {day.day}
              </span>
              <h3 className="font-semibold text-gray-800">{day.title}</h3>
            </div>

            {/* Timeline */}
            <div className="p-5">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[52px] top-0 bottom-0 w-px bg-gray-200" />

                <div className="space-y-0">
                  {day.activities.map((activity, idx) => (
                    <ActivityRow key={idx} activity={activity} isLast={idx === day.activities.length - 1} />
                  ))}
                </div>
              </div>

              {/* Daily tip */}
              <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="text-base shrink-0">💡</span>
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-0.5">Daily Tip</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{day.tips}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving || saved}
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
      {saveError && <p className="text-sm text-red-600 text-center">{saveError}</p>}
    </div>
  );
}

function ActivityRow({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.mapQuery)}`;

  return (
    <div className={`flex gap-4 ${isLast ? "" : "pb-6"}`}>
      {/* Time column */}
      <div className="w-[52px] shrink-0 pt-0.5 text-right">
        <span className="text-xs font-bold text-blue-600 leading-tight block">{activity.time}</span>
        <span className="text-[10px] text-gray-400 leading-tight block">{activity.duration}</span>
      </div>

      {/* Dot on the line */}
      <div className="relative flex flex-col items-center" style={{ width: 0 }}>
        <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow ring-1 ring-blue-200 mt-1 shrink-0" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm leading-snug">{activity.place}</span>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors shrink-0"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Maps
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{activity.description}</p>
      </div>
    </div>
  );
}
