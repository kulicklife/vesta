# Vesta — порядок экранов входа (для разработчика)

> Коротко: что поставить первым, чем заменить старое, как экраны стыкуются. Все — над **одним** `TideCanvas`, переход — единый `transition()` (swell + fade/slide). Палитра: **cool до Lighting → warm после**.

## Порядок активации (канон)
| # | Экран | Файл-референс | Вода | Передаёт дальше |
|---|---|---|---|---|
| 0 | Landing (web) | `screens/landing.html` | cool | source/campaign |
| 1 | **Mirror quiz** (эмоц., без PII, вода поднимается с ответами) | `screens/quiz-birth.html` (часть quiz) | cool, уровень ↑ | эмоц. контекст |
| 2 | **Onboarding input** (НОВЫЙ — reframe → date/city/time по одному → confirm/echo-back) | `screens/onboarding-input.html` | cool, ghost-wheel набирает структуру | chart-данные (date/lat-long/tz/solar) |
| 3 | The Lighting (момент-подпись) | `screens/lighting.html` | **cool→warm: тут золото зажигается** | приливная сигнатура |
| 4 | Reveal + recognition (+ recognition_no/CR-001 check-details) | `screens/reveal.html` | warm | `recognition_yes` |
| 5 | Paywall (reverse-trial) | `screens/full-flow.html` | warm | `trial_start` → deep-link в app |

Сквозной эталон всех переходов: `screens/full-flow.html`.

## Как обновить ПЕРВЫЙ экран
- Первый экран = **Mirror quiz** (cool-вода, поднимается с каждым ответом). Сразу за ним — **`onboarding-input.html`**.
- **Удалить холодную форму из 3 полей** — её заменяет `onboarding-input.html` (reframe → 3 бита с «зачем» и наградой ghost-wheel → confirm с днём недели). Старые `inbox/...-screen-*.html` не использовать.
- На экране ввода: дата = нативное колесо (будущее заблокировано), город = **autocomplete с дизамбигуацией страны** (free-text не принимать), время = колесо или тумблер «I don't know» → solar. Перед Lighting — **confirm/echo-back**: «Born {Weekday} · {date} · {City, Country}. Right?».

## 3 правила стыковки (обязательно)
1. **Один персистентный `TideCanvas`** под всей навигацией — вода НЕ пересоздаётся между экранами (единственное исключение — re-reading из CR-001).
2. **Единый `transition()`** (swell + fade/slide) на каждой смене, не нативный stack-cut.
3. **cool→warm = фактор `warm` 0→1:** quiz и input — cool/без солнца; в Lighting `warm→1` (золото/солнце загораются) и держится до Paywall/Today. Уровень воды `journeyProgress` растёт монотонно от quiz к recognition.

## Контракт по каждому экрану (DoD)
Состояния (loading-нарратив/empty/error/offline) · Reduce Motion · Dynamic Type AX2 · VoiceOver · AA-контраст · 60fps на Lighting/Reveal/Today · копи через guardrail-линт (no health-claims). События: `input.field_complete`, `input.confirm_view`, `sample.viewed`, `recognition_yes` … (event-map — B2, от CPO/CTO).

Подробности: `tidecanvas-spec.md` (B1), `dev-requirements.md` (F1–F12), `HANDOFF.md`.
