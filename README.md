# SEPTA Wrapped

A Spotify-Wrapped-style recap for your SEPTA Key transit history. Upload your trip-history CSV and get a set of bold, shareable stat cards you can download and post. Everything runs in your browser — there is **no backend** and your data never leaves your device.

## Features

- Upload your SEPTA Key trip CSV (or load the bundled sample)
- 100% client-side parsing and stats — nothing is uploaded anywhere
- Four shareable, downloadable PNG cards styled after transit "rewind" recaps:
  1. **Overview** — total trips, mode split, stops visited, transfers
  2. **Top Stations** — your #1 stop plus a top-5 leaderboard
  3. **Top Routes & Modes** — top bus route, top rail line, mode breakdown
  4. **Rider Habits** — busiest day, busiest month, peak hour, weekday vs weekend
- Parsed data cached in `localStorage` so a refresh keeps your wrapped (with a one-click reset)

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

If a file is missing required columns, the app shows a friendly validation message. A sample file lives at `public/sample-trips.csv`.

## Build & deploy

```bash
npm run build
```

The static output in `dist/` can be deployed to Vercel (a `vercel.json` is included for SPA routing). On Vercel, set the framework preset to **Vite**; build command `npm run build`, output directory `dist`.
