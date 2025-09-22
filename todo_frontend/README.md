# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in CI-friendly mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Supabase Setup (Important)

Set these environment variables (already defined at container level per project config, ensure values are correct):

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_KEY`

Optional for future auth:
- `REACT_APP_SITE_URL`

Local development `.env` example (place next to this README):
```
REACT_APP_SUPABASE_URL=https://<project-ref>.supabase.co
REACT_APP_SUPABASE_KEY=<anon-key>
REACT_APP_SITE_URL=http://localhost:3000
```

In the Supabase Dashboard:
- Database table: `public.todos` with columns: `id (bigint PK)`, `title (text)`, `completed (boolean default false)`, `created_at (timestamptz default now())`, `inserted_at (timestamptz default now())`.
- RLS: Enabled with permissive policies for development (see assets/supabase.md). Replace with user-scoped policies for production.

## Customization

The main brand colors are defined as CSS variables in `src/App.css` and inline styles in `src/App.js`. You can adapt them to fit your needs.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
