# Embrione Meet The Team

Full-stack onboarding and moderation system built with Next.js, Tailwind CSS and Supabase.

## Pages
- `/register`: form with live card preview, client-side WebP conversion, upload to Supabase Storage
- `/admin`: login-protected moderation dashboard (approve, reject, delete)
- `/team`: public directory of approved members with domain and position filters

## Setup
1. Clone the repo and run `npm install`
2. Create a `.env.local` file with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In Supabase, run the SQL schema and create a public bucket named `member-photos`
4. Run `npm run dev` and open http://localhost:3000

## Tech
Next.js (App Router), Tailwind CSS, Supabase (PostgreSQL + Storage), Sonner, deployed on Vercel.