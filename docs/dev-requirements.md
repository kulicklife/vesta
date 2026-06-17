# Vesta — Developer Requirements (Engineering-Ready Design Spec, Phase 1)

**Дата:** 2026-06-14
**Автор:** Head of Design
**Назначение:** «engineering-ready» слой между PRD и Design Handoff — то, что разработчику нужно, чтобы собрать Phase 1 точно и проверяемо. **Не дублирует** PRD (что строим) и Handoff (как выглядит экран); добавляет: component library в код-терминах, motion-токены, data-контракты экран↔бэкенд, контракт web→app handoff, сводную матрицу состояний, firing-rules аналитики, измеримые a11y/перф-критерии, push- и cost-control-спеки, DoD/QA.
**Связь:** PRD Phase 1 ([[2026-06-14_vesta-prd-phase1]]) · Design Handoff ([[2026-06-14_vesta-design-handoff]]) · бренд-бук ([[2026-06-13_vesta-brand-book]]) · дизайн-стратегия ([[2026-06-14_vesta-design-strategy]]).

> **Scope-якорь (из PRD Phase 1).** Один платный тир **Vesta Companion**, **reverse-trial 7 дней** (A/B 7 vs 14), Год $54.99 default / Месяц $14.99 / Квартал $29.99 (decoy). **Вне scope Phase 1:** двойной тир Rhythm, Lenses, Apple Health, Android, save-flow/win-back. Экраны SC-0…SC-9. Эти требования покрывают только Phase 1, но проектируются так, чтобы не закрыть путь Phase 2/3.

> **Гардрейл (обязателен в коде).** Нет health-claims ни на одном языке: вес/кг, lose weight, diet, BMI, диагноз, doctor, willpower, «-5 lbs», обещание результата к сроку. Лексикон: rhythm, your nature, gently, notice, peace with food, today. Контент-линт (§12.3) — в CI.

---

## 1. Платформа и базовые допущения

| Параметр | Требование |
|---|---|
| Носитель | Expo (managed) / React Native, **iOS-first**. Min iOS 16. Базовый фрейм 375×812, safe-area aware, Dynamic Island-aware. |
| Web (верх воронки) | SC-0…SC-5 рендерятся в web (адаптивно от 360px). Тот же дизайн-токен-слой, тот же контент-контракт. |
| Тема Phase 1 | Преимущественно **Candlelight** (`night`/`indigo`); **Parchment** — поверхность Reveal-карточек (SC-4). Полный dual-luminance (утро/вечер) — Phase 2, токены закладываем сразу (§2.1). |
| Шрифты | Spectral (display), Onest (ui; Inter — фолбэк), JetBrains Mono (meta). Подключить через expo-font, варианты под Dynamic Type. |
| Состояние/данные | Локальный стор (Zustand или аналог) + персист прогресса онбординга/триала для resume и offline (PRD FR-1, FR-5). |

---

## 2. Component Library (design system как код)

Цель: переиспользуемые токены и компоненты, чтобы экраны собирались из них, а QA/a11y проверялись один раз на компонент.

### 2.1 Токены как код (`tokens.ts`)

```
color: {
  night:'#0A0B1F', indigo:'#1A1840', ink:'#26233A',
  gold:{from:'#F5D98B', to:'#CAA24A'}, parchment:'#EFE4C8',
  dawnRose:'#F0A9A0', moonWhite:'#ECE9F5', dim:'#A9A6C4'
}
space:  {xs:4, sm:8, md:12, lg:16, xl:24, xxl:32}     // 4-pt сетка
radius: {card:22, pill:999, input:14}
glow:   {soft:'0 0 24px rgba(245,217,139,.25)', flare:'0 0 40px rgba(245,217,139,.45)'}
```

- **Правило золота — в коде:** компонент `GoldAccent` — единственный носитель `color.gold`; линт запрещает прямое использование gold вне него. Цель: ≤2 золотых акцента на экран.
- **Семантические алиасы** (под будущий dual-luminance): `surface.bg`, `surface.card`, `text.primary`, `text.secondary`, `accent` — экраны используют алиасы, не сырые цвета. В Phase 1 алиасы маппятся на Candlelight; Phase 2 добавляет Daylight без переписывания экранов.

### 2.2 Типографическая шкала (`type.ts`)

| Стиль | Шрифт | Size/LH (pt) | Применение |
|---|---|---|---|
| `display-xl` | Spectral | 32/40 | Lighting/Reveal hero, имя |
| `display-l` | Spectral | 26/34 | Paywall/секц. заголовки |
| `vesta-body` | Spectral | 18/28 | реплики Vesta (узнаётся как «её голос») |
| `title` | Onest 600 | 20/26 | рабочие заголовки |
| `body` | Onest 400 | 16/24 | основной текст UI |
| `meta` | JetBrains Mono | 12/16, caps, +.08em | eyebrow, даты, бейджи |

Все стили масштабируются Dynamic Type до AX2 без обрезаний (§8).

### 2.3 Инвентарь компонентов (Phase 1)

Каждый компонент: пропсы → варианты → состояния → AC. Состояния обязательны к реализации.

| Компонент | Варианты | Состояния | AC (приёмка) |
|---|---|---|---|
| `PrimaryCTA` (gold) | full / inline | default · pressed · loading · disabled | ≥44pt; haptic `medium` на tap; loading = inline-спиннер + текст, не блокирует двойным тапом; disabled — контраст AA сохранён |
| `SecondaryButton` | text / outline | default · pressed · disabled | ≥44pt; не выглядит как primary (золота нет) |
| `PlanCard` | year / month / quarter | selected · unselected | selected = золотая рамка + бейдж + a11y `selected`; цена и условия — **текстом**, не только бейджем |
| `RevealSection` | — | hidden · entering · shown · truncated(read-more) | parchment-карточка; fade-up 400ms; заголовок = VoiceOver header; AA-контраст ink/parchment |
| `ChartWheel` | full / compact / solar(no-houses) | drawing · ready · static(reduce-motion) | hairline gold + glow на светилах; solar помечается мягко; ≤16ms/кадр при отрисовке |
| `VestaOrb` | rest / thinking / speaking / peak / greeting | + reduce-motion(static glow) | breathing ≤3% амплитуда, 4–6s; a11y-label по состоянию («Vesta is thinking»); 60fps |
| `MessageBubble` | vesta / user | default · streaming · capped | vesta = `vesta-body` на indigo + искра-кант; streaming доступен VoiceOver по завершении |
| `SkyCard` (Today) | — | loading(skeleton) · ready · offline(last-cache) | градиент по транзиту детерминированно; skeleton, не спиннер |
| `PracticeCard` | — | collapsed · expanded · done | done → `daily.engaged` + haptic `success`; без «failed»-стейта |
| `RhythmStrip` (стрики) | — | active · missed | missed = тёплая копи, **без красного/наказания** |
| `BirthInput` | date / time / city | valid · invalid · time-unknown | date = iOS-style wheel; «I don't know» (time) → solar; city autocomplete + manual lat/long фолбэк |
| `ToastInline` | info / error | — | error = мягкий тон + retry; не теряет ввод/выбор |
| `Skeleton` | card / wheel / line | — | используется вместо голого спиннера на бренд-экранах |

---

## 3. Motion-система (как токены)

Motion — носитель «живого присутствия» и снятия напряжения. Реализуется через `reanimated`; параметры — токены, не магические числа.

### 3.1 Motion-токены (`motion.ts`)

```
duration: {micro:120, base:350, reveal:400, lighting:600, lightingWheel:4500, typing:2500}
easing:   {standard: ease-in-out, enter: ease-out, exit: ease-in}
spring:   {soft:{damping:18, stiffness:120}}   // для reveal/cascade
breathing:{cycle:5000, amp:0.03}                // VestaOrb rest
```

### 3.2 Карта анимаций → реализация

| Анимация | Где (SC) | Токены | Haptic | Примечание |
|---|---|---|---|---|
| Dim-to-dusk фон | SC-3 | `lighting` / `enter` | — | виньетка теплеет |
| Spark pulse | SC-3 | `base`×2 / `standard` | — | рост свечения |
| Wheel draw | SC-3 | `lightingWheel` / `standard` | — | по сегментам |
| Planet set | SC-3 | `micro` each / `enter` | `light` на каждую | стаггер |
| Vesta typing | SC-3 | `typing` / linear | — | имя+фраза |
| Section fade-up | SC-4 | `reveal` / `enter` + `spring.soft` | — | при входе во вьюпорт |
| Orb breathing | SC-7/8 | `breathing` | — | непрерывно в rest |
| Orb thinking | SC-8 | pulse 0.8–1.2Hz | — | замена спиннера |
| Insight flare | SC-3/4/7 | `base` / `standard` | `soft` | золотая вспышка на кульминации |
| CTA press | все | `micro` | `medium` | |
| Practice done | SC-7 | `base` | `success` | |

### 3.3 Reduce-Motion маппинг (обязателен)

| Анимация | При Reduce Motion |
|---|---|
| Lighting (вся) | сразу статичное готовое колесо + текст без typing; **минимум 6с НЕ держим** (ожидание оправдано только анимацией) → переход по готовности данных |
| Section fade-up | мгновенное появление (opacity без translate) |
| Orb breathing/thinking | статичное свечение; thinking → текст-индикатор «Vesta is thinking» |
| Flare/cascade | cross-fade без движения |

### 3.4 FPS-бюджет

Все анимации **60fps на iPhone 12 и новее**; деградация без джанка на 11/SE2. Wheel draw и Orb — на UI-потоке (reanimated worklets), без JS-bridge на кадр. Профайл обязателен (§9).

---

## 4. Data-контракты: что каждый экран ждёт от бэкенда

Дизайн-слой задаёт **форму данных**, нужную для верной отрисовки. Точные эндпоинты — за CTO (PRD FR-10, `/api/v1/app`), но контракт ниже фиксирует поля, от которых зависят экраны и их состояния.

### 4.1 Chart (SC-3/4)

```
POST /chart  { birth: {date, time|null, lat, lng, tz} }
→ { chart_id, has_time:bool, wheel:{ planets:[{body,sign,house|null,deg}], aspects:[...] },
    name }
```
- `has_time=false` → `ChartWheel variant=solar` (без домов). Экран не должен падать на `house:null`.

### 4.2 Reveal-нарратив (SC-4) — **критично для `recognition_yes`**

```
GET /reveal/{chart_id}
→ { status:'partial'|'ready',
    sections:[ { key:'rhythm'|'why_plans'|'pattern'|'week_tide',
                 title, body, key_line } ] }
```
- **Деградация:** `status:'partial'` → рендерим только пришедшие секции, отсутствующие **скрываем** (не плейсхолдеры). Порядок секций фиксирован (rhythm → why_plans → pattern → week_tide).
- `key_line` — единственная строка секции, на которую вешается золото.
- Контент уже прошёл guardrail на бэкенде; фронт дополнительно линтит в dev (§12.3).

### 4.3 Daily-план и практика (SC-6/7) — генерится 1× при старте триала, доставка по cron (~0 токенов)

```
GET /plan/{user_id}/today
→ { day_index, sky:{ moon_phase, gradient_key, line },
    practice:{ id, title, body, est_minutes:5..10 },
    evening_check:{ options:['settled','mixed','hard'] } }
```
- `gradient_key` → пресет градиента SkyCard (детерминированно от транзита, не свободный цвет).
- Поля `est_minutes`, `evening_check.options` — **ощущения, не числа результата** (гардрейл).

### 4.4 Ask Vesta (SC-8)

```
POST /vesta/message  { user_id, text }
→ stream: tokens... ; meta:{ tokens, cost_usd, capped:bool }
```
- `capped:true` → UI показывает мягкое «Let's pick this up tomorrow» (НЕ ошибка/пейволл-стена).
- Память: бэкенд хранит rolling-window + chart-summary; фронт ничего не реконструирует.

### 4.5 Forecast (SC-7 вход, P1) и Subscription/Trial (SC-5/9)

```
GET /forecast/{user_id}/week → { tide_line, days:[...] }     // детерминированно
GET /subscription/{user_id}  → { state:'trial'|'active'|'expired',
                                  trial_ends_at, plan, charge_at }
```
- SC-9 (charge reminder) и Today-деградация при `expired` управляются `subscription.state`.

> **Требование к контракту:** каждый GET имеет явные `loading`/`error`/`partial` ветки на фронте (см. §6). Ни один экран не зависит от поля, которое может прийти `null`, без определённого фолбэка.

---

## 5. Web→App handoff и deep-link (PRD FR-4, FR-9)

Оплата и большая часть онбординга — на web (Paddle, MoR, без 30% Apple). После старта триала юзер должен попасть в **уже залогиненное** приложение без повторного ввода.

### 5.1 Контракт handoff

| Шаг | Требование |
|---|---|
| Идентичность | web создаёт `user_id` на квизе; анонимный → связывается при старте триала |
| Deep-link | universal link `https://<domain>/app?ho={handoff_token}` + fallback в App Store, затем deferred deep-link на первый запуск |
| Handoff token | одноразовый, TTL ≤ 15 мин, обменивается в app на сессию; НЕ передавать платёжные данные в линке |
| Перенос состояния | app по `user_id` подтягивает: chart, recognition-результат, trial-state, day_index — юзер продолжает с того же места (PRD: «не вводить заново») |
| Атрибуция | web-purchase сшивается с app-инсталлом (AppsFlyer/Adjust + SKAN); `source/campaign/creative` переносятся на `trial_start`/`trial_to_paid` |

### 5.2 AC

- Given оплата на web прошла, When юзер открывает app по deep-link, Then он залогинен, видит свой day_index, повторного квиза нет.
- Given app не установлен, When тап по deep-link, Then App Store → после установки deferred deep-link логинит и переносит состояние.
- Given handoff token истёк/использован, Then мягкий экран входа (email/код), не тупик.

---

## 6. Сводная матрица состояний (обязательна к реализации)

Каждый экран реализует применимые состояния. «—» = неприменимо.

| SC | default | loading | empty | error | offline | success | reduce-motion | large-type |
|---|---|---|---|---|---|---|---|---|
| SC-1 Quiz | ✓ | — | — | валидация | resume из кэша | → SC-2 | ✓ | ✓ |
| SC-2 Birth | ✓ | autocomplete | — | invalid/ city-not-found→manual | resume | → SC-3 | ✓ | ✓ |
| SC-3 Lighting | ✓ | «still drawing…» (не спиннер) | — | мягкий retry | — | → SC-4 | static wheel | ✓ |
| SC-4 Reveal | ✓ | skeleton секций | partial→скрыть | retry, не теряя скролл | кэш reveal | recognition→SC-5 | instant sections | ✓ |
| SC-5 Paywall | ✓ | «Setting up…» CTA | — | retry, сохранить выбор плана | — | trial→deep-link | ✓ | цена/триал текстом |
| SC-6 Trial onb. | ✓ | skeleton | подсказка к 1-й практике | retry | кэш дня | day_done | ✓ | ✓ |
| SC-7 Today | ✓ | SkyCard skeleton | first-run онбординг | retry | last-cache дня | engaged | ✓ | ✓ |
| SC-8 Ask Vesta | ✓ | typing/orb-pulse | примеры вопросов | retry, не теряя ввод | «offline» баннер | — | static orb | ✓ |
| SC-9 Charge | ✓ | — | — | — | — | trial_to_paid | ✓ | anchor текстом |

**Глобальные правила состояний (из Handoff §4):** loading на бренд-экранах = скелет/искра, не голый спиннер; error = мягкий тон + retry без потери ввода; offline = последний кэш. Анти-паттерны (запрещены): дженерик-гороскопы, вина/наказание, dark-pattern пейволл, countdown-FOMO, холодный минимализм, слайдшоу-онбординг, стоковый космос, неон, зодиак-клише, капслок.

---

## 7. Аналитика — firing-rules (реализация PRD §7 + FR-9)

Таксономия событий — в PRD §7. Здесь — **правила срабатывания и обязательные свойства**, чтобы воронка считалась без дыр (без этого UA-гейт не открывается).

### 7.1 Идентичность и общие свойства

- `anon_id` создаётся на первом web-вью; `user_id` появляется на `quiz.complete`; при старте app — мерж anon→user (один профиль через web→app, иначе воронка рвётся на handoff).
- **Каждое** событие несёт: `anon_id`/`user_id`, `platform` (web/ios), `app_version`, `source`/`campaign`/`creative` (перенос с S0), `ts`.
- Стек: Amplitude (или PostHog) + AppsFlyer/Adjust + SKAN. Web-purchase сшивается с app-инсталлом (§5.1).

### 7.2 Когда и с чем срабатывает (ключевые)

| Событие | Триггер (точно) | Обязательные свойства |
|---|---|---|
| `acquire.start_quiz` | первый ответ в SC-1 | source, campaign, creative |
| `quiz.complete` | сабмит SC-2 | `has_birth_time`, `goal` |
| `chart.lit` | конец Lighting (готов SC-4) | `render_ms` |
| `recognition_yes` / `_no` | tap в SC-4 | `_no`: `reason` |
| `paywall.view` | показ SC-5 | `variant`, `trial_len_days` |
| `trial_start` | подтверждение в Paddle/RC | `plan_default`(year), `trial_len_days` |
| `path.dayN_done` | выполнение практики SC-6/7 | `day_index` |
| `path.value_felt` | сабмит вечернего чека | `feeling` (settled/mixed/hard) |
| `dialog.message` | каждый ответ Vesta | `tokens`, `cost_usd`, `capped` |
| `trial_to_paid` | успешное списание | `plan`, `price` |
| `daily.opened`/`engaged` | открытие Today / выполнение | `streak_day` |
| `churn.canceled` | отмена | `reason` (если есть) |

### 7.3 AC аналитики

- 100% событий §7.2 летят в dev/stage с корректной идентичностью (QA-чеклист до релиза).
- Дедуп: повторный показ экрана не дублирует `*.view` в одной сессии (idempotency key = screen+session).
- Атрибуция: `trial_start` и `trial_to_paid` несут источник из S0 даже после web→app handoff.

---

## 8. Accessibility — измеримые AC (WCAG 2.1 AA + Apple)

| Область | Требование (проверяемое) |
|---|---|
| Контраст | body-текст ≥ 4.5:1, крупный ≥ 3:1 — **на night и на parchment**. Золото для body-текста запрещено (только акценты/крупное/нетекст). |
| Dynamic Type | все экраны до **AX2** без обрезаний/наложений; PlanCard, цена и условия триала, anchor — всегда видимы текстом. |
| VoiceOver | Reveal-секции = headings; SkyCard/практика озвучиваются осмысленно; VestaOrb имеет label по состоянию; декоративный motion `accessibilityElementsHidden`; стриминг-ответ Vesta доступен по завершении. |
| Reduce Motion | маппинг §3.3 реализован; ни одна функция не теряется при выключенном motion. |
| Touch targets | ≥ 44×44pt все интерактивные (CTA, планы, ввод, иконки-входы). |
| Цвет не единственный сигнал | статусы/выбор дублируются иконкой/текстом (Dawn rose, золотая рамка плана — не единственный носитель смысла). |
| Haptics | дополняют, не заменяют; уважают системные настройки. |
| Focus order | логичный сверху-вниз; модалки/sheets возвращают фокус. |

AC: экран не считается готовым без прохождения этого списка на VoiceOver-аудите + Dynamic Type AX2 + контраст-чек в обоих фонах.

---

## 9. Performance-бюджеты

| Метрика | Бюджет | Проверка |
|---|---|---|
| Cold start (app) | < 2.0 s до интерактивного Today | профайл на iPhone 11/SE2 |
| Кадр анимаций | ≤ 16 ms (60fps) на iPhone 12+; без джанка на 11/SE2 | reanimated worklets, без JS-bridge на кадр |
| Lighting wheel | плавная отрисовка 4–5s без дропов | профайл |
| Reveal scroll | 60fps при fade-up секций | — |
| TTI квиза (web) | < 2.5 s на 4G | Lighthouse |
| Bundle (app) | разумный (трекать рост; шрифты/ассеты — субсет) | CI size-check |
| Ask Vesta first-token | < 2.5 s (стриминг скрывает остальное) | — |

Перф-бюджеты — в CI там, где возможно (bundle, web TTI); ручной профайл анимаций — в DoD сигнатурных экранов (SC-3/4/7/8).

---

## 10. Push-notifications — спека (FR-5, FR-7, FR-8)

| Push | Триггер | Тайминг | Копи (EN, голос Vesta) |
|---|---|---|---|
| Daily practice | план дня готов | утро (локальное, настраиваемо) | *"Today's small step is ready — no pressure, just a moment for you."* |
| Evening check | практика дня | вечер | *"How did today feel? I'm here whenever you're ready."* |
| Re-engagement | нет открытий 1–2 дня | мягко, ≤1/день | *"Vesta is waiting for you on Day {n}."* |
| Charge reminder | trial_ends − 24h | −24ч | *"Your free days are almost up — I'll be here if you'd like to keep going."* |
| Weekly forecast (P1) | воскресенье | утро вск | *"Your week's tide is in. Shall we look together?"* |

**Требования:** permission-priming **экран до** системного промпта (объяснить ценность, не спрашивать на холодную); rich push (заголовок Vesta-голосом); deep-link в нужный экран (практика/чек/forecast); частота капится (≤1/день re-engagement), без guilt и без «🔥/open the app». Все строки — через guardrail-линт.

---

## 11. Ask Vesta — cost-control (FR-6, риск №1 юнит-экономики)

Диалог — единственный recurring токен-расход. Требования к стоимости и деградации:

| Требование | Спека |
|---|---|
| Контекст | rolling-window последних сообщений + компактное chart-summary (не весь разбор); prompt caching на summary. |
| Модель | Haiku-tier по умолчанию; эскалация на Sonnet только по необходимости (бэкенд-решение), фронт agnostic. |
| Дневной лимит/юзер | конфигурируемый; стартовая калибровка ~**$1/активного юзера/мес** (Open Q #5 PRD). Бэкенд возвращает `capped:true`. |
| Деградация (UX) | при `capped` — мягкое *"Let's pick this up tomorrow."*; история и ввод сохраняются; **не** ошибка, **не** пейволл-стена, **не** upsell в Phase 1. |
| Телеметрия | `dialog.message` несёт `tokens`, `cost_usd`, `capped`; дешборд cost/payer (опережающий индикатор маржи). |
| Абьюз | rate-limit на сообщения/мин; защита от prompt-flood. |

---

## 12. Definition of Done и QA

### 12.1 DoD на экран

Экран готов, когда выполнено всё:

- Все применимые состояния из матрицы §6 реализованы (включая loading/error/empty/offline).
- Оба применимых фона по контрасту AA; Dynamic Type AX2; VoiceOver-проход; Reduce-Motion-маппинг.
- Motion по токенам §3; ручной 60fps-профайл для SC-3/4/7/8.
- Все события §7 для экрана летят с корректными свойствами.
- Копи прошла guardrail-линт §12.3.
- Собирается из компонентов §2 (нет «одноразовых» инлайн-стилей цвета/золота).

### 12.2 QA-матрица (минимум устройств)

iPhone SE2 (маленький, старый), iPhone 12 (база 60fps), iPhone 15 Pro (Dynamic Island), iOS 16 и текущая; web — Safari iOS + Chrome Android (адаптив верха воронки).

### 12.3 Content-guardrail линт (CI)

Регекс-линт по всем UI-строкам и push-копи (EN + любой будущий язык): блок-лист `weight|kg|lose weight|diet|BMI|diagnos|doctor|willpower|-\d+\s?(lbs|kg)|result in \d+ (days|weeks)`. Срабатывание = fail сборки. Список синхронизирован с PRD-гардрейлом и health-claims review (Open Q #4).

---

## 13. Открытые тех-вопросы (для CTO; привязка к PRD §9)

| # | Вопрос | Влияние на дизайн/разработку | Тег |
|---|---|---|---|
| 1 | Платёжная юрформа (Кипр) до recurring-rail | блокирует FR-4/SC-5 боевую оплату; до решения — Paddle/individual-мост | [Сергей/легал, БЛОКЕР] |
| 2 | Длина триала default 7 vs 14 | A/B №1; `trial_len_days` уже параметризован — нужен дефолт | [Сергей/data] |
| 3 | Health-claims review копи + Privacy/GDPR/субпроцессоры (Anthropic) | блок до сабмита; влияет на §12.3 и store-листинг | [легал, БЛОКЕР] |
| 4 | Дневной токен-бюджет Ask Vesta (стартовый лимит) | §11; калибровка ~$1/юзер/мес | [eng] |
| 5 | Порог fallback Lighting (N сек до «still drawing…») | §3/§6 SC-3; нужно число | [eng/design] |
| 6 | `gradient_key`-пресеты SkyCard: сколько и маппинг транзит→градиент | §4.3; дизайну нужен конечный набор пресетов | [design/eng] |
| 7 | Точные эндпоинты `/api/v1/app` под контракты §4 | финализировать сигнатуры | [eng] |

---

## 14. Что отдать первым (разблокировка разработки)

Соответствует dev-тикетам PRD §11 (T1–T9):

1. **§2 токены + component library** → разблокирует все экраны (под T1).
2. **§4.2 reveal-контракт + §4.1 chart** → SC-3/SC-4, метрика №1 (T3, T4, T6).
3. **§5 handoff-контракт** → SC-5 оплата и вход (T5).
4. **§7 firing-rules + §12.3 линт** → аналитика и гардрейл с первого экрана (T8).
5. Закрыть тех-вопросы §13 #2, #4, #5, #6 (нужны числа/дефолты дизайну и бэкенду).

---

*Engineering-ready дизайн-спека Vesta Phase 1 на 2026-06-14. Расширяет PRD Phase 1 и Design Handoff, не дублируя их. UI-тексты — EN, без health-claims; пояснения — RU. Scope строго Phase 1 (1 тир Companion, reverse-trial), путь к Phase 2/3 не закрыт.*

---

# ADDENDUM A — Inner Tide: инженерная спека сигнатурных фич F1–F12

**Добавлено:** 2026-06-14. **Основано на:** дизайн-стратегии v2 ([[2026-06-14_vesta-design-strategy-inner-tide]]) и концепте Inner Tide. Заменяет «orb»-предположения прежней спеки на приливную модель. Компоненты `VestaOrb`/`ChartWheel` из §2.3 переопределяются ниже как `VestaLight` и `TideChart`+`Tideline`.

## A.0 Новые токены (дополняют §2.1)
```
color.aqua = '#7FB7C4'
env: { dawn, day, parchment, dusk(default), night }   // 5 сред «вода по времени» (F7)
motion.tide: { drawWheel:2200, unfurlTide:1400, breatheNow:3000, driftWater:8000, crossEnv:700 }
haptic.tide: { swell, anchorDone, insightPeak, highTideAlert }  // паттерны CHHapticEngine (см. A.F2)
gradient.tide = aqua→gold→gold2 (stroke) ; gradient.tideArea = gold .30 → aqua .03 (fill)
```

## A.1 Спека по фичам

### F1 · Tideline (`<Tideline>`)
- **Что:** дневная кривая тяги. Рендер: SVG/Canvas path (smooth Catmull-Rom по точкам), gradient stroke + area fill + glow; точка «now» с пульсирующим halo; ось часов; метка high-tide.
- **Данные:** `GET /tide/{user}/today → { points:[{hour,value 0..1}], now_hour, high_tide_hour, env }` (детерминированно из транзитов, **0 LLM-токенов**, кэш+offline).
- **Анимация:** `driftWater` дрейф группы; `breatheNow` halo точки. 60fps (worklet).
- **Haptic:** drag по линии → `swell` (см. F2).
- **Reduce-motion:** статичная кривая, без drift/breathe.
- **AC:** работает офлайн из кэша дня; VoiceOver читает «Your tide: high around 9 pm, calm now»; 60fps на iPhone 12.

### F2 · Tide haptic
- **Паттерны (CHHapticEngine):** `swell` = ramp intensity .2→.8→.2 за ~500ms вдоль drag; `anchorDone` = success-накат (два мягких + хвост); `insightPeak` = single soft + sharpness↑; `highTideAlert` = двойной мягкий тап (для push/Watch).
- **AC:** уважает Settings → Haptics/System; не блокирует UI; деградирует тихо на устройствах без Taptic.

### F3 · The Lighting (`<LightingSequence>`)
- **Состав:** spark → **draw wheel** (`drawWheel`, stroke-dashoffset по сегментам) → **unfurl tideline** (`unfurlTide`) → планеты fade-in → Vesta typing (Spectral). ≥6с даже если данные готовы раньше.
- **Данные:** ждёт `chart` + `reveal.signature_line`. Fallback >N сек: мягкое «still drawing your chart…» (N — open Q).
- **Reduce-motion:** сразу готовое колесо+линия+текст, без typing; держать ≥6с НЕ нужно.
- **AC:** 60fps; haptic `insightPeak` в момент появления линии; авто-переход в Reveal.

### F4 · Wheel ⟷ Tide (`<TideChart>`)
- **Что:** натальное колесо (12 домов, знаки, аспекты, планеты hairline) + переход к Tideline.
- **Интеракция:** tap планеты → подсветка + Vesta-строка «почему» + соответствующий гребень на мини-tideline; tap гребня → подъём в колесо (подсветка планеты-источника).
- **Данные:** `chart.wheel` (§4.1) + `GET /tide/source/{user}/today → { planet, house, line }`.
- **Reduce-motion:** мгновенная смена подсветки, без морфинга.
- **AC:** solar-фолбэк (no houses) не ломает; каждая планета — VoiceOver-элемент; 60fps.

### F5 · Compose effect
- **Что:** каждый завершённый день добавляет полупрозрачный слой к линии; за триал — «композированная» недельная линия. Используется на Today (история) и Paywall (отражённая ценность).
- **Данные:** `GET /tide/{user}/composed → { layers:[path-points per day] }`.
- **Reduce-motion:** слой появляется без анимации.
- **AC:** ≤7 слоёв читаемы; не превращается в «счётчик/score».

### F6 · VestaLight (`<VestaLight>`) — заменяет VestaOrb
- **Состояния:** rest/speaking/thinking/highTideCare/greeting (свет-отражение на воде, не лицо).
- **Reduce-motion:** статичное свечение; thinking → текст «Vesta is thinking».
- **AC:** a11y-label по состоянию; 60fps; переиспользуется в reveal/today/dialogue/widget.

### F7 · Water-at-every-hour
- **Что:** среда экрана (`env`) по локальному времени: dawn/day/dusk/night; `crossEnv` cross-fade температуры.
- **AC:** среда выбирается из `tide.env` или локального времени; контраст AA в каждой среде; reduce-motion → мгновенная смена.

### F8 · Live Activity + Dynamic Island
- **Что:** «прилив сейчас» + до high tide; островок-компакт = иконка прилива + время high tide.
- **Данные:** ActivityKit, обновление по расписанию (как Tide Guide), без открытия app.
- **AC:** старт по расписанию/в high-tide-окно; deep-link в Today; энергобюджет ок.

### F9 · Widgets + Apple Watch
- **Widgets:** Lock/Home — сегодняшняя tideline + next high tide (WidgetKit, timeline provider).
- **Watch:** приливное кольцо-комлпликация + haptic `highTideAlert` на запястье.
- **AC:** офлайн-плейсхолдер (не пустой); комлпликация не «пропадает» (урок из ревью Tide Guide); reduce-motion статичен.

### F10 · Anchor card (`<AnchorCard>`)
- **Что:** одна практика 5–10 мин; всплывает в high-tide-окно; collapsed/expanded/done.
- **Данные:** `plan.today.practice` (§4.3). Done → `daily.engaged` + haptic `anchorDone`.
- **AC:** нет «failed»-состояния; язык ощущений, не результата.

### F11 · Forgiving rhythm strip
- **Что:** «days together» точками; пропуск = тёплая копи, без красного/«streak lost».
- **AC:** пропуск не уменьшает ничего видимо «в минус»; тон Gentler Streak.

### F12 · Ask Vesta (`<TideChat>`) — переопределяет dialogue
- **Что:** чат «свет на воде»; thinking = рябь; Vesta ссылается на карту/прошлые приливы; soft token-cap.
- **Данные:** `POST /vesta/message` (§4.4) + `capped` → «Let's pick this up tomorrow».
- **AC:** стриминг доступен VoiceOver по завершении; cost/юзер трекается (`dialog.message`).

## A.2 Влияние на §6 (матрица состояний) и §8 (a11y)
Каждая F-фича добавляет свой `reduce-motion`-вариант в DoD (§12.1). Tideline, TideChart и VestaLight обязаны иметь VoiceOver-озвучку смысла (не только декор). Перф-бюджет §9 распространяется на draw-анимации Lighting/Wheel (60fps, worklets, без JS-bridge на кадр).

## A.3 Дельта дев-тикетов (дополняет §11 / стратегию §7.2)
`T-2 Tideline-движок` · `T-3 Wheel-рендер+переход` · `T-4 Tide haptic-словарь` · `T-5 Lighting` · `T-6 VestaLight` · `T-7 LiveActivity/Widget/Watch` — все P0/P1 как в стратегии v2 §7.2. Контракты `/tide/*` (today/source/composed) добавить к §4.

*Addendum A — Inner Tide. UI-тексты EN без health-claims; пояснения RU.*
