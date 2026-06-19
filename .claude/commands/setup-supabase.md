# /setup-supabase

Print the exact Supabase SQL to set up the database schema.

## What to do
Read CLAUDE.md and output the full SQL block from the "Supabase Schema" section.
Then remind the user:
1. Go to https://supabase.com → New project
2. Go to SQL Editor → paste and run the SQL
3. Go to Settings → API → copy Project URL and anon key
4. Add to `.env.local` as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
