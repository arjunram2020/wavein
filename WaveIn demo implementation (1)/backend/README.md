# WaveIn — Backend (Express)

A small REST API that serves the same hardcoded data the frontend ships with.
Demo-only: no database, no external integrations. It exists so the frontend can
be pointed at a real service in a future pass without reshaping the data.

## Run

```bash
npm install
npm run dev      # http://localhost:4000  (auto-restarts on change)
# or: npm start
```

Node 18+.

## Endpoints

| Method | Route            | Returns                                  |
|--------|------------------|------------------------------------------|
| GET    | `/`              | Health check                             |
| GET    | `/api/event`     | Event metadata                           |
| GET    | `/api/stats`     | Simulated CO₂ / MARTA / season stats     |
| GET    | `/api/waves`     | Active wave table                        |
| GET    | `/api/arrivals`  | Arrival-distribution series (chart)      |
| POST   | `/api/wave`      | `{ origin, transport }` → assigned wave  |

```bash
curl -X POST http://localhost:4000/api/wave \
  -H "Content-Type: application/json" \
  -d '{"origin":"suburbs","transport":"driving"}'
```

## Files

- `server.js` — routes
- `lib/data.js` — hardcoded data
- `lib/waveLogic.js` — wave-assignment rules (kept in sync with the frontend)
