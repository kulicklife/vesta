# Vesta — Design System Card (Inner Tide)

Reference for reproducing Vesta's look & feel. Concept: **Inner Tide** — your natal chart is the *source* of your "tide"; today's transits are the tide *now*. The wheel (source) and a living water tideline (today) are two forms of one truth. Premium, calm, editorial, alive. Target: Apple Design Award quality.

## Identity
- Product: **Vesta** — astrology-guided daily companion for peace with food & rhythm (US/UK, women 25–40). Voice = warm wise mentor.
- Essence: *"You're not broken — you're off your rhythm."* · Tagline: *"Astrology you can live by."*

## Color tokens
| token | hex | role |
|---|---|---|
| night | `#0A0B1F` | base background |
| indigo | `#1A1840` | surfaces / cards |
| **gold** | `#F5D98B → #CAA24A` | **signature**: tideline, sun/light, CTA (1–2 accents/screen max) |
| aqua | `#7FB7C4` | water / cool surface line (pre-lit) |
| parchment | `#EFE4C8` | warm light / reading |
| dawn rose | `#F0A9A0` | secondary accent / status |
| moon white | `#ECE9F5` | text on dark |
| dim | `#A9A6C4` | secondary text / meta |

**Cool→warm rule:** before activation the water is cool & unlit (aqua, no gold/sun); gold/light "ignites" at the reveal moment and stays warm. Time-of-day environments: dawn (light, rosy) · day · dusk (default) · night.

## Type
- **Spectral** (serif) — Vesta's voice, brand moments, headlines, reveal text. *Vesta always speaks in Spectral.*
- **Inter** (or Onest) — UI, body, buttons.
- **JetBrains Mono** — meta/eyebrows/labels, caps, letter-spacing .14–.24em (e.g. `HIGH TIDE · 9PM`).
- Gold reserved for one key line / CTA; never gold body text (contrast).

## Signature visual — the living water (canvas)
The hero of every screen is a **living water surface** rendered on canvas at 60fps:
- Surface = sum of sines (continuous drift) + a Gaussian "high-tide" hump at `peakX`; area filled with a vertical gradient (aqua→deep→transparent); luminous **gold surface line** with soft glow; a travelling specular glint.
- **Sun = Vesta** above the waterline: radial glow + slow-rotating god-rays + hot core; **broken shimmering reflection bands** anchored to the crest (light on water).
- **Sinking light motes** + slow drifting current lines give depth (kills dead space).
- A breathing "now" dot on the line; tap → swell + expanding ripple ring + haptic.
- One persistent canvas across the flow (**TideCanvas**) — never reset; screens are cards over it. Cool→warm via a `warm` 0→1 factor; tide level rises along the journey.

## Motion & haptic
- Everything breathes (slow, warm, no bounce). Base transition 300–430ms ease-in-out; "rise/compose" easeInOutCubic.
- Single transition primitive everywhere: **water swell + card fade/slide (430ms)**.
- Haptic vocabulary: `swell` (ramp on drag), `anchorDone` (success), `insightPeak` (soft+sharp), `highTideAlert` (double-soft), `tick`.
- **Reward escalation:** a `trust` meter 0→1 across recognition beats ramps light + haptic together (not per-screen).
- **Reduce Motion:** water freezes to one frame; transitions become instant; draws show final frame.

## Components
Phone frame 390×800, radius 56, Dynamic Island, drawn status bar (no SF-Symbols glyphs). Glass cards: `blur(18px)`, hairline top highlight, radius 24. Gold pill CTA. Chips (gold outline / solid). Tab bar ≤4 (Today / Vesta / Tide / You). Natal **wheel**: hairline gold rings + house spokes + zodiac ticks + planet glyphs (☉☽☿♀♃♄), active planet glows; light thread connects active planet → tide crest.

## Principles
One tide, one glance · make it felt not told · the tide doesn't keep score (anti-pressure, no punishing streaks) · source on demand (wheel = trust, not imposed) · live beyond the app (widgets/Live Activity/Watch) · compose don't accumulate (progress = a building rhythm) · inclusive by default (VoiceOver/Dynamic Type/Reduce Motion/AA contrast day-1).

## Tone of voice
Warm, low, steady — like the sea; a mentor beside you, never above. Yes: *tide, pull, ebb, flow, rise, settle, ride it, your rhythm, gently, notice, today, you're not broken, peace with food.* Examples: *"The pull comes in around nine. You don't have to meet it head-on." · "Hard tides pass. You met it — that's enough for today."*

## Guardrails (hard)
**No health-claims, ever, any language:** weight, kg, lbs, lose, diet, calorie, BMI, diagnosis, doctor, willpower, "fix yourself", "result in N days". Reframe to rhythm / relationship with food / energy / self-understanding. No countdown/FOMO/dark-patterns on paywall. No generic-horoscope clichés, no zodiac-wheel kitsch, no neon, no stock space, no realistic planets, no caps-lock promises.

## Don't
Stair-stepped or progress-bar reveals (water should *rise into shape*, not draw left→right) · cold minimalism · slideshow onboarding · per-screen one-off styling (use the shared water engine + tokens).

---
*Canonical code examples & full spec: see `inbox/2026-06-14_vesta-*` — start with `vesta-full-flow.html` (engine + flow), `vesta-design-strategy-inner-tide.md`, `vesta-tidecanvas-transitions-spec.md`, `vesta-dev-requirements.md`. UI text EN, no health-claims.*
