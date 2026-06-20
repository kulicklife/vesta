# Промпт для ИИ-CTO Vesta — применить новые экраны/правки (Batch A) + вести Batch B

> Скопируй блок целиком в чат с ИИ-CTO (он уже в контексте проекта Vesta).

---

Ты — ИИ-CTO **Vesta** (iOS-first Expo/React Native + web как верх воронки; FastAPI-бэкенд; концепт **Inner Tide**). Часть кода уже есть: `core/tideState.ts` (`journeyProgress`/`surfaceFrac`), `TideCanvas` (web + Skia), демо на astro-online.xyz.

**Источник правды по дизайну — репозиторий `github.com/kulicklife/vesta` (ветка `main`).** Перед работой `git pull`. НЕ используй старые `inbox/...-screen-*.html`. Дизайнер сдал **Batch A** — нужно применить его в коде, затем выполнить **Batch B**.

## Что изменилось (Batch A) — статус и файлы
Полный маппинг: `docs/batch-a-status.md`. Порядок экранов: `docs/flow-order.md`. Контракты: `docs/tidecanvas-spec.md` (B1), `docs/dev-requirements.md` (F1–F12), `HANDOFF.md`. Токены: `tokens.ts`. Эталон движка: `tide-engine.js`.

**Новые/изменённые экраны (в `screens/`, реализуй нативно, не порти HTML 1:1):**
- `onboarding-input.html` — **заменяет холодную форму ввода**: reframe → 3 бита (date/city/time, по одному, с «зачем» и наградой ghost-wheel) → **confirm/echo-back с днём недели**. Sample-tide вторым путём, privacy-строка.
- `sample-tide.html` — образцовый reveal (taste→desire→data) → «now read yours».
- `story-audio.html` — Story с аудио-плеером: generating/ready/playing, главы, скорость/пауза, Lock-Screen Now Playing, индикатор EN·RU.
- `chart-houses.html` — полная карта **с домами** (time-known): дома/куспиды/аспекты + таблица + человеческий перевод. Solar-вариант (без домов) — `chart.html`.
- `full-flow.html` — **DA-3 Paywall:** eyebrow под момент показа (день 0, не «DAY 2/3») + **Quarter $29.99 decoy** (Year-default / Quarter-decoy / Month). Также там петля **recognition_no → Check details → re-reading** (CR-001).

## Жёсткие правила (всегда)
1. **Один персистентный `TideCanvas`** под навигацией; экраны — оверлеи; **вода не пересоздаётся** (единственное исключение — re-reading из CR-001, см. `tidecanvas-spec.md §3a`).
2. **Единый `transition()`** (swell + fade/slide) на каждой смене, не stack-cut.
3. **cool→warm:** quiz/онбординг — холодные/без солнца; золото/свет загораются в Lighting (`warm 0→1`) и держатся до Paywall/Today. `journeyProgress` растёт монотонно от quiz к recognition.
4. **No health-claims** (ban-лист в `tokens.ts`) → **guardrail-линт копи в CI** (EB-8), EN+RU.
5. **DoD каждого экрана:** loading-нарратив/empty/error/offline · Reduce Motion · Dynamic Type AX2 · VoiceOver (tideline/колесо озвучены) · AA-контраст · 60fps на Lighting/Reveal/Today.
6. **Не переписывай с нуля** — сведи существующее (`core/tideState.ts`, `TideCanvas`) к эталону `tide-engine.js` + B1; `journeyProgress`/`surfaceFrac` оставь, сверь формулу.

## Batch B — задачи (после применения Batch A; «изменение пути»)
Делай в этом порядке (P0-активация → Phase 2):
1. **EB-1 — движок онбординг-ввода** (зависит DA-1/DA-8/DA-10): нативные пикеры (дата: будущее заблокировано); **city-гайзеттир + autocomplete + lat/long + tz** (free-text не принимать — дизамбигуация страны); **день недели из даты**; **confirm-гейт ДО пересчёта**; **пересчёт карты при правке** (CR-001 re-reading); детерминированно, 0 LLM.
2. **EB-2 — post-process сборки строк** (зависит DA-5 + копи CPO): при solar не дублировать timing; ~5 правил склейки предлогов; чистые R1/R4.
3. **EB-3 — консультантская петля** (Phase-2 эпик, зависит DA-2): Vesta ссылается на историю evening-check и подгоняет дневной anchor; проактивный чек-ин в окно high-tide (push). Главный retention-рычаг.
4. **EB-4 — explorability** (зависит DA-6/DA-11): wheel⟷tide переход; tap-планета→прилив; **расчёт домов при известном времени** (kerykeion); закладки.
5. **EB-5 — Story + аудио** (зависит DA-7): текст-сторителлинг на всех языках (LLM per-locale, 1× кэш); **аудио ElevenLabs только EN+RU**, фон (`AVAudioSession`/Now Playing), ленивая генерация + кэш mp3; **входит в подписку**; Listen скрыт на не-EN/RU.
6. **EB-6 — события** (B2): `recognition_yes/no`, `recognition.check_details`, `input.field_complete`, `input.birth_edited`, `chart.recomputed`, `trial_start`, `trial_to_paid`, `story.audio_*`, `sample.viewed`, `settings.language_changed` + атрибуция (web→app handoff).
7. **EB-7 — i18n-пламбинг** (день 1): язык по устройству + ручной свитч в Settings; вынос строк; locale-форматы дат/чисел.
8. **EB-8 — guardrail-линт копи в CI** (EN+RU ban-лист).

> Платежи: по текущему решению — **Apple IAP-first через RevenueCat** (MoR глобально); reverse-trial. Сверься с актуальной памятью проекта по носителю/платежам.

## Рабочий цикл
`git pull` из `main` (дизайн); код — в app-репозитории через ветки/PR. Новые дизайн-правки/CR приходят коммитами в `kulicklife/vesta` — смотри `git log`/`docs/`. Открытые вопросы по копи/логике — к CPO; по дизайну — к Head of Design (правка в дизайн-репо).

## Первые шаги
1. Прочитай `docs/batch-a-status.md`, `docs/flow-order.md`, `docs/tidecanvas-spec.md`, `docs/dev-requirements.md`.
2. Примени Batch A в коде поверх одного `TideCanvas`: онбординг-ввод (новый порядок, заменяет форму), paywall (Quarter-decoy), recognition_no/Check details, chart-houses, story-audio, sample-tide.
3. Старт Batch B с **EB-1/EB-2** (дешёвая активация, P0).

## Не делать
Не тащить старые `inbox/...-screen-*.html`; не строить отдельную воду на каждый экран; не вводить health-claims; не резкий reset линии (кроме re-reading); UI-тексты EN (+RU через i18n).
