-- Run this in your Supabase SQL Editor
CREATE TABLE supporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the supporters table (for the sidebar)
CREATE POLICY "Allow public read access to supporters"
ON supporters
FOR SELECT
USING (true);

-- (Optional) If you are using the Anon key in your API route instead of the Service Role Key, 
-- you will also need an insert policy, but the Service Role key bypasses RLS.
