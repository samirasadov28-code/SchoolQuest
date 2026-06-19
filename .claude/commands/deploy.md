# /deploy

Help deploy the app to Netlify via GitHub.

## What to do
1. Check if git is initialised (`git status`)
2. If not: `git init && git add . && git commit -m "Initial commit: Emilia's Quest"`
3. Remind user to:
   a. Create a GitHub repo at https://github.com/new (name: emilia-quest)
   b. Run: `git remote add origin https://github.com/USERNAME/emilia-quest.git`
   c. Run: `git push -u origin main`
4. Then for Netlify:
   a. Go to https://netlify.com → Add new site → Import from GitHub
   b. Build command: `npm run build`
   c. Publish directory: `dist`
   d. Add env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_GROQ_API_KEY
5. Run `npm run build` locally first to check for errors
