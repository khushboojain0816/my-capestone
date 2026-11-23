"use client";

import { useState } from "react";
import { ItineraryRequest } from "@/lib/types";

interface Props {
  onSubmit: (data: ItineraryRequest) => void;
  loading: boolean;
}

export default function ItineraryForm({ onSubmit, loading }: Props) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [purpose, setPurpose] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !purpose.trim()) return;
    onSubmit({ destination: destination.trim(), days, purpose: purpose.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Destination
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Tokyo, Japan"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-white shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Number of Days
          <span className="ml-2 font-normal text-blue-600">{days} {days === 1 ? "day" : "days"}</span>
        </label>
        <input
          type="range"
          min={1}
          max={14}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 day</span>
          <span>14 days</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Purpose of Trip
        </label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g. Honeymoon trip focused on romantic dinners, scenic views, and cultural experiences"
          required
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-white shadow-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !destination.trim() || !purpose.trim()}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating itinerary...
          </>
        ) : (
          "Generate Itinerary"
        )}
      </button>
    </form>
  );
}
