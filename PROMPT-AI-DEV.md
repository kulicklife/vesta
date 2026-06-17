# Промпт для ИИ-разработчика Vesta — переход на единый источник правды

> Скопируй этот блок целиком в чат с ИИ-разработчиком (он уже в контексте проекта Vesta).

---

Ты — ИИ-разработчик **Vesta** (iOS-first Expo/React Native + web как верх воронки; бэкенд FastAPI; концепт **Inner Tide**). Часть кода уже есть: `core/tideState.ts` (`journeyProgress`/`surfaceFrac`), `App.tsx`, `TideCanvas.web.tsx`, нативный Skia-вариант; демо на astro-online.xyz.

**ГЛАВНОЕ ИЗМЕНЕНИЕ: единый источник правды по дизайну — теперь репозиторий `github.com/kulicklife/vesta` (ветка `main`).**
Перестань опираться на старые разрозненные файлы `inbox/2026-06-14_vesta-screen-*.html` — они исторические. Всё консолидировано и поддерживается в этом репозитории. Перед работой всегда делай `git pull`.

## Что в репозитории и как это использовать
- **`tokens.css` / `tokens.ts`** — ЕДИНСТВЕННЫЙ источник токенов (цвет, типографика, spacing, radius, motion, haptic-словарь) + ban-лист копи. Сведи свои токены к ним.
- **`tide-engine.js`** — канонический водный движок (эталон логики): `surfaceY` = сумма синусов + гребень high-tide; sun=Vesta с god-rays; reflection bands; тонущие motes; swell/ripple; **cool→warm** через фактор `warm`. Твой `TideCanvas` (Skia и web) должен соответствовать ему. Где код расходится — приведи к эталону. `journeyProgress`/`surfaceFrac` (подъём воды) — оставить, сверить с маппингом из движка.
- **`screens/*.html`** — **визуальная истина по каждому экрану** (открывай в браузере как референс вида/поведения). НЕ порти HTML 1:1 в прод — реализуй нативно, но добивайся того же ощущения.
- **`docs/`** — контракты сборки:
  - `tidecanvas-spec.md` (**B1**): один персистентный `TideCanvas` под навигацией; экраны — оверлеи; **линия не пересоздаётся**; единый `transition()` (swell + fade/slide); web→app «same line»; reward-curve (trust 0→1); VoiceOver-нарратив; 60fps; **§3a — re-reading (CR-001): единственное легитимное пересоздание линии** при правке данных рождения.
  - `dev-requirements.md` (+Addendum **F1–F12**): фичи, состояния, data-контракты `/tide/*`, Live Activity/виджеты/Watch, haptic-паттерны.
  - `kickoff-tickets.md` — с чего начать. `concept.md` / `design-strategy.md` — зачем. `narrative-journey.md` (биты B0–B13), `reveal-content.md` (720 reveal-комбинаций, 0 токенов), `anchor-practices.md` (40 якорей) — контент.
- **`HANDOFF.md`** — как потреблять + контракт «готово» по каждому экрану.

## Жёсткие правила (всегда)
1. **Один персистентный TideCanvas** под всей навигацией активации/daily; экраны строятся поверх; вода не пересоздаётся (исключение — только re-reading §3a).
2. **Единый переход** везде: `swell + fade/slide` ~430ms, а не нативный stack-cut с новой водой.
3. **cool→warm:** до Lighting вода холодная/без золота; свет/золото «загораются» в Lighting и остаются.
4. **No health-claims** (ban-лист в `tokens.ts`: weight/kg/diet/calorie/BMI/lose/willpower/«result in N days» + RU-эквиваленты). Повесь контент-линт в CI.
5. **DoD каждого экрана:** все состояния (default/loading-нарратив/empty/error/offline) · Reduce Motion · Dynamic Type AX2 · VoiceOver (tideline/колесо озвучены) · AA-контраст · 60fps на SC-3/4/7.

## Сверка с уже написанным кодом (не переписывай с нуля)
Сопоставь существующее (`core/tideState.ts`, `TideCanvas.web.tsx`, Skia) с эталоном `tide-engine.js` + контрактом B1. Зафиксируй расхождения, приведи к контракту. `journeyProgress` уже даёт монотонный подъём воды — это правильно; сверь только формулу `surfaceFrac` и набор стадий (birth→lighting→reveal-слои→recognition).

## Рабочий цикл и правки
- `git pull` из `main` перед работой; `screens/*.html` = визуальный референс, `docs/` = контракт.
- Новые правки/CR приходят **коммитами в этот репозиторий**. Пример: **CR-001** уже внесён — `screens/full-flow.html` (петля «check details» в recognition_no) + `docs/tidecanvas-spec.md §3a`. Смотри `git log`/`diff`.
- Открытое не-дизайнерское: **B2** (event-map «тап→событие»: `recognition_yes`, `trial_start`, `trial_to_paid`, `recognition.check_details`, `input.birth_edited`, `chart.recomputed` …) и **B3** (guardrail-линт копи) — согласуй с CPO/CTO.

## Первые шаги
1. Прочитай `HANDOFF.md`, `docs/tidecanvas-spec.md`, `docs/dev-requirements.md`.
2. Сведи токены к `tokens.ts`; сверь свой `TideCanvas` с `tide-engine.js`.
3. Доведи критпуть **Lighting → Reveal → Today** (60fps, haptic) поверх одного TideCanvas, переходы — единым приёмом.
4. Подключи события (B2) и контент-линт (B3).

## Не делать
Не тащить старые `inbox/...-screen-*.html`; не строить отдельную воду на каждый экран; не вводить health-claims; не делать резкий reset линии (кроме re-reading); UI-тексты — только EN.
