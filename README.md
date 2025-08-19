# Project Weather — Open-Meteo Dashboard (Bekasi)

Front-end dashboard built with **Vite + React + TypeScript + Tailwind + Recharts** for **Open-Meteo** data.  
- Endpoint: `hourly.temperature_2m` (timezone: Asia/Bangkok)  
- Features: interactive chart, statistics, data table, °C/°F toggle, caching, PWA support, ready to deploy on GitHub Pages.  

## Run in Codespaces
1. **Create a Codespace** for this repository.  
2. In the terminal:  
   ```bash
   npm install   # or npm ci if you have package-lock.json
   npm run dev
   ```
3. Open port 5173 forwarded by Codespaces.

## Configuration

- API URL is defined in src/config.ts (OPEN_METEO_URL).

- Vite base path for GitHub Pages is set in vite.config.ts → base: "/Project-Weather/".

## Deploy to GitHub Pages

- Go to Settings → Pages → Build and deployment, select GitHub Actions.

- Push to the main branch — the deploy.yml workflow will automatically build and publish to Pages.

## Notes

1. Local cache duration: 10 minutes (localStorage) + Service Worker caching for last successful data (offline support).
2. Customize the look & feel via Tailwind styles in src/index.css.