# WaveIn — WC26 Atlanta (Demo)

Staggered arrival waves for stadium events. Fewer cars idling, less CO₂, smoother entry.

> **Demo build — no external integrations.** Every number, counter, chart point, table
> row, and wave assignment is hardcoded or simulated in JS. No Google Maps API, no MARTA
> GTFS, no EPA endpoints, no live data. The "Get Directions" button is a static link.
> Real integrations are a later pass.

## Structure

```
wavein/
├── frontend/        Next.js (React) app — the UI
│   ├── app/         App Router pages + layout + globals.css
│   ├── components/  Nav, OrganizerView, FanView, ArrivalChart
│   └── lib/         hardcoded data, wave logic, counter hook
│
└── backend/         Node + Express API (hardcoded data, ready to grow into)
    ├── server.js
    └── lib/         data.js, waveLogic.js
```

The frontend is **fully self-contained** — it ships with its own copy of the data and
wave logic in `frontend/lib`, so it runs with zero network calls. The backend is a
parallel REST API that serves the *same* data; it's there so you can wire the frontend
to a real service later. They are independent today.

## Run it

Two terminals.

**Frontend**
```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

**Backend** (optional for the demo)
```bash
cd backend
npm install
npm run dev          # http://localhost:4000
```

Requires Node 18+.

## Backend endpoints

| Method | Route            | Returns                                  |
|--------|------------------|------------------------------------------|
| GET    | `/api/event`     | Event metadata                           |
| GET    | `/api/stats`     | Simulated CO₂ / MARTA / season stats     |
| GET    | `/api/waves`     | Active wave table                        |
| GET    | `/api/arrivals`  | Arrival-distribution series (chart)      |
| POST   | `/api/wave`      | `{ origin, transport }` → assigned wave  |

Example:
```bash
curl -X POST http://localhost:4000/api/wave \
  -H "Content-Type: application/json" \
  -d '{"origin":"airport","transport":"marta"}'
```

## Wiring the frontend to the backend (later)

Today the frontend reads from `frontend/lib/data.js` and `frontend/lib/waveLogic.js`.
To switch to the API, replace those reads with `fetch()` calls to the backend routes
above (e.g. in `OrganizerView` and `FanView`). The shapes already match.
