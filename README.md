# SEPTA Wrapped

Trip stats from your SEPTA Key CSV. Runs entirely in the browser — no server, no upload.

## Features

- Upload a SEPTA Key trip CSV (or load the bundled sample)
- Client-side parsing and stats
- Four PNG cards you can save:
  1. **Overview** — trips, modes, stops, transfers
  2. **Stations** — top stop plus top 5
  3. **Routes** — top bus route, top rail line, mode breakdown
  4. **Habits** — busiest day, month, peak hour, weekday split
- Data cached in `localStorage` until you upload a new file

## Tech stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [MUI](https://mui.com/) for components and theming
- [react-icons (Tabler set)](https://react-icons.github.io/react-icons/icons/tb/) for icons
- [PapaParse](https://www.papaparse.com/) for CSV parsing
- [html-to-image](https://github.com/bubkoo/html-to-image) for PNG export

## Getting started

This project needs Node 18+ (Vite 5 requirement).

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Expected CSV format

The app expects SEPTA Key trip-history columns:

```
Entry Date,Entry Stop,Fare,Mode,Type,Route/Vehicle #
"May 30, 2026 8:06 PM",15th St/City Hall,$0.00,Subway,Single Trip,L1/-
```

If required columns are missing, the app shows an error. Sample file: `public/sample-trips.csv`.

## Build & deploy

```bash
npm run build
```

The static output in `dist/` can be deployed to Vercel (a `vercel.json` is included for SPA routing). On Vercel, set the framework preset to **Vite**; build command `npm run build`, output directory `dist`.
