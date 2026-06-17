# Handoff: WaveIn — Landing, Organizer Dashboard & Fan View redesign

## Overview
WaveIn is a staggered event-arrival management system debuting at WC26 (Mercedes-Benz Stadium, Atlanta). This handoff covers a **complete visual overhaul** of three screens plus a brand-new landing page:

1. **Landing page** (new) — cinematic marketing entry point with scroll reveals, an illustrated dusk stadium hero, problem/solution arrival curves, "how it works", animated sustainability impact, and a two-paths CTA that opens a login modal.
2. **Organizer Dashboard** (redesign) — "Event Command Center": stat cards, the arrival-distribution chart, wave-assignments table, and sustainability panel.
3. **Fan View** (redesign) — "Find Your Wave" form + a celebratory result reveal.

Visual direction: **warm premium dark** — deep navy base, warm whites, soft gold/amber accents, with one warm cream section for rhythm. Editorial serif headlines + a clean grotesque for everything else.

---

## About the design files
The files in this bundle are **design references created as a single HTML prototype** (`WaveIn.prototype.dc.html`). They demonstrate the intended look, motion, and behavior — **they are not production code to copy verbatim.** The prototype is authored in a small custom HTML component runtime (a `<x-dc>` template + a `class Component` logic block); **do not port that runtime.** Recreate the designs as **React/Next.js page components** using this repo's existing patterns, then wire them to the existing logic files (see *Logic & Data Wiring*).

You can open `WaveIn.prototype.dc.html` in a browser to see every animation and the full interactive flow (landing → login modal → dashboard / fan → result). Scroll the landing page to see the reveal animations; fill the fan form and submit to see the result reveal.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, shadows, and animation timings below are final and exact — match them pixel-for-pixel. Reproduce the UI using this codebase's existing styling approach (Tailwind, per the stack notes). Where a value is given as a `clamp()`, keep the fluid behavior.

---

## ⚠️ Critical constraint — preserve existing logic, replace only the visual layer
This repo already contains:
- `lib/data.js` — event/wave/zone/reward data
- `lib/waveLogic.js` — wave-assignment algorithm
- `lib/logistics.js` — distance / transport / emissions logic

**Keep these intact.** The prototype contains a *throwaway* inline version of the wave-assignment logic (its `submitWave()` method) purely so the prototype is interactive. **Ignore the prototype's logic and call the real `lib/*` functions instead.** Your job is to swap the visual/component layer only:
- Build the screens as components/pages.
- Feed them data from `lib/data.js`.
- Compute the fan's wave by calling `lib/waveLogic.js` (and `lib/logistics.js` for distances/emissions) — not by reimplementing the prototype's `if (idx <= 2)` stub.
- Map the result object your `lib/waveLogic.js` returns onto the result-card fields documented in *Fan View → Result state*.

If a field the UI needs isn't already returned by `lib/*`, add a thin mapping/selector in the component layer rather than editing the lib files' core logic.

---

## Suggested file structure
Match whatever router this project already uses. Mapping (App Router shown; use `pages/` equivalents if that's what exists):

| Screen | Route | Component file |
|---|---|---|
| Landing | `/` | `app/page.js` |
| Organizer Dashboard | `/dashboard` | `app/dashboard/page.js` |
| Fan View | `/fan` | `app/fan/page.js` |

Shared components to extract:
- `components/Logo.js` — wave mark + wordmark (SVG below)
- `components/TopNav.js` — sticky nav with the Organizer/Fan segmented toggle
- `components/LoginModal.js` — role-aware modal
- `components/ArrivalChart.js` — the two-curve area chart (used on landing **and** dashboard)
- `components/AmbientBackground.js` — fixed drifting gradient blobs
- `components/Reveal.js` — scroll-reveal wrapper (IntersectionObserver — see note)
- `components/CountUp.js` — animated number counter
- `components/StadiumHero.js` — the SVG illustration (`assets/hero-stadium-illustration.svg`)

CTAs route via the login modal: "I'm an Organizer" / "Open the dashboard" → modal(role=organizer) → `/dashboard`; "I'm a Fan" / "Find my wave" → modal(role=fan) → `/fan`. The nav toggle links directly to `/dashboard` and `/fan`.

---

## Design Tokens

### Fonts (Google Fonts)
```
Instrument Serif — weights 400 + 400 italic   → display / headlines / big numbers
Hanken Grotesk   — weights 400 500 600 700 800 → body, UI, labels, dashboard numbers
```
Load via `next/font/google` (preferred) or a `<link>`. Headlines use Instrument Serif **400** at large sizes; italics are used for the colored accent phrase in each headline.

### Color palette
| Token | Hex | Use |
|---|---|---|
| `ink` (page bg) | `#0B121F` | global background |
| `panel-navy-1` | `#16243F` | card/panel gradient top |
| `panel-navy-2` | `#0D1729` | card/panel gradient bottom |
| `panel-fan-1` | `#17243E` | fan / result card top |
| `panel-fan-2` | `#101A2E` | fan / result / modal card bottom |
| `gold` | `#E8B45A` | primary accent, key numbers, eyebrows |
| `gold-btn-top` | `#F0C572` | gold button gradient top |
| `gold-btn-bot` | `#E0A24A` | gold button gradient bottom |
| `gold-deep` | `#D99A4E` | Wave-3/secondary gold |
| `gold-on-cream` | `#C0863A` | gold text on cream sections |
| `green` | `#5BD6A0` | "With WaveIn", CO₂, success |
| `green-deep` | `#46C08A` | green gradient/bars |
| `green-soft` | `#8FE3C0` | green secondary text |
| `red` | `#E2685B` | "Without WaveIn", Wave-4, spike |
| `blue` | `#6FA0E0` | Car→MARTA stat / accents |
| `blue-deep` | `#4A78C0` | blue bar gradient |
| `text` | `#F4EDE0` | primary text on dark |
| `text-bright` | `#F7F1E6` | headline text on dark |
| `muted-1` | `#C7D0DE` | secondary text |
| `muted-2` | `#9AA7BC` | tertiary text / labels |
| `muted-3` | `#8A98AE` | quaternary / placeholder |
| `muted-4` | `#6E7A90` | faint captions |
| `axis` | `#5E6A80` | chart axis labels |
| `cream-bg` | `#F6EFE2` | "How it works" section bg |
| `cream-card` | `#FFFDF8` | cards on cream |
| `cream-deep` | `#EFE2CC` | fan-side CTA card gradient bottom |
| `ink-on-cream` | `#1A2235` | headings/text on cream |
| `muted-on-cream` | `#56607A` | body text on cream |

Borders: `rgba(255,255,255,.07)`–`.16` on dark; gold borders `rgba(232,180,90,.18)`–`.6`; tinted card borders use the card's accent at ~`.2` alpha. Result-card border/glow use the wave's color at `66`/`33`/`1A` hex-alpha.

### Spacing & layout
- Page max-widths: landing sections `1180px`; dashboard `1340px`; centered fan card `560px`; modal `430px`. All `margin: 0 auto`.
- Section vertical padding: `clamp(60px, 8–9vw, 110–128px)`.
- Horizontal page padding: `clamp(18–20px, 4vw, 40px)`.
- Card padding: `22–40px`. Grid/flex gaps: `8px` (chips) · `16–22px` (cards) · `18–20px` (major regions).
- Use flex/grid with `gap` for all groupings (stat cards `repeat(4,1fr)`, steps `repeat(3,1fr)`, time picker `repeat(5,1fr)`, dashboard bottom `1.55fr / 1fr`).

### Radii
pills/indicators `999px` · buttons `12–14px` · inputs/menus `11–13px` · cards/panels `16–24px`.

### Shadows
- Cards & modals: `0 40px 100px rgba(0,0,0,.5)` (modal `.6`).
- Gold buttons: `0 10–12px 26–30px rgba(224,162,74,.30–.34)`.
- Cream cards: `0 16px 40px rgba(120,90,40,.08)`.
- Dropdown menus: `0 24px 60px rgba(0,0,0,.6)`.

### Type scale (exact)
| Element | Font | Size | Weight | LH | LS |
|---|---|---|---|---|---|
| Hero H1 | Instrument Serif | `clamp(42px,7.4vw,90px)` | 400 | 1.0 | -.5px |
| Section H2 | Instrument Serif | `clamp(32px,5vw,60px)` | 400 | 1.04–1.05 | -.4px |
| Dashboard H1 | Instrument Serif | `clamp(34px,4.4vw,56px)` | 400 | — | -.4px |
| Fan H1 ("Find Your Wave") | Instrument Serif | `clamp(38px,6vw,58px)` | 400 | 1.0 | -.5px |
| Big impact number | Instrument Serif | `clamp(58px,11vw,128px)` | 400 | 1 | -1px |
| Result window | Instrument Serif | `clamp(34px,6vw,52px)` | 400 | 1.05 | — |
| Stat-card number | Hanken Grotesk | `clamp(32px,3.4vw,44px)` | 800 | 1 | -1px |
| Body / lead | Hanken Grotesk | `15–19px` | 400 | 1.6 | — |
| Eyebrow / label | Hanken Grotesk | `11.5–12.5px` | 700 | — | `1.2–2px`, UPPERCASE |
| Button | Hanken Grotesk | `15–16.5px` | 700 | — | — |

---

## Global systems

### Ambient background (`AmbientBackground.js`)
`position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden`. Three blurred radial-gradient blobs drifting on a loop:
- Gold blob: `62vw` sq, top-left, `radial-gradient(circle, rgba(232,180,90,.16), transparent 62%)`, `blur(36px)`, `drift1 24s`.
- Blue blob: `58vw`, top-right, `rgba(52,116,196,.20)`, `blur(46px)`, `drift2 30s`.
- Green blob: `52vw`, bottom-center, `rgba(91,214,160,.12)`, `blur(48px)`, `drift3 34s`.

```css
@keyframes drift1 {0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6vw,4vh) scale(1.15)}}
@keyframes drift2 {0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-5vw,6vh) scale(1.2)}}
@keyframes drift3 {0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(4vw,-5vh) scale(1.1)}}
```
All page content sits in a `position: relative; z-index: 1` layer above it.

### Scroll reveals (`Reveal.js`)
Elements fade + rise in as they enter the viewport. Final timing: **`revealIn .85s cubic-bezier(.16,1,.3,1) both`**, animating `opacity 0→1` and `transform: translateY(24px)→none`.

> **Implementation note:** In a real Next.js app, use an **IntersectionObserver** (or `framer-motion`'s `whileInView`) to add a `revealed` class when each element scrolls into view — that's the correct, standard approach. (The prototype uses a scroll-position polling fallback *only* because it runs inside a hidden preview iframe where IntersectionObserver and rAF are paused; you do not need that workaround.) **Always** include a `prefers-reduced-motion: reduce` branch that shows content at full opacity with no transform, so motion-off users never see blank content.

### Animated counters (`CountUp.js`)
Numbers count up from 0 when scrolled into view. `requestAnimationFrame`, **ease-out-cubic** (`1 - (1-p)^3`), duration `1.7–2.1s`, formatted with `toLocaleString('en-US')`. Targets: dashboard CO₂ `21,942`; landing impact `408,000`, `2,190`, `89`, `51`; dashboard sustainability CO₂ `21,942`. (Pull the real values from `lib/data.js`/`lib/logistics.js` rather than hardcoding.)

### Arrival chart (`ArrivalChart.js`)
Two smoothed area+line curves on a 0–8,000 ("Fans / 15 min") y-axis across 4:00pm→7:15pm (15-min ticks), with a dashed **Kickoff** line at 7:00pm.
- **Red** = "Without WaveIn" — flat until a sharp spike peaking ~6:15–6:30pm.
- **Green** = "With WaveIn" — smooth broad distribution.
- Grid lines `rgba(255,255,255,.06)`; axis labels `#5E6A80` 11–12px; kickoff line `rgba(255,255,255,.3)` dashed `5 6`.
- **Draw-on animation:** each line path animates `stroke-dashoffset` from its length → 0 over `2.1s cubic-bezier(.65,0,.35,1)` when revealed; area fills (`rgba(red/green, .16)`) fade in.

The stack notes mention **Recharts** — you may render this with Recharts `<AreaChart>` (two `<Area>` series + `<ReferenceLine x="7:00pm">`) instead of raw SVG, as long as the curve shapes, colors, kickoff line, and the draw-on feel are preserved. Sample data points (height as fraction of 8,000 max, per 15-min slot 4:00→7:15):

```js
const slots = ['4:00','4:15','4:30','4:45','5:00','5:15','5:30','5:45','6:00','6:15','6:30','6:45','7:00','7:15'];
const withoutWaveIn = [0.02,0.03,0.04,0.05,0.06,0.08,0.12,0.22,0.50,0.92,0.85,0.45,0.18,0.06]; // ×8000
const withWaveIn    = [0.06,0.18,0.32,0.42,0.50,0.55,0.57,0.56,0.52,0.46,0.40,0.32,0.20,0.10]; // ×8000
// kickoff reference line at '7:00'
```
The prototype's SVG uses a Catmull-Rom smoothing of these points; Recharts `type="monotone"` (or `natural`) gives an equivalent smooth curve.

### Logo (`Logo.js`)
Rounded-square tile (`rx 11`) with a deep-blue diagonal gradient (`#244A86 → #10213F`), a `rgba(232,180,90,.35)` stroke, two stacked flowing wave strokes (top warm-white `#F4EDE0`, lower gold `#E8B45A`), ending in a gold node dot. Wordmark: **"Wave"** in `text` + **"In"** in `gold`, Hanken Grotesk 700, 21px, `letter-spacing:-.4px`. Copy the exact SVG from the prototype's nav `<svg viewBox="0 0 40 40">`.

### Keyframes reference
```css
@keyframes revealIn   {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}      /* .85s cubic-bezier(.16,1,.3,1) both */
@keyframes modalIn    {from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}} /* modal .45s; dropdowns .22s */
@keyframes fadeIn     {from{opacity:0}to{opacity:1}}                                                  /* modal backdrop .3s */
@keyframes resultPop  {0%{opacity:0;transform:translateY(26px) scale(.94)}60%{transform:translateY(-4px) scale(1.01)}100%{opacity:1;transform:none}} /* .65s cubic-bezier(.16,1,.3,1) */
@keyframes confettiFall{0%{transform:translateY(-30px) rotate(0);opacity:0}10%{opacity:1}100%{transform:translateY(420px) rotate(420deg);opacity:0}}  /* 2.4–3s ease-in */
@keyframes twinkle    {0%,100%{opacity:.25}50%{opacity:.9}}      /* stars 4–6s; LIVE dot 1.6s */
@keyframes pulseRing  {0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.95;transform:scale(1.04)}} /* stadium halo 6s */
@keyframes floatY     {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}             /* stadium 9s */
@keyframes dashMove   {to{stroke-dashoffset:-16}}                                                    /* road dashes 1.4s linear */
/* drift1/2/3 above */
```

---

## Screens / Views

### 1. Top Nav (all screens)
`position: sticky; top: 0; z-index: 50`. `background: rgba(11,18,31,.72)`, `backdrop-filter: blur(16px)`, bottom border `rgba(255,255,255,.07)`. Padding `16px clamp(20px,4vw,44px)`. Left: Logo (click → `/`). Right: segmented control in a `rgba(255,255,255,.04)` pill (`999px`, `1px` border, `4px` padding) with two buttons **"Organizer View"** / **"Fan View"**. Active button: gold gradient (`#F0C572→#E0A24A`), `#1A1206` text, `0 4px 14px rgba(224,162,74,.3)`; inactive: transparent, `#A9B5C8` text. Active state follows the current route.

### 2. Landing — `/`
Single scrolling page, six sections. Every major block is wrapped in `Reveal`.

**(a) Hero** — centered, max-width 1180. Eyebrow pill: `FIFA WORLD CUP 26 · MERCEDES-BENZ STADIUM` with a glowing gold dot, gold border/`.07` bg. H1 (serif): *"Every fan has the same target."* + italic gold *"We give them a better one."* Lead paragraph (`#A9B5C8`, max 56ch). Two CTAs: **"I'm an Organizer →"** (gold gradient, `#1A1206` text) and **"I'm a Fan →"** (`rgba(255,255,255,.05)` fill, `.16` border, `#F4EDE0`). Below: the **stadium illustration** in a `22px`-radius framed card (`1px` border, `0 40px 100px rgba(0,0,0,.55)` shadow). Caption beneath in `#6E7A90`. See `assets/hero-stadium-illustration.svg` — **placeholder**; the client may swap a real editorial illustration. Render it as a component; it's pure SVG with internal gradients (`#sky`, `#sun`, `#halo`, `#domeG`, `#road`, `#vig`) and a few looping animations (`floatY`, `pulseRing`, `twinkle`, `dashMove`).

**(b) The Problem** — eyebrow (red) `THE PROBLEM`. H2: *"70,000 fans. One target."* + italic red *"One catastrophic spike."* Lead. Then the `ArrivalChart` showing **only the red curve**, in a card with red-tinted gradient bg + `rgba(226,104,91,.18)` border.

**(c) The Solution** — eyebrow (green) `THE SOLUTION`. H2 with italic green accent. Then the full `ArrivalChart` with **both curves** + legend (Without WaveIn / With WaveIn). Card bg green-tinted.

**(d) How it works** — full-bleed **cream** section (`#F6EFE2`, `ink-on-cream` text) with a faint gold glow blob top-right. Centered eyebrow `HOW IT WORKS` + H2 with italic gold accent. Three cards (`repeat(3,1fr)`, `cream-card` bg, `0 16px 40px rgba(120,90,40,.08)`): each has a big serif number (`01/02/03` in `#E0A24A`), a line icon, a 19px/700 title, and a `#56607A` description.
- 01 **Enter your origin** — "Tell WaveIn where you're starting and how you'll travel — MARTA, driving, or rideshare." (location-pin icon)
- 02 **Get your wave** — "In seconds, you're matched to a personalized arrival window — with priority for the early & green." (wave icon)
- 03 **Arrive stress-free** — "Glide past the crush, walk into a calmer gate, and unlock rewards for showing up smart." (gift icon)

**(e) Sustainability impact** — dark, green radial glow at top. Eyebrow `SUSTAINABILITY IMPACT` + H2 italic green *"stadium scale."* A green-tinted panel (`24px` radius, `rgba(91,214,160,.22)` border): label `PROJECTED ACROSS 8 WC26 GAMES`, then a giant serif **CountUp to 408,000** + "kg CO₂ eliminated", a centered gradient divider, then three equivalency cards (`repeat(3,1fr)`): 🌳 **2,190** trees planted · 🚗 **89** cars removed for a year · ✈️ **51** transatlantic flights offset (serif CountUps). Emoji are intentional here.

**(f) Two paths CTA** — centered H2 *"Choose your"* + italic gold *"side of the wave."* Two cards (`1fr 1fr`):
- **For Organizers** — navy gradient (`#16243F→#0D1729`), blue glow, eyebrow `FOR ORGANIZERS`, serif title "Run the night from one command center.", body, button **"Open the dashboard →"** (blue-tinted, `rgba(127,168,224,.4)` border) → opens login modal (organizer).
- **For Fans** — cream gradient (`#F6EFE2→#EFE2CC`), gold glow, `ink-on-cream` text, eyebrow `FOR FANS`, serif title "Find your wave in under a minute.", body, gold button **"Find my wave →"** → opens login modal (fan).
Footer strip below: logo + "· Play With Purpose · Atlanta 2026" and "Free Kick Track — Events & Entertainment".

### 3. Login modal (`LoginModal.js`)
Fixed overlay `rgba(6,10,18,.74)` + `blur(8px)`, `fadeIn .3s`; click backdrop to close. Card max-width `430px`, gradient `#141F36→#0E1729`, `22px` radius, `0 40px 100px rgba(0,0,0,.6)`, `modalIn .45s`. Contents: logo + wordmark; serif H3 + sub (role-aware); Email + Password fields (`rgba(255,255,255,.04)` fill, `.12` border, `11px` radius); a full-width gold primary button; "New here? Create an account" (gold link). **Role-aware copy:**
- organizer → H3 "Organizer sign in" · sub "Access the Event Command Center" · button "Enter Command Center" → on submit, route `/dashboard`.
- fan → H3 "Welcome to WaveIn" · sub "Find your wave for WC26" · button "Continue to my wave" → on submit, route `/fan`.

The modal does **not** authenticate yet — submit just routes. Wire to real auth later.

### 4. Organizer Dashboard — `/dashboard`
Max-width 1340. Wrap regions in `Reveal` (faster: `.7–.9s`).

**Header row** (space-between, wrap): left — eyebrow `ORGANIZER · LIVE` (gold) + serif H1 **"Event Command Center"**. Right — an **event selector** pill (stadium icon + "Spain vs Cape Verde" / "Jun 15, 2026 · 7:00pm KO" + ▾; keep text `white-space: nowrap`), a **"+ New Event"** button (gold-outline), and a **LIVE** pill (green, pulsing dot via `twinkle 1.6s`). Populate event(s) from `lib/data.js`; wire the dropdown to switch events (currently single event).

**Stat cards** (`repeat(4,1fr)`, `18px` radius, tinted gradients):
| Label | Value | Sub | Number color |
|---|---|---|---|
| TOTAL FANS | `68,400` | Spain vs Cape Verde · Jun 15 | `#F4EDE0` |
| ACTIVE WAVES | `4` | Waves 1–4 operational | `#E8B45A` |
| CO₂ SAVED | `21,942` kg (**CountUp**) | this event | `#5BD6A0` |
| CAR → MARTA | `12,001` | fans rerouted to transit | `#6FA0E0` |
Each card: uppercase nowrap label + a small stroke icon (people / wave / leaf / train), big `clamp(32px,3.4vw,44px)/800` number, muted sub. All values from `lib/data.js`/`lib/logistics.js`.

**Arrival Distribution chart** — full `ArrivalChart` (both curves, legend, y-axis incl. 2,000/6,000 ticks + rotated "Fans / 15 min" label, kickoff badge "Kickoff" at 7:00). Title: `Arrival Distribution — Spain vs Cape Verde, Jun 15 · 7:00pm KO`. This is the visual hero of the dashboard.

**Bottom row** (`1.55fr / 1fr`):
- **Wave Assignments — Active** table. Columns: Wave · Window · Zones · Reward · Fans (`grid-template-columns: 1.1fr 1.1fr 1.2fr 1.4fr .7fr`). Header row uppercase `#6E7A90` 10.5px. Rows from `lib/data.js`:
  | Wave (dot) | Window | Zones | Reward | Fans |
  |---|---|---|---|---|
  | Wave 1 (green `#5BD6A0`) | 4:30 – 5:15pm | Airport, Downtown | Free drink + Priority Gate | 5,200 |
  | Wave 2 (gold `#E8B45A`) | 5:15 – 5:45pm | Midtown, Buckhead | $10 concession credit | 6,800 |
  | Wave 3 (deep-gold `#D99A4E`) | 5:45 – 6:15pm | Decatur, Sandy Springs | Standard + $5 credit | 4,900 |
  | Wave 4 (red `#E2685B`) | 6:00 – 6:45pm | Suburbs (30+ min) | Standard entry | 3,100 |
  Dots have a matching glow (`box-shadow: 0 0 8px <color>`). Right-align Fans.
- **Sustainability Impact** panel (green-tinted): leaf icon + uppercase title; "CO₂ saved this event" + serif **CountUp 21,942 kg** + a 62%-filled green progress bar; "Car → MARTA shifts" `12,001 fans` + 52% blue bar; divider; "Projected: full season" serif **408,000 kg** CO₂ eliminated; equivalency list (🌳 2,190 / 🚗 89 / ✈️ 51); a small methodology footnote in `#6E7A90`. All numbers from `lib/*`.

### 5. Fan View — `/fan`
Centered, warm — a gold radial glow behind a `560px` card. Two states.

**Form state** (card gradient `#17243E→#101A2E`, `24px` radius, gold-tint border, big shadow):
- Pill badge `⚽ WC26` (green→gold gradient).
- Serif H1 **"Find Your Wave"** + sub `Spain vs Cape Verde · Jun 15, 2026 · 7:00pm KO`.
- **Which event are you attending?** — read-only event card (stadium icon + name + datetime + ▾). Wire to `lib/data.js` events.
- **Where are you coming from?** — custom dropdown button → menu of origin zones (`Airport / South, Downtown, Midtown, Buckhead, Decatur, Sandy Springs, Suburbs (30+ min)`). Menu: `#1A2840`, `13px` radius, `modalIn .22s`, items hover `rgba(232,180,90,.14)`. Placeholder text `#8A98AE`; selected text `#F4EDE0/600`. Source zones from `lib/data.js`.
- **How are you getting here?** — same dropdown pattern. Options (label + sub): `MARTA · Rail` ("Cleanest — priority waves") · `Driving` ("Personal vehicle") · `Rideshare` ("Uber / Lyft").
- **Earliest you could arrive?** `(doors open · 4:30)` — premium time-slot grid `repeat(5,1fr)`, 10 slots `4:30pm…6:45pm` (15-min steps). Unselected: `rgba(255,255,255,.03)` fill, `.1` border, `#C7D0DE`. **Selected:** gold gradient tint fill, `rgba(232,180,90,.6)` border, `#F4EDE0`, glow `0 0 0 1px rgba(232,180,90,.25), 0 6px 16px rgba(224,162,74,.18)`. `13px` radius, `.22s` transitions.
- **Get My Wave →** — full-width gold button; **disabled** (greyed, `not-allowed`) until origin + transport + time are all chosen.

Dropdowns must stack above later fields (give the open field a higher `z-index`). Clicking a field toggles its menu; selecting closes it.

**Result state** (replaces the form on submit — **call `lib/waveLogic.js`** with the chosen origin/transport/time; map its return to these fields):
- Confetti layer (6 colored bits, `confettiFall`).
- Card with `resultPop .65s`, border/glow tinted to the wave's color; top glow blob.
- Eyebrow `YOUR ASSIGNMENT`; a pill badge: serif **"Wave {n}"** + bold label (e.g. **PRIORITY / EARLY / STANDARD**) both in the wave color.
- `ARRIVE BETWEEN` + serif window (e.g. **"4:30 – 5:15pm"**).
- **If transit bonus** (MARTA): a green chip "🌱 Transit Bonus Applied — you bumped to an earlier wave".
- A details panel: 🎁 **Your reward** (e.g. "Free drink + Priority Gate Entry") and 🚪 **Entry** (e.g. "Gate A · Priority Lane").
- **"Get Directions"** gold button (pin icon) and a **"← Start over"** text button (resets to form).

**Result object shape the UI consumes** (provide via a selector over your `lib/waveLogic.js` output):
```js
{
  wave: 1,                 // number
  label: 'PRIORITY',       // status string
  window: '4:30 – 5:15pm', // arrival window
  color: '#5BD6A0',        // wave accent (green/teal/gold/deep-gold per wave)
  transit: true,           // MARTA bonus applied?
  reward: 'Free drink + Priority Gate Entry',
  gate: 'Gate A · Priority Lane'
}
```
Wave→color mapping used in the design: 1 `#5BD6A0`, 2 `#7FD8C0`, 3 `#E8B45A`, 4 `#D99A4E` (and red `#E2685B` for the latest table row). Use whatever your real logic returns; keep the visual treatment.

---

## Interactions & behavior (summary)
- **Routing/CTAs:** hero + two-paths buttons open the login modal (role), which routes to `/dashboard` or `/fan`. Nav toggle links directly. Logo → `/`.
- **Reveals:** IntersectionObserver adds `revealIn` per block on first view; honor `prefers-reduced-motion`.
- **Counters:** start on view, ease-out-cubic, `toLocaleString`.
- **Chart:** lines draw on (`stroke-dashoffset`), areas fade, on view.
- **Fan form validation:** submit disabled until all three inputs set.
- **Result reveal:** `resultPop` + confetti; "Start over" returns to the form.
- **Modal:** backdrop click / Esc closes; `modalIn`/`fadeIn`.
- **Looping ambient motion:** background blobs, stadium float/halo/twinkle, road dashes, LIVE dot.

## State management
Per page, local React state is enough (no global store needed for the visual layer):
- App/landing: `modalOpen`, `modalRole`.
- Fan page: `origin`, `transport`, `time`, `result` (null until submit), and per-dropdown `openDropdown`. `canSubmit = !!(origin && transport && time)`. On submit → `result = waveLogic(origin, transport, time)` from `lib/waveLogic.js`.
- Dashboard: `selectedEvent` (from `lib/data.js`); everything else is derived/read-only.
Keep data fetching/derivation in `lib/*`; components consume it.

## Design Tokens recap
See the *Design Tokens* tables above (colors, fonts, spacing, radii, shadows, type scale) and the *Keyframes reference* for all animation values.

## Assets
- `assets/hero-stadium-illustration.svg` — the dusk stadium/skyline/traffic hero illustration (**placeholder**, pure SVG with internal gradients + small looping animations). Drop into `StadiumHero.js`. Client may replace with a commissioned editorial illustration.
- `assets/hero-stadium-illustration.png` — flat preview of the same illustration (for reference only).
- Logo, line icons (location, wave, gift, people, leaf, train, pin, stadium/ellipse), and chart are all inline SVG in the prototype — copy them out as needed. No raster icon library required; or substitute the codebase's existing icon set at matching sizes (18–30px, 1.5–1.7 stroke).
- Emoji (⚽ 🌳 🚗 ✈️ 🌱 🎁 🚪) are used intentionally on the landing impact + fan result; keep them.

## Files
- `WaveIn.prototype.dc.html` — the full interactive prototype (open in a browser). Contains every screen, all exact inline styles, the keyframes, the chart SVG + path math, the logo SVG, and the (throwaway) interaction logic. Use it as the source of truth for any value not spelled out here.
- `assets/` — illustration SVG/PNG.

**Remember:** recreate the *visual/component layer* in Next.js (plain JS) and wire it to the **existing** `lib/data.js`, `lib/waveLogic.js`, and `lib/logistics.js` — do not reimplement that logic from the prototype.
