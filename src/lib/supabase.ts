import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase credentials not configured.");
  _supabase = createClient(url, key);
  return _supabase;
}

// Supabase table schema (run this SQL in your Supabase SQL editor):
//
// create table itineraries (
//   id uuid primary key default gen_random_uuid(),
//   destination text not null,
//   days integer not null,
//   purpose text not null,
//   overview text not null,
//   day_plans jsonb not null,
//   created_at timestamptz default now()
// );
