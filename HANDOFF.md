# Vesta — Design → Dev Handoff

Этот репозиторий — **единый источник правды дизайна**. Его линкует Claude Design (для итераций/новых экранов) и из него же берут разработчики. Один репозиторий, один поток.

## Структура
```
vesta-design-system/
├─ tokens.css / tokens.ts     # цвет, тип, spacing, radius, motion, haptic, ban-лист копи
├─ tide-engine.js             # TideCanvas — канонический водный движок (сердце системы)
├─ components.css             # карточка-стекло, gold-CTA, чипы, tab bar, phone frame
├─ index.html                 # живой демо-экран (как всё собирается)
├─ screens/                   # ВСЕ экраны пути (см. таблицу ниже)
├─ docs/                      # стратегия, концепт, дев-спека, B1-контракт, нарратив, контент
├─ README.md                  # design-system card (ДНК)
└─ HANDOFF.md                 # этот файл
```

## Как этим пользоваться

**Дизайн / итерации — в Claude Design:**
- Линкуй этот репозиторий (или папку) в Claude Design → проект видит токены, движок и все экраны.
- Новые экраны делай из шаблона `screens/full-flow.html` или копии любого экрана — они уже наследуют живую воду и токены.
- Ревью на реальных размерах, генерация кода — там же.

**Разработка (Expo / RN, iOS-first):**
1. `tokens.ts` → положить как модуль токенов в приложение (единый источник цвета/типа/motion).
2. `tide-engine.js` → **портировать на React Native Skia** (`@shopify/react-native-skia`): математика воды 1:1, меняются вызовы рисования. Держать как **один персистентный `TideCanvas`** (контракт B1, `docs/tidecanvas-spec.md`) — не пересоздавать при навигации.
3. Экраны строить **поверх** одного TideCanvas; смена сцены — через единый `transition()` (swell + fade/slide), а не stack-push с новой водой.
4. Фичи F1–F12 и состояния — по `docs/dev-requirements.md` (+Addendum).
5. Шрифты: Spectral / Inter / JetBrains Mono — для прода self-host (`.woff2` + `@font-face`), не CDN.

## Контракт по каждому экрану (что значит «готово»)
Каждый экран сдаётся с: все состояния (default · loading-нарратив · empty · error · offline) · Reduce Motion · Dynamic Type AX2 · VoiceOver (tideline/колесо озвучены) · AA-контраст · 60fps на анимационных · копи прошла guardrail-линт (no health-claims) · события «тап→event» (B2, от CPO/CTO).

## Карта экранов

| Экран | Файл | Стадия | Статус |
|---|---|---|---|
| Landing | `screens/landing.html` | S0 web | ✅ |
| Quiz (mirror) | `screens/quiz-birth.html` | S1 | ✅ — birth-часть **заменена** на onboarding-input |
| **Onboarding input (earn-the-ask)** | `screens/onboarding-input.html` | S1/S2 | ✅ **заменяет холодную форму**: reframe → 3 бита (date-колесо · city-autocomplete · time+solar) с «зачем»+наградой ghost-wheel → confirm/echo-back (день недели) → Lighting. Sample-tide вторым путём, privacy. (док `inbox/2026-06-14_onboarding-input-redesign.md`) |
| The Lighting | `screens/lighting.html` | S1 (момент-подпись) | ✅ |
| Reveal | `screens/reveal.html` | S1 (метрика №1) | ✅ |
| Paywall | в `screens/full-flow.html` | S3 | ✅ |
| Today | `screens/today.html` | S2/S4 | ✅ |
| Ask Vesta | `screens/ask-vesta.html` | S4 (F12) | ✅ |
| Charge | `screens/charge.html` | S3 конверсия | ✅ |
| Chart / You | `screens/chart.html` | S4 (F4) | ✅ |
| Tide / This week | `screens/tide-week.html` | S4 | ✅ |
| Platform (Live Activity/виджеты/Watch) | `screens/platform.html` | F8/F9 | ✅ |
| Lifecycle | `screens/lifecycle.html` | S6 | ✅ |
| States | `screens/states.html` | DoD | ✅ |
| Settings + Prime | `screens/settings.html` | You | ✅ |
| Onboarding input (earn-the-ask) | `screens/onboarding-input.html` | S1/S2 (заменяет холодную форму) | ✅ |
| Sample-tide preview | `screens/sample-tide.html` | S0/S1 (taste→data) | ✅ |
| Story (audio) | `screens/story-audio.html` | S4 retention | ✅ |
| Full chart with houses | `screens/chart-houses.html` | You (time-known) | ✅ |
| Full flow (сквозной) | `screens/full-flow.html` | S0→S3 на одном холсте | ✅ |

> Batch A (DA-1…DA-12) статус — см. `docs/batch-a-status.md`.

### P0–P2 (Simple/natal adaptations + input bugfix) — dev handoff §4: `docs/handoff-p0-p2.md`
| Экран | Файл | Что |
|---|---|---|
| **P0-1 Birth-input** | `screens/birth-input.html` | нативные wheel-пикеры (фикс silent-fail) + city-autocomplete + Confirm с днём недели |
| **P0-2 Chart signature** | `screens/chart-signature.html` | tide-signature синтез + rich readings + link-to-today + locked-depth |
| **P0-3 Horizon** | `screens/horizon.html` | датированный горизонт (3 состояния), brand-safe |
| **P1-1 Push soft-ask** | `screens/push-softask.html` | прайминг в голосе Весты перед системным диалогом |
| P1-2 Lighting/Reveal | правка `lighting.html`/`reveal.html` | именной бит + signature-рамка (см. док §P1-2) |
| P1-3 Evening compassion | состояния в `today.html` | yesterday-hard/settled morning (см. док §P1-3) |

## Передача СЛЕДУЮЩИХ экранов разработчику (процесс)
1. Новый/обновлённый экран рождается в Claude Design (или здесь) → кладётся в `screens/`.
2. Коммит в этот репозиторий с пометкой статуса в таблице выше.
3. Разработчик берёт из репо; контракт «готово» — раздел выше; визуальный эталон — HTML-экран; логика воды — `tide-engine.js` + B1-спека.
4. Phase 2/3 экраны (Lenses, тир Rhythm, Android, Apple Health) добавляются тем же путём.

*UI-тексты EN, без health-claims. Источник по технике — код; по стратегии — `docs/`.*
