# WaveIn — Frontend (Next.js)

The WaveIn UI. Two views toggled in the top nav:

- **Organizer** — live (simulated) stat counters, arrival-distribution chart,
  active wave table, and the sustainability panel.
- **Fan** — pick origin + transport, get your assigned wave, reward, and a
  static directions link.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

Node 18+.

## Where things live

| Path                          | What                                            |
|-------------------------------|-------------------------------------------------|
| `app/page.js`                 | View toggle (Organizer / Fan)                   |
| `app/layout.js`               | Root layout, fonts, global CSS                  |
| `components/Nav.js`           | Top nav + view pills                            |
| `components/OrganizerView.js` | Dashboard: stats, chart, table, sustainability  |
| `components/FanView.js`       | Fan form + wave result card                     |
| `components/ArrivalChart.js`  | Self-contained animated SVG chart               |
| `lib/data.js`                 | **All hardcoded data** (edit numbers here)      |
| `lib/waveLogic.js`            | Wave-assignment lookup                          |
| `lib/useCountUp.js`           | Counter animation hook                          |

## Demo note

No external APIs or data sources. Counters animate on a timer, chart data is a
static array, wave logic is a hardcoded lookup, and "Get Directions" is a plain
Google Maps link. To change any value, edit `lib/data.js`.
