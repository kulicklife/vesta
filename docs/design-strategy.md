# Vesta — Дизайн-стратегия v2 (Inner Tide)

**Дата:** 2026-06-14
**Автор:** Head of Design
**Статус:** актуальная дизайн-стратегия. **Заменяет** прежнюю v1 («candlelight + breathing orb», [[2026-06-14_vesta-design-strategy]]). Построена на утверждённом концепте Inner Tide ([[2026-06-14_vesta-concept-inner-tide]]).
**Цель:** дизайн уровня Apple Design Award / App of the Day, который измеримо двигает воронку (recognition_yes → trial→paid → retention).
**Связь:** концепт-бриф ADA ([[2026-06-14_vesta-concept-award-grade]]) · каноничная карта пути v2 · PRD Phase 1 ([[2026-06-14_vesta-prd-phase1]]) · бренд-бук.

> **Вводные (зафиксированы).** Носитель — iOS-нативка (Expo/RN), web = верх воронки. Аудитория — женщины 25–40, US/UK, wellness-curious, неудачный диетный опыт. Scope Phase 1 (PRD): один тир **Vesta Companion**, **reverse-trial 7 дней**, экраны SC-0…SC-9. Тир Rhythm / Lenses / Apple Health / Android — Phase 2/3 (путь не закрываем).
> **Гардрейл:** никаких health-claims (вес/кг/диета/калории/BMI/диагноз/врач/результат к сроку). Язык — прилив/ритм/самочувствие/энергия/отношения с едой.

---

## 1. Design Vision

> Vesta должна ощущаться как **прилив, который наконец стал виден**. Ты всю жизнь чувствовала, что тебя «накрывает» — а теперь видишь форму волны, знаешь, когда придёт высокая вода, и у тебя есть тёплая рука, которая ведёт тебя сквозь неё. Не приложение, которое тебя оценивает, — а ритм, в который ты возвращаешься.

Три эмоции, на которые работает каждый экран (**Recognise → Relieve → Ride**):

1. **Recognise (узнавание).** «Это буквально про мой день. Откуда она знает?» → доверие, метрика №1.
2. **Relieve (облегчение).** «Это прилив, а не я-сломанная.» → снятие стыда, наш главный продукт.
3. **Ride (движение).** «У меня есть один маленький способ пройти волну.» → ежедневный ритуал, retention.

**Формула решения:** каждая дизайн-фича = (цель пользователя) × (Recognise/Relieve/Ride) × (метрика). Нет привязки — режем как «просто красиво».

---

## 2. Дизайн-принципы (привязаны к тому, за что даёт награду Apple)

| # | Принцип | Что значит на практике | ADA-якорь |
|---|---|---|---|
| 1 | **One tide, one glance** | Today показывает одно: где ты в приливе и один шаг. Без дашбордов и счётчиков. | Lumy / Tide Guide (glanceable), Opal (фокус) |
| 2 | **Make it felt, not told** | Прилив *чувствуется*: кастомный haptic-накат + дыхание воды, а не текст про эмоции. | CapWords / Denim (сенсорный момент-подпись) |
| 3 | **The tide doesn't keep score** | Никаких наказаний за пропуск, красных стриков, шкал «к цели». Прощение встроено. | Gentler Streak (анти-давление) |
| 4 | **Source on demand** | Колесо карты = доверие и глубина, доступно, но не навязано; эзо-термин всегда с человеческим переводом. | Co-Star-анти; «human language» |
| 5 | **Live beyond the app** | Прилив живёт в виджете, Live Activity, Dynamic Island, на Watch — Vesta рядом без открытия app. | Lumy / Tide Guide / Mela (платформенный craft) |
| 6 | **Compose, don't accumulate** | Прогресс — это собирающийся ритм (каждый день добавляет слой к линии), а не копилка очков. | Rytmos (слой за слоем) |
| 7 | **Inclusive by the tide** | VoiceOver/Dynamic Type/Reduce Motion/контраст — с первого дня, для всех состояний. | ADA Inclusivity (база, не пост-фактум) |

---

## 3. Дизайн-система «Water at every hour»

Эволюция бренд-бука «при свече» в **воду в разное время суток**: и узнаваемость, и смена настроения = ориентация во времени (UX) + эмоция (Ride/Relieve).

### 3.1 Среды (time-of-day surfaces)
Утро=Dawn water (подъём/ясность, светлее — для действия) · День=Day water (parchment, чтение) · Вечер=Dusk water (дефолт бренда, интимность) · Поздно=Night water (тишина, глубина). Переход между средами — медленный cross-fade температуры (600–900ms), привязан к реальному времени.

### 3.2 Палитра (токены)
| Токен | HEX | Роль |
|---|---|---|
| Night | `#0A0B1F` | фон-основа |
| Indigo | `#1A1840` | поверхности/карточки |
| **Gold (grad)** | `#F5D98B→#CAA24A` | **сигнатура**: tideline, гребень, свет Весты, CTA (1–2 на экран) |
| Aqua | `#7FB7C4` | «вода» (низ tideline, отлив) |
| Parchment | `#EFE4C8` | подложка чтения/колеса |
| Dawn rose | `#F0A9A0` | вторичный акцент/статусы |
| Moon white | `#ECE9F5` | текст на тёмном |
| Dim | `#A9A6C4` | вторичный текст/мета |

### 3.3 Два инструмента (ядро системы)
- **The Tideline** — живая дневная кривая (тяга↔отлив), hairline-градиент aqua→gold, полупрозрачная «вода» под ней, дышащая точка «сейчас», метка «high tide». Это Today и все glanceable-поверхности.
- **The Chart (колесо)** — классическое натальное колесо: hairline-золото, гравюрные глифы планет, свечение на светилах, пергамент-подложка. Источник прилива; deep-view (You) и reveal. (Связка колесо⟷прилив — см. концепт §2.)

### 3.4 Vesta — «свет на воде»
Не лицо/не орб. Тёплый золотой свет-отражение: rest (дышит), speaking (собирается в строку Spectral), thinking (рябь), high-tide care (теплеет у гребня), greeting (вдох при входе). Характер — в голосе и motion воды.

### 3.5 Типографика
Spectral (голос Весты, бренд-моменты) / Onest (UI, body) / JetBrains Mono (мета: «TUE · HIGH TIDE 9P»). Слова Весты — всегда Spectral (узнаётся как её голос).

### 3.6 Motion + haptic язык
Всё «дышит» (медленно, тёпло, без bounce). Базовый transition 300–400ms ease. **Haptic-словарь прилива:** drag по линии = нарастающий «накат» (light→medium→light); выполнение якоря = success-накат; insight-кульминация = soft + золотая вспышка; high-tide-уведомление = двойной мягкий тап. Reduce Motion → статичная кривая/колесо, без потери функции.

### 3.7 Иконография
Hairline-небесные знаки (`currentColor`, гравюрные); глифы планет — астрономические, тонкие. Запрещено: зодиак-колёса-клише, неон, стоковый космос, реалистичные планеты, глянец.

---

## 3bis. Каталог сигнатурных дизайн-фич (что ОБЯЗАНО быть в UI)

Это «award-bait» — фичи, без которых дизайн остаётся средним. Каждая привязана к эмоции, метрике и ADA-критерию; для каждой задан Reduce-Motion фолбэк. Нумерация F1–F12 используется дальше в S0–S6 и в тасках.

| ID | Фича | Что это в UI | Эмоция/метрика | ADA-якорь | Reduce-Motion |
|---|---|---|---|---|---|
| **F1** | **The Tideline** | Живая кривая дня на Today: точка «сейчас» дышит и скользит, метка high tide, «вода» под линией | Ride · daily.opened/engaged | Tide Guide / Lumy | статичная кривая |
| **F2** | **Tide haptic** | Провёл по линии → тактильный «накат»; выполнил якорь → success-накат | Make-it-felt · value_felt | CapWords/Denim | без изменений (haptic не зависит от motion) |
| **F3** | **The Lighting** | Reveal: колесо вычерчивается из искры → разворачивается в твою первую tideline; Vesta называет приливную сигнатуру | Recognise · **recognition_yes** | Sky Guide/CapWords | сразу готовое колесо+линия, без typing |
| **F4** | **Wheel ⟷ Tide transition** | Тап по гребню → линия поднимается в колесо (почему: планета/дом светится); тап по планете → опускается в прилив (что сегодня) | Source-on-demand · доверие | CHANI-glow + интеракция | мгновенная смена вида, без анимации |
| **F5** | **Compose effect** | Каждый прожитый день добавляет слой к твоей линии; за триал она «композируется» в личный недельный ритм (видимый прогресс без счётчиков) | Ride · day3 completion, retention | Rytmos | слой появляется без анимации |
| **F6** | **Light-on-water Vesta** | Свет-отражение: rest/speaking/thinking/high-tide/greeting | присутствие · retention | Hearing Buddy (компаньон) | статичное свечение |
| **F7** | **Water-at-every-hour** | Среда экрана меняется утро→ночь, cross-fade температуры | ориентация+эмоция · D7 | — | мгновенная смена среды |
| **F8** | **Live Activity + Dynamic Island** | «Твой прилив сейчас»; мягко предупреждает о приближении high tide | live-beyond-app · retention | Tide Guide/Mela | статичный индикатор |
| **F9** | **Widgets + Apple Watch** | Lock/Home-виджет с сегодняшней линией; приливное кольцо-комлпликация + тап на запястье в high tide | live-beyond-app · D30 | Lumy/Tide Guide | статичные |
| **F10** | **Anchor card** | Одна 5-мин практика, всплывает в окно high tide; «оседлай волну» | Ride · day_done | Crouton (одно действие) | без изменений |
| **F11** | **Forgiving rhythm strip** | Лента «дней вместе»; пропуск = тёплая копи, без красного/наказания | Relieve · save-rate, retention | Gentler Streak | без изменений |
| **F12** | **Ask Vesta (light-on-water chat)** | Диалог с памятью: Vesta ссылается на твою карту и прошлые приливы; thinking = рябь | присутствие · dialog.message | Hearing Buddy | thinking → текст-индикатор |

---

## 4. UX по карте пути S0–S6 — с конкретными дизайн-фичами

Для каждого этапа: цель · эмоция · метрика · **дизайн-фичи в UI** (со ссылками на F1–F12) · экраны/состояния · UI-текст (EN). Носитель: S0–S5 reveal/paywall — web+app; S2 daily, S4–S6 — app.

### S0 — ACQUISITION (web-лендинг + store) · SC-0
- **Цель/эмоция/метрика:** довести до старта / любопытство без риска / `acquire.start_quiz`.
- **Дизайн-фичи:**
  - Hero с **живой tideline (F1)** и **светом Весты (F6)** на воде — анимированный, дышит; сразу показывает «идею прилива» до единого слова текста.
  - Среда — Dusk water **(F7)**; золотой горизонт.
  - Store-скриншоты #1–2 = момент Reveal (узнавание), не фичелист.
- **UI-текст:** H1 *“You're not broken — you're off your rhythm.”* · Sub *“See your inner tide — and learn to move with it. Start free.”* · CTA **`See my tide`**.
- **Recovery:** ушёл → ретаргет *“The tide is turning in your sign tonight.”*

### S1 — ACTIVATION (quiz → Lighting → reveal → recognition) · SC-1…SC-4 ★ метрика №1
- **Цель/эмоция/метрика:** заработать «это про меня» / **Recognise** / **`recognition_yes`**.
- **Дизайн-фичи:**
  - **The Lighting (F3):** после ввода данных — не спиннер, а: искра → **вычерчивается колесо (F4-источник)** → колесо **разворачивается в твою первую tideline (F1)**; Vesta «голосом» (Spectral, медленный набор) называет приливную сигнатуру. Заслуженное ожидание ≥6с.
  - **Recognition tap** после reveal-секций с **insight-flare + tide haptic (F2)**: каждое «Yes, that's me» = золотая вспышка + накат + свет Весты теплеет (накопительное доверие).
  - Reveal как **пергаментный скролл** (не слайдшоу): секции *Your tide · Why plans pulled you under · Your pattern · This week's water.* Золото — на одной ключевой строке секции.
- **Состояния:** time-unknown → solar-колесо (мягкая пометка); partial-reveal → показываем готовые секции, недостающие скрываем.
- **UI-текст:** Lighting *“Reading the shape of your tide…”* · Reveal eyebrow `WHAT YOUR CHART SHOWS` · Recognition *“Does this feel like you?”* → **`Yes, that's me`** / `Not quite` · invite **`Start my 3 days`**.
- **Recovery:** `recognition_no` → *“What didn't fit?”* (chips) → переякорить, не толкать на пейволл.

### S2 — FREE PATH (реальный продукт) · SC-6 · app, push-driven
- **Цель/эмоция/метрика:** прожить продукт, привычка / поддержка, «меня ведут» / `path.dayN_done`, `value_felt`.
- **Дизайн-фичи:**
  - **Today = Tideline (F1)** с окном **high tide**; в это окно всплывает **Anchor card (F10)** — одна 5-мин практика «оседлать волну».
  - **Compose effect (F5):** каждый завершённый день добавляет слой к линии — к концу пути видно «складывающийся» личный недельный ритм (прогресс без счётчиков).
  - **Вечерний чек** в среде Night water **(F7)**: «как прошёл прилив» — ощущения (Settled/Mixed/Hard), не числа.
  - **Forgiving rhythm strip (F11):** пропуск без наказания.
  - Мягкий «сев» к S3 в день 2.
- **UI-текст:** Morning *“The pull comes in around nine. Here's one small way to ride it.”* · Evening *“How did the tide feel today?”* (Settled / Mixed / Hard) · Day-2 *“Tomorrow's your last free day — I'll show you how we keep the rhythm.”*
- **Recovery:** не открыл день → push в голосе Весты *“High tide tonight — I saved one small thing for you.”* **(F8/F9)**

### S3 — CONVERSION (reverse-trial, на пике) · SC-5 · **Платёж #1**
- **Цель/эмоция/метрика:** конвертировать привычку / «не теряй свой ритм» / `trial_to_paid`.
- **Дизайн-фичи:**
  - Пейволл в среде Dusk water, сверху — **твоя composed-линия за 3–7 дней (F5)** как отражённая ценность («вот ритм, что ты уже сложила»).
  - Один герой-план (Companion year), **прозрачный reverse-trial**; loss-aversion = эмоция прилива, **без countdown/FOMO**.
  - Свет Весты **(F6)** теплеет на CTA.
- **UI-текст:** заголовок (Spectral) *“You've felt your own rhythm now. Want me to stay with the tide?”* · CTA **`Continue with Vesta`** · *“7 days free — I'll remind you before anything is charged.”* · objection-link `See other options` (Phase 2 — Rhythm-фолбэк).
- **Recovery:** не взял → win-back (S6), без агрессии.

### S4 — DAILY (двигатель удержания) · SC-7/SC-8 · app
- **Цель/эмоция/метрика:** ежедневная ощущаемость / близость / `daily.opened/engaged`, `dialog.message`, retention.
- **Дизайн-фичи:**
  - **Today = Tideline (F1)** + **Anchor (F10)** + **water-at-every-hour (F7)**.
  - **Ask Vesta (F12):** диалог-«свет на воде» с памятью; thinking = рябь; ссылается на карту и прошлые приливы.
  - **Wheel ⟷ Tide (F4):** из Today тап по гребню → колесо «почему»; из You — колесо как deep-view.
  - **Live beyond app (F8/F9):** Live Activity/Dynamic Island «прилив сейчас», Lock/Home-виджет, Apple Watch приливное кольцо + тап в high tide.
  - **Forgiving rhythm strip (F11).**
- **UI-текст:** Daily Moon push *“The Moon enters your sign — a day the pull runs strong. I'll check in with one small thing.”* · dialogue empty *“Ask me anything about you — your patterns, your day, your tide.”*
- **Recovery:** нет открытий 3 дня → re-engagement *“I've been holding something I noticed in your tide.”*

### S5 — EXPANSION (Lenses, Phase 2) · app
- **Цель/метрика:** множитель ARPU / `lens.attach`.
- **Дизайн-фичи:** новые линзы = «другие берега того же прилива» (Love/Money/Family/Body) — та же карта, другой tideline-разрез; всплывают контекстно по daily-теме, тёплым предложением (не апселл-крик).
- **UI-текст:** *“Your chart speaks about love too. Want to look at that tide together?”* → **`Open the Love tide`**.

### S6 — LIFECYCLE (мес 1–2+) · app
- **Цель/метрика:** удержать/вернуть без вины / renewal, save, win-back.
- **Дизайн-фичи:**
  - **Renewal value-reminder:** тёплое «вот ритм, что мы сложили вместе» (composed-линия за месяц), не «вас спишут».
  - **Save-flow (F11-логика):** «pause instead of cancel» / тёплая скидка — выбор, не ловушка.
  - **Win-back:** транзит-крючок *“A big high tide moves into your sign this month — come back?”*
- **UI-текст guardrail-clean**, тон наставницы.

---

## 5. Информационная архитектура и навигация

### 5.1 Tab bar (4 вкладки, HIG ≤5; дефолт — Today)
```
[ Today ]  дом · Tideline сегодня + Anchor (F1,F7,F10,F11)
[ Vesta ]  диалог «свет на воде» с памятью (F12)
[ Tide  ]  твой прилив во времени: неделя/большие транзиты, composed-линия (F5)
[ You   ]  Chart (колесо, F4-источник), профиль, подписка, a11y/уведомления
```
Tideline доступен везде glance-ом (виджет/Live Activity/Watch — F8/F9). «Tide» (неделя) и «You/Chart» (источник) — две глубины одного прилива.

### 5.2 Онбординг-флоу (web→app)
```
S0 Landing → S1 Quiz→birth → The Lighting (колесо→tideline, F3) → Reveal+Recognition★ → Paywall(F5)
  → deep-link в залогиненное app → S2 Day0 (сразу Today с Anchor, не пустой дом) → Day1→Day2(seed)→Day3 → S4 Daily
```
Web и app рендерят одни состояния S0–S3; handoff несёт chart + recognition + day_index (без повторного квиза).

### 5.3 Состояния каждого экрана (обязательны)
default · loading (нарративный: «Reading the shape of your tide…», не спиннер) · empty (приглашение к 1-му якорю) · error (мягко, retry, не теряя ввод) · offline (последняя линия дня из кэша) · success · **reduce-motion** (фолбэки F1–F12) · **large-type** (Dynamic Type AX2).

---

## 6. Activation- и conversion-механики + A/B

### 6.1 Где фичи двигают метрики
| Метрика (приоритет карты пути) | Дизайн-рычаг |
|---|---|
| 1. `recognition_yes` (S1) | F3 Lighting (колесо→tideline) + F2 haptic на «Yes, that's me» + точность приливной сигнатуры |
| 2. start→day3 (S2) | F1 Today + F10 Anchor (одно действие) + F5 compose (видимый прогресс) + F8 push-забота |
| 3. day3→subscribe (S3) | F5 composed-линия как отражённая ценность + эмоция «не теряй ритм» |
| 4. retention (S4/S6) | F1/F7 ежедневная смена прилива + F8/F9 live-beyond-app + F12 диалог + F11 прощение |
| — value_felt | F2 haptic + вечерний чек ощущений |

### 6.2 Приоритизированные A/B
| # | Гипотеза | A | B | Метрика | Prio |
|---|---|---|---|---|---|
| H1 | Lighting «колесо→tideline» vs только tideline | только линия | колесо→линия | recognition_yes | P0 |
| H2 | Длина reverse-trial | 7 дней | 14 дней | trial→paid, ARPU | P0 |
| H3 | Tide haptic на recognition | без haptic | с haptic | recognition_yes, value_felt | P1 |
| H4 | Compose-линия на пейволле | обычный пейволл | + твоя composed-линия | trial→paid | P0 |
| H5 | Water-at-every-hour (F7) | один режим | смена по времени | D7, daily.opened | P2 |
| H6 | Anchor в high-tide-окно vs утром фикс | утро | по high tide | day_done | P1 |

### 6.3 Anti-patterns (запрещены)
дженерик-гороскопы, вина/наказание-стрики, dark-pattern/countdown пейволл, холодный минимализм, слайдшоу-онбординг, стоковый космос, неон, зодиак-клише, капслок, health-claims.

---

## 7. Таски для CPO и CTO (дельта под Inner Tide)

Форма: что · зачем (метрика) · критерии приёмки · prio. (Полная дев-спека обновляется отдельно — [[2026-06-14_vesta-dev-requirements]].)

### 7.1 CPO
| ID | Что | Зачем | Критерии приёмки | Prio |
|---|---|---|---|---|
| P-1 | Контент приливной сигнатуры: как из карты выводится «форма прилива» (deep/early и т.п.) и формулируется языком воды | recognition_yes | 10+ карт прогнаны; проходят guardrail; «узнаю себя» на 5 тест-юзерах | P0 |
| P-2 | Логика high-tide-окна и Anchor-практик (детерминированно из транзитов) | day_done, value_felt | для дня определяется окно + 1 практика 5–10 мин; язык ощущений, не результата | P0 |
| P-3 | Маппинг wheel⟷tide: какая транзитная планета даёт сегодняшний гребень | F4, доверие | для дня есть «планета-источник» + человеческий перевод | P1 |
| P-4 | Контент-гайд «голос прилива» + ban-лист health-claims | позиционирование/App Review | словарь да/нет; 100% строк ревью; линт в CI | P0 |
| P-5 | Reveal-секции (4) + recognition-флоу | recognition_yes | тексты, порядок, partial-деградация | P0 |
| P-6 | Метрик-план событий S0–S6 | измеримость | event-spec для CTO | P0 |

### 7.2 CTO
| ID | Что | Зачем/риск | Критерии приёмки | Prio |
|---|---|---|---|---|
| T-1 | Дизайн-токены «water at every hour» (light+dark, среды, Dynamic Type) | консистентность, a11y | токен-файл, шрифты, 4 среды | P0 |
| T-2 | **Tideline-движок** (F1/F5): детерминированная кривая из транзитов, 0 LLM-токенов, compose-слои, offline | себестоимость, retention | кривая считается на устройстве/cron; работает офлайн; 60fps | P0 |
| T-3 | **Wheel-рендер** (F4): натальное колесо hairline, glow на транзитной планете, wheel⟷tide переход | доверие, F4 | 60fps; solar-фолбэк без домов; reduce-motion | P0 |
| T-4 | **Tide haptic-словарь** (F2): накат на drag/anchor/insight | сенсорная подпись | CHHapticEngine-паттерны; уважают системные настройки | P0 |
| T-5 | The Lighting (F3): искра→колесо→tideline + typing-голос | recognition_yes | ≥6с, 60fps, reduce-motion фолбэк | P0 |
| T-6 | Light-on-water Vesta (F6): 5 состояний | присутствие | worklets, 60fps, reduce-motion | P1 |
| T-7 | Live Activity + Dynamic Island + виджеты + Watch (F8/F9) | live-beyond-app, ADA | «прилив сейчас»/high-tide; виджет линии; Watch-кольцо | P1 |
| T-8 | Ask Vesta (F12) + soft token-cap | риск №1 юнит-экономики | память rolling+chart-summary; cap = «pick up tomorrow»; cost/юзер трекается | P0 |
| T-9 | Аналитика событий (P-6) + web→app handoff атрибуция | измеримость, UA-гейт | все события летят; источник переносится через handoff | P0 |
| T-10 | A11y-движок (F1–F12 фолбэки) | охват, ADA | VoiceOver/Dynamic Type AX2/контраст/Reduce Motion | P1 |

> **Критпуть полиша:** T-1 → T-2 (tideline) + T-3 (wheel) + T-5 (Lighting) → T-4 (haptic) → T-8 (dialogue). Эти 5 = ядро award-уровня.

---

## 8. A11y · HIG · ADA-чеклист

- **Контраст** AA в обеих средах (золото для body-текста запрещено — только акценты/крупное/нетекст).
- **Dynamic Type** до AX2 без обрезаний; цена/триал/anchor — всегда текстом.
- **VoiceOver:** tideline озвучивается осмысленно («Your tide: high around 9 pm»), колесо — планеты/дома как элементы, свет Весты — label по состоянию, decorative motion скрыт.
- **Reduce Motion:** фолбэки F1–F12 (см. §3bis); функция не теряется.
- **Touch ≥44pt; цвет не единственный сигнал; haptics дополняют, не заменяют.**
- **HIG:** tab bar ≤5 (дефолт Today), нативные жесты, safe-area/Dynamic Island, IAP-прозрачность, restore purchases, без dark patterns (3.1/2.3.1).
- **ADA-самопроверка по категориям:** Visuals (tideline+колесо, цельный водный мир) · Interaction (wheel⟷tide, drag-haptic) · Delight (Lighting, compose) · Inclusivity (a11y day-1) · Innovation (внутренний прилив из карты + Live Activity).
- **DoD на экран:** все состояния §5.3 · обе среды AA · Dynamic Type AX2 · VoiceOver · reduce-motion · 60fps на SC-3/4/7 · копи прошла guardrail-линт.

---

## 9. Что дальше
1. **Hi-fi сигнатурные экраны** (критпуть полиша): Lighting (колесо→tideline) → Today (tideline+anchor) → Chart (колесо) → Paywall (compose).
2. Обновить **дев-спеку** ([[2026-06-14_vesta-dev-requirements]]) под F1–F12: tideline-движок, wheel-рендер, haptic-словарь, Live Activity/widget/Watch контракты.
3. Отдать P-1/P-2/P-4/P-6 (CPO) и T-1 (токены) — разблокируют сборку.
4. После прототипа — операционный режим: аудит против этой спеки + a11y, A/B (§6.2).

---

*Дизайн-стратегия Vesta v2 (Inner Tide) на 2026-06-14. Заменяет v1. UI-тексты — EN, без health-claims; пояснения — RU. Scope Phase 1; путь к Phase 2/3 (Lenses, тир Rhythm, Health, Android) не закрыт.*
