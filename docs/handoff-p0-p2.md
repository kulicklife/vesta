# Vesta — Dev Handoff (P0–P2) · Simple/natal adaptations + input bugfix

**Дата:** 2026-06-20 · **Автор:** Senior Product Designer
**Источник требований:** competitive-simple-natal-adaptation (D8–D15) + path-review-retention-PO (input bug). **Гейт:** §4 на каждый экран, zero banned-lexicon, один водный движок, токены переиспользованы.
**Фреймы (в `screens/`, на TideCanvas + tokens.css):** `birth-input.html` (P0-1) · `chart-signature.html` (P0-2) · `horizon.html` (P0-3) · `push-softask.html` (P1-1). P1-2 → правка `lighting.html`/`reveal.html`; P1-3 → состояния в `today.html`.
**Метрики:** activation `recognition_yes`; retention (daily-rhythm); conversion trial→sub.

> Каждый экран ниже — по §4: 1 frames · 2 layout · 3 components · 4 interaction/motion · 5 copy EN/RU · 6 analytics · 7 edge · 8 redline · 9 acceptance. Reduce-motion и iOS-паттерны — обязательны. Токены — из `tokens.css`/`tokens.ts`.

---

## P0-1 — Birth-data Input (S2): нативные wheel-пикеры
**Frame:** `screens/birth-input.html` (430×932, TideCanvas env=night, cool, `warm:0`).

**2 Layout.** Скролл-контейнер; шаг = бит. Заголовок `font-display` 24 (`--t-title`+), rationale `font-display italic` 13 `--dim`. Большое подтверждённое значение `font-display` 26 `--gold-1` над колесом. Колесо: 3 колонки высотой 150, центральная зона выделена hairline-золотом (`rgba(245,217,139,.28)`), соседи приглушены маской-градиентом. Поля/инпут радиус `--r-input`(14). CTA — `--gold` pill, `--r-pill`. Отступы по 4-pt шкале (`--s-*`). Privacy-строка `font-meta` 9 `--aqua`.

**3 Components/props.**
- `WheelPicker` (новый) — props: `columns:[{items,selected}]`, `onChange(colIndex,value)`, `loop:false`. States: default · scrolling(центр подсвечен) · settled(snap+haptic). Реализация: scroll-snap колонки, центр = `round(scrollTop/itemH)`; всегда валидное значение.
- `FieldRow` (reuse) — `label,value|placeholder,onTap`. States: empty(placeholder `--dim`) · set(value `--gold-1`).
- `SkipToggle` (новый) — «I don't know → solar», bool; states off/on.
- `CityAutocomplete` (новый) — props `min:3,onQuery,results[]`. States: idle(«type 3+») · loading(«Searching…» с пульс-точкой) · results · no-results · selected(✓).
- `Confirm` (новый, echo-back) — props `weekday,date,city,timeLabel`; кнопки primary/secondary.

**4 Interaction/motion.** Прокрутка колонки → инерция → snap (`--dur-base` ease), лёгкий haptic `tick` на смене значения; большое значение обновляется в реальном времени. CTA disabled пока город не выбран (анти-silent-fail). TideCanvas: каждый завершённый бит — `tide.splash()` + лёгкий рост уровня (cool, без золота). **Reduce-motion:** колёса без инерции (мгновенный snap), частицы воды статичны.

**5 Copy (EN / RU).** *(прогон ban-лист §2.1 — чисто)*
| Поле | EN | RU |
|---|---|---|
| Date title | When were you born? | Когда ты родилась? |
| Date rationale | So I read your tide, not someone else's. | Чтобы я читала твой прилив, а не чужой. |
| Time title | Do you know your hour of birth? | Знаешь час своего рождения? |
| Time rationale | It sharpens the hour your tide rises. No clock? I read your tide by the day — still fully yours. | Уточняет час, когда твой прилив поднимается. Не знаешь? Прочту по дню — всё равно полностью твой. |
| Time skip | I don't know it → read my solar tide | Не знаю → читать солярную карту |
| City title | Where were you born? | Где ты родилась? |
| City rationale | Your place fixes your tide in time. | Твоё место закрепляет прилив во времени. |
| City loading | Searching… | Ищу… |
| City no-results | No places match "{q}". Check spelling? | Не нашла «{q}». Проверь написание? |
| Confirm | Born {Weekday} · {date} · {City, Country}. Right? | Рождение: {Weekday} · {date} · {City, Country}. Верно? |
| Confirm yes/fix | Yes, read my tide / Fix something | Да, читай мой прилив / Поправить |
| Privacy | Your details stay yours — only to read your chart. | Твои данные остаются твоими — только чтобы прочесть карту. |

**6 Analytics.** `input_method_wheel` (field) · `input_field_complete{field}` · `city_search{len,results_n}` · `city_select{country}` · `time_skip_solar` · `input_confirm_view` · `input_confirm_fix{field}` · `input_birth_complete{has_time}`.

**7 Edge.** Будущая дата заблокирована (год ≤ текущий). City offline → «Can't search right now — type your city, we'll match it later». Длинные названия → перенос/усечение 2 строки. Пустое время = solar (не ошибка). Возврат «Fix something» сохраняет значения (prefilled).

**8 Redline vs current.** Preserved: шаги/порядок, «see an example tide», solar-skip, водный фон. Changed: текст-поле даты/времени → **WheelPicker** (фикс silent-fail; значение всегда валидно); city — autocomplete с **3 символов** (+loading/no-results); добавлен **Confirm echo-back с днём недели**; rationale под каждым полем.

**9 Acceptance.** ☐ Дата/время выбираются колесом, выбранное всегда валидно. ☐ Тап CTA без выбора города невозможен (нет silent-fail). ☐ City подсказки с 3 симв + loading + no-results. ☐ Solar-skip ведёт дальше как равноценный. ☐ Confirm показывает «Born {Weekday} · …». ☐ Reduce-motion: snap без инерции. ☐ 0 ban-лексики EN+RU.

---

## P0-2 — Chart (S6): Tide signature + rich readings + link-to-today
**Frame:** `screens/chart-signature.html` (env=dusk, warm).

**2 Layout.** Лид-карта **Tide signature** (`--gold` тинт, `--r-card`, `font-display` 19) над колесом. Кнопка «View the chart wheel» (вторичная, не дефолт). Section-заголовки `font-meta` 9.5 `--aqua`. `PlanetRow` список (radius 16). Patterns — карточки. Locked-teaser — dashed-бордер карта. Expanded reading — полноэкранный слой, slide-in справа (`--dur-transition`), параграфы `font-display` 16/1.55, link-to-today блок снизу.

**3 Components/props.**
- `TideSignatureCard` (новый) — `text`. Один синтез баланса карты (element/modality lean → язык прилива).
- `PlanetRow` (новый) — `glyph,name,sub,onTap`. **Без градусов/домов** в списке.
- `ReadingView` (новый) — `title,paras[],todayLine,onBack`. Multi-paragraph, тёплый, без жаргона/health.
- `PatternCard` (новый) — `text` (agency-affirming concовка).
- `LockedDepth` (новый, brand-safe) — `headline,sub,cta`; **не** points/score; формулировка «three readings are open, Vesta holds the rest».
- Reuse `TabBar` (Today/Vesta/This week/Chart).

**4 Interaction/motion.** Тап `PlanetRow` → `ReadingView` slide-in; «‹ Your chart» → slide-out. Link-to-today → переход на Today. TideCanvas warm, тёплое свечение; на открытии чтения — лёгкий `tide.splash`. **Reduce-motion:** без slide (мгновенно).

**5 Copy (EN / RU).** *(чисто; без degrees/house numbers/health)*
| Эл-т | EN | RU |
|---|---|---|
| Signature | Your water runs mostly steady and grounded, with little surge — your tide holds before it rises. Not too much, not too little: this is the shape you move in. | Твоя вода в основном ровная и устойчивая, без резких всплесков — прилив выжидает, прежде чем подняться. Не слишком, не мало: это форма, в которой ты живёшь. |
| Moon read (excerpt) | Your Moon reaches deep, and after dark… care isn't a weakness in you — it's the current you run on. | Твоя Луна тянется глубоко и после темноты… забота — не слабость, а течение, на котором ты идёшь. |
| Link-to-today | This is why your tide tends to rise late, after dark. → Open today | Вот почему твой прилив поднимается поздно, после темноты. → Открыть сегодня |
| Pattern | When care runs low, your tide reaches for the kitchen by evening. It's a pattern with a tide — and a tide can be met. | Когда заботы мало, к вечеру прилив тянется к кухне. Это паттерн с приливом — а прилив можно встретить. |
| Locked | Three readings are open. Vesta holds the rest. Your full chart readings and unlimited talks with Vesta open with your subscription. | Три чтения открыты. Остальное Веста хранит. Полные чтения карты и неограниченные разговоры с Вестой — с подпиской. |

**6 Analytics.** `tide_signature_view` · `placement_read{planet}` · `pattern_view{id}` · `reading_to_today{planet}` · `chart_wheel_open` · `locked_depth_view` · `locked_depth_cta`.

**7 Edge.** Solar (no time) → signature и readings есть, но без house-зависимых строк; «read by the day» формулировка. Частичный контент → показывать готовые секции. Offline → кэш последнего чтения. Длинные чтения → скролл.

**8 Redline.** Preserved: натальное колесо (доступно), tap-планета концепт. Changed: лид теперь **signature-синтез** (не колесо); planet-чтения — **многоабзацные, без глифов/градусов/домов**; добавлены **Patterns** и **link-to-today**; колесо — вторичная поверхность; locked-depth — brand-safe (не score).

**9 Acceptance.** ☐ Signature — первый экран, над колесом. ☐ Тап планеты → богатое чтение без градусов/домов/health. ☐ Каждое чтение имеет link-to-today. ☐ ≥1 pattern с agency-концовкой. ☐ Колесо доступно, но не дефолт. ☐ Locked-teaser без points/score. ☐ 0 ban-лексики.

---

## P0-3 — Dated horizon / milestone
**Frame:** `screens/horizon.html` (env=dusk, warm). Surfaced: после Reveal + карта на Today/This-Week.

**2 Layout.** `HorizonCard` (`--gold` тинт, `--r-card`): строка с мини-фазой Луны + лейбл даты (`font-meta`), текст `font-display` 17, прогресс-трек (6 pip-делений, `--gold` fill), счётчик «N tides / days». Состояния — `initial / progress / reached` (в reached — CTA «next horizon»).

**3 Components/props.** `HorizonCard` (новый) — `state:'initial'|'progress'|'reached'`, `date`, `tidesRidden`, `tidesTarget`, `daysLeft`, `moonLit%`. `MoonPhaseDot` (новый, декоративный) — `lit%`.

**4 Interaction/motion.** Трек-fill анимируется `--dur-base`; tap → Today/This-Week. Reached → лёгкий `tide.splash`. **Reduce-motion:** fill без анимации.

**5 Copy (EN / RU).** *(brand-safe — никаких outcome-к-сроку)*
| State | EN | RU |
|---|---|---|
| Initial | By the next new moon (Jul 5), you'll have ridden ~12 tides — and we'll read your evening pull far more clearly. | К новолунию (5 июл) ты пройдёшь ~12 приливов — и мы куда яснее прочтём твой вечерний пул. |
| Progress | 4 of ~12 tides ridden · 8 days to the new moon. Your evening pull is already clearer than day one. | 4 из ~12 приливов пройдено · 8 дней до новолуния. Твой вечерний пул уже яснее, чем в первый день. |
| Reached | New moon, today. You've ridden 12 tides with me — here's your evening pull, read clearly. The next horizon begins tonight. | Новолуние, сегодня. Ты прошла 12 приливов со мной — вот твой вечерний пул, ясно. Следующий горизонт начинается вечером. |

**6 Analytics.** `horizon_view{state}` · `horizon_tap_today` · `horizon_reached`.

**7 Edge.** Пропуски не «штрафуют» счётчик (растёт по riddenданным, не календарю). Дата новолуния детерминирована из эфемерид (CTO). Offline → последний known state.

**8 Redline.** Новый элемент. Preserved-принцип: brand-safe (язык прилива/ритма), без запрещённой лексики и обещаний результата к сроку (см. §2.1).

**9 Acceptance.** ☐ Карта даёт конкретную дату + счёт приливов, без outcome-обещаний. ☐ 3 состояния. ☐ Появляется post-Reveal и на Today/This-Week. ☐ Прогресс по riddenданным, не наказывает пропуски. ☐ 0 ban-лексики.

---

## P1-1 — Push permission soft-ask
**Frame:** `screens/push-softask.html` (env=dusk, warm). Прайминг до нативного диалога iOS.

**2 Layout.** Низ-выровненный блок: eyebrow, `font-display` 25 строка, italic sub, `--gold` CTA, «Maybe later» текст-кнопка. Нативный диалог — мок системного alert (iOS-стиль). Toast результата.

**3 Components/props.** `SoftAskScreen` (новый) — `onAllow,onLater`. `SystemPushDialogMock` (только для прототипа; в проде — реальный `UNUserNotificationCenter`). `ResultToast`.

**4 Interaction/motion.** «Allow gentle nudges» → системный диалог; allow/deny → toast. «Maybe later» → toast + повторный мягкий спрос позже. Reduce-motion: без анимаций. Deny **не блокирует** продукт.

**5 Copy (EN / RU).** *(чисто)*
| Эл-т | EN | RU |
|---|---|---|
| Eyebrow | Before iOS asks | Прежде чем спросит iOS |
| Headline | May I find you at your high tide? | Можно найти тебя в твою высокую воду? |
| Sub | I'll send one gentle word when your pull tends to rise — never noise, never every hour. | Пришлю одно тёплое слово, когда твой пул поднимается — без шума, не каждый час. |
| Allow / Later | Allow gentle nudges / Maybe later | Разрешить мягкие напоминания / Может позже |
| After allow | Thank you. I'll meet you at your high tide — one gentle word, no more. | Спасибо. Встречу тебя в высокую воду — одно тёплое слово, не больше. |
| After deny | That's alright. The tide doesn't keep score — turn it on anytime in You. | Это нормально. Прилив не считает очки — включишь в любой момент во вкладке «Ты». |

**6 Analytics.** `push_softask_view` · `push_softask_allow` · `push_softask_deny` · `push_softask_later` · `push_system_result{granted}`.

**7 Edge.** Если системно уже granted/denied — экран не показывать (читать статус). Later → ре-ask после N приливов. Deny → продукт полностью доступен; ре-ask мягкий, ≤1.

**8 Redline.** Новый экран (перед системным диалогом). Не меняет существующее.

**9 Acceptance.** ☐ Прайминг до системного диалога. ☐ Allow→native; deny/later не блокируют. ☐ Re-ask мягкий и ограниченный. ☐ Копи Весты, окно «high tide». ☐ 0 ban-лексики.

---

## P1-2 — Lighting (S3) personalization + Reveal continuity
**Где:** правка `screens/lighting.html` + первая строка `reveal.html`. Frames — те же, +1 бит.

- **Lighting:** перед сигнатурой добавить тёплый бит **«Reading your water, {name}…»** (`font-display`, typing). Опц. одна credibility-строка — **без выдуманных статистик** (напр. «I read the whole of your chart, not a sun-sign»). 
- **Reveal continuity:** открыть Reveal **той же signature-строкой** как рамкой («Your water runs steady and grounded — here's what that means»), чтобы Lighting→Reveal читались как одна мысль.
- **Motion:** typing имени ≤1.2с; Reduce-motion → сразу финал. TideCanvas без изменений (cool→warm как в B1).
- **Copy:** EN «Reading your water, {name}…» / RU «Читаю твою воду, {name}…». **Ban-лист чист.**
- **Analytics:** `lighting_personalized_view` · `reveal_framed_by_signature`.
- **Redline:** Preserved — вся последовательность Lighting/Reveal (4 карты + recognition + «Not quite»). Changed — +1 именной бит; рамочная строка Reveal.
- **Acceptance:** ☐ Имя появляется в Lighting. ☐ Нет выдуманных цифр. ☐ Reveal открывается signature-рамкой. ☐ Reduce-motion ок.

---

## P1-3 — Evening check-in: видимая петля сочувствия
**Где:** состояния в `today.html` (утренний инсайт + вечерний чек).

- Вечерний чек: Settled / Mixed / **Hard** (ощущения, не числа). При **Hard** — следующий утренний инсайт ссылается с сочувствием, **без** «исправься».
- **Состояния (утро):**
  - *yesterday-hard:* «Yesterday's tide ran hard. You met it — that's enough. Today the water sits a little lower; let's keep it gentle.»
  - *yesterday-settled:* «Yesterday settled. Your water's steady this morning — one small step keeps the rhythm.»
- **Copy RU:** hard → «Вчера прилив был тяжёлым. Ты встретила его — этого достаточно. Сегодня вода чуть ниже; идём мягко.»; settled → «Вчера улеглось. Утром вода ровная — один маленький шаг держит ритм.»
- **Motion/Tide:** утро hard → среда чуть прохладнее/ниже уровень (`baseY` чуть ниже, мягче свет); settled → ровнее. Reduce-motion ок.
- **Analytics:** `checkin_select{feeling}` · `checkin_hard_path` · `morning_state{prev_feeling}`.
- **Edge:** нет вчерашнего чека → нейтральное утро. Несколько Hard подряд → тон поддержки, не тревоги; без эскалации.
- **Redline:** Preserved — вечерний чек и Today. Changed — морнинг-инсайт читает вчерашний `feeling` (compassion-loop).
- **Acceptance:** ☐ Hard → утро ссылается с сочувствием, без «fix». ☐ Два морнинг-состояния. ☐ Тон наставницы. ☐ 0 ban-лексики.

---

## P2 — опционально (спроектировано, флагнуто)
- **+1 эмоциональный вопрос квиза:** «What would a calmer relationship with food feel like?» / RU «Каким было бы более спокойное отношение с едой?» — только если остаётся **одним** добавленным вопросом; вода-как-прогресс сохранена. *Флаг: тестировать против длины квиза (drop-off).*
- **Brand-safe teaser залоченной глубины на paywall/trial:** проблеск полных chart-readings / безлимитного диалога с Вестой — **не** points/score. Реюз `LockedDepth` из P0-2. *Флаг: согласовать с тир-моделью (открытый гейт).*

---

## Definition of Done (свод)
☑ P0-1/P0-2/P0-3 — фреймы + §4. ☑ P1-1 — фрейм + §4; P1-2/P1-3 — §4 (правки существующих экранов). ☑ P2 — спроектировано + флаги. ☑ Один водный движок (TideCanvas), cool→warm, токены переиспользованы. ☑ Все существующие флthouы достижимы (redline). ☑ 0 banned-lexicon EN+RU. Открытые гейты (RU-рынок, тир-модель, триал 3 vs 7, post-cancel gating) — намеренно вне этого хендоффа.

*Хендофф P0–P2, 2026-06-20. Ложится 1:1 в задачи ИИ-разработке (C8–C12). Source of truth — этот репозиторий.*
