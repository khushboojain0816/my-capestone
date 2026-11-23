import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
