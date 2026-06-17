# Vesta — Reveal Content Pack v1 (готовые строки для движка)

**Дата:** 2026-06-14
**Автор:** CPO
**Для:** CTO (детерминированная сборка reveal без LLM) + Head of Design (тексты в экраны) + контент-QA
**База:** P-1/P-5 (inbox/2026-06-14_vesta-tide-signature-and-reveal-content.md), нарративный путь Inner Tide
**Что это:** полный конечный набор строк. Движок собирает R1–R4 + recognition по ключам из карты. **0 токенов** (LLM-полиш R2/R3 — опционально, только после `trial_start`).

> **Гардрейлы.** EN, голос Весты (Spectral), низко/тепло. Ban-лист (CI-линт, любой язык): weight·kg·lbs·diet·calorie·lose·BMI·doctor·willpower·fix yourself·результат-к-сроку. Каждый эзо-термин — с человеческим переводом в той же фразе. Все строки финально прогнать линтом (P-4).

---

## 0. Контракт переменных (вход → ключи)

CTO подаёт в движок:
```
name            : string
moon_sign       : enum(aries…pisces)        // знак Луны
moon_element     = f(moon_sign)   → water|fire|earth|air
moon_modality    = f(moon_sign)   → cardinal|fixed|mutable
timing_band      : enum(early|midday|evening|late|solar)   // из дома Луны; solar если нет времени
transit          : { moon_conjunct_natal_day: weekday|null, moon_phase: enum(8) }
```
Движок собирает строки по шаблонам §6 из фрагментов §1–§5. `solar` → timing-ветка «by the day». Неоднозначный знак Луны → собрать ДВЕ сигнатуры (см. P-5 §3), показать обе.

---

## 1. Depth — фрагменты ← `moon_element`

| element | `depth_phrase` (в R1 строке 1) | `element_reframe` (R1 строка 2) |
|---|---|---|
| water | *runs deep* | *That isn't 'too much' — it's the shape of your water. You feel things before most people notice them.* |
| fire | *runs high and hot* | *That isn't 'too intense' — it's the heat of your water. You rise fast, and that's a force, not a fault.* |
| earth | *runs low and constant* | *That isn't 'never enough discipline' — it's the steadiness of your water. It's quiet, but it's always there.* |
| air | *runs quick and light* | *That isn't 'flaky' — it's the quickness of your water. It moves and changes, and that's how you're built.* |

## 2. Shape — фрагменты ← `moon_modality`

| modality | `shape_phrase` (R1) | `shape_r2` (R2 первая часть) |
|---|---|---|
| cardinal | *turns sharply* | *The plans that failed met you at your highest water and called it failure. The turn was never the problem — the plan's timing was.* |
| fixed | *holds steady* | *The plans that failed kept changing the rules. Your tide holds steady — it needed one rhythm to settle into, not a new one each week.* |
| mutable | *shifts from day to day* | *The plans that failed asked you to eat the same way every day. Your water is different every day — so the plan broke, not you.* |

## 3. Timing — фрагменты ← `timing_band`

| band | `timing_phrase` (R1) | `window` (R4) |
|---|---|---|
| early | *rises early, before noon* | *the mornings* |
| midday | *rises around midday, when focus thins* | *midday* |
| evening | *rises in the evenings* | *the evenings* |
| late | *rises late, after dark* | *after dark* |
| solar | *rises by the day, not the hour* | *across the day* |

**Solar-вставка (R1, строка 1 хвост, только если band=solar):** *“— without your birth hour I read it by the day, not the clock, still fully yours.”*

## 4. Hunger — 12 знаков Луны ← `moon_sign`

Колонки: `reaching_for` (R1 строка 3) · `trigger` (R3 опенер «When …,») · `pull_alt` (recognition_no → the pull).

| Луна | element/mod | `reaching_for` | `trigger` | `pull_alt` |
|---|---|---|---|---|
| Aries | fire/card | *a way to move the feeling out, not food* | *the energy has nowhere to go* | *a release — a way to burn it off* |
| Taurus | earth/fix | *something solid and calming, not food* | *the ground feels unsteady* | *comfort you can hold onto* |
| Gemini | air/mut | *a change of channel — something new, not food* | *the day goes flat* | *stimulation — a new input* |
| Cancer | water/card | *care, not food* | *care runs low* | *comfort and safety* |
| Leo | fire/fix | *warmth, to feel seen — not food* | *you go unseen too long* | *warmth and being noticed* |
| Virgo | earth/mut | *a sense that things are handled, not food* | *the details pile up* | *order — a quiet mind* |
| Libra | air/card | *ease and a softer room, not food* | *things feel out of balance* | *harmony — smoothing things over* |
| Scorpio | water/fix | *something that meets you fully, not food* | *deep feelings go unspoken* | *intensity — depth* |
| Sagittarius | fire/mut | *room to breathe, not food* | *the walls start to close in* | *space — an escape* |
| Capricorn | earth/card | *a moment where everything's handled, not food* | *the load piles up* | *control — holding it together* |
| Aquarius | air/fix | *room to step back, not food* | *you need distance* | *space — detachment* |
| Pisces | water/mut | *a gentler edge, not food* | *the edges get sharp* | *comfort — softening* |

## 5. R4 — транзит-библиотека ← `transit`

**5.1 Если `moon_conjunct_natal_day` задан (Луна возвращается в твой знак на этой неделе):**
`transit_line` = *“As the Moon returns to your sign on {day}, the pull runs strongest.”*

**5.2 Фолбэк — по `moon_phase` (8 фаз, всегда доступно):**
| phase | `transit_line` |
|---|---|
| new | *This week opens on a new moon — the water sits low and quiet. A gentle week to begin.* |
| waxing_crescent | *The moon is filling — the pull builds slowly toward the weekend.* |
| first_quarter | *The moon's at first quarter — the water meets some friction midweek.* |
| waxing_gibbous | *The moon's nearly full — high water rises over the next few nights.* |
| full | *A full moon this week — the tide runs high and feelings sit close to the surface.* |
| waning_gibbous | *The moon is releasing — the water eases after its high.* |
| last_quarter | *Last quarter moon — a week to let the tide settle and clear.* |
| waning_crescent | *The moon is low and thinning — the quietest water of the month. Rest with it.* |

## 6. Шаблоны сборки секций

**R1 — «Your tide»** (eyebrow `WHAT YOUR CHART SHOWS`)
```
{name} — your tide {depth_phrase} and {shape_phrase}, and it {timing_phrase}{solar_tail?}.
{element_reframe}
When the water pulls, it's reaching for {reaching_for}.
```

**R2 — «Why plans pulled you under»**
```
{shape_r2}
Trying harder was never the missing piece.
```

**R3 — «Your pattern»**
```
When {trigger}, the tide comes — and food is the nearest shore.
Then the quiet part you know too well: 'what's wrong with me.'
Nothing's wrong. It's a pattern with a tide, and a tide can be met.
```

**R4 — «This week's water»**
```
This week the water runs high near {window}. {transit_line}
I'll meet you there — one small way to ride each high tide.
```

**Recognition gate**
```
Does this feel like you?   [ Yes, that's me ]   [ Not quite ]
```

## 7. Recognition_no — два пути: tune the reading / fix the data (D5 + D9)

После `Not quite` показываем **оба** пути — у промаха два корня (чтение чуть мимо ИЛИ введены неверные данные), юзер выбирает сам.

**(a) Tune the reading** — *“What didn't fit?”* → чип (один переспрос):
| Чип | Строка переспроса | Что меняем |
|---|---|---|
| `the timing` | *“Maybe it rises {alt_window} than I read. Does the pull come more then?”* | смежная `timing_band` (early↔midday↔evening↔late) |
| `the pull` | *“Maybe it's not that — more like {pull_alt}. Closer?”* | `pull_alt` знака (§4) |
| `the pattern` | *“Maybe the loop runs quieter — less a craving, more a drift toward the kitchen when {trigger}. Truer?”* | смягчённый R3 с тем же `trigger` |

**(b) Check my details (D9)** — тихая ссылка под чипами на случай ошибки ввода (неверная дата/город → неверна вся карта, переякоривание не поможет):
- ссылка: *“Or — I may have your details wrong. Check them.”*
- intro при возврате: *“Sometimes the water reads off because a detail's off. Let's check your birth info.”* → вернуть на **SC-2 (дата / время / город, prefilled)** → правка → **пересчёт карты** → свежий Lighting + Reveal → снова recognition.
- confirm после правки: *“Thank you. Let me read your tide again.”*
- тон: без вины («I may have …», не «you mistyped»).

**Loop-guard:** до **2** коррекций данных + **1** переякоривание оси. После исчерпания — мягкий выход без пейволла: *“Then I haven't read your water clearly yet. Let me sit with it — I'll come back when I see it true.”*

---

## 8. Собранные примеры (выход движка)

**Пример 1 — Cancer Moon, late (4-й дом), full moon, conjunct в Wed.**
> **R1.** *Maya — your tide runs deep and turns sharply, and it rises late, after dark. That isn't 'too much' — it's the shape of your water. You feel things before most people notice them. When the water pulls, it's reaching for care, not food.*
> **R2.** *The plans that failed met you at your highest water and called it failure. The turn was never the problem — the plan's timing was. Trying harder was never the missing piece.*
> **R3.** *When care runs low, the tide comes — and food is the nearest shore. Then the quiet 'what's wrong with me.' Nothing's wrong. It's a pattern with a tide, and a tide can be met.*
> **R4.** *This week the water runs high near after dark. As the Moon returns to your sign on Wednesday, the pull runs strongest. I'll meet you there — one small way to ride each high tide.*

**Пример 2 — Gemini Moon, midday (10-й дом), waxing_gibbous, no conjunction.**
> **R1.** *Sam — your tide runs quick and light and shifts from day to day, and it rises around midday, when focus thins. That isn't 'flaky' — it's the quickness of your water. It moves and changes, and that's how you're built. When the water pulls, it's reaching for a change of channel — something new, not food.*
> **R2.** *The plans that failed asked you to eat the same way every day. Your water is different every day — so the plan broke, not you. Trying harder was never the missing piece.*
> **R3.** *When the day goes flat, the tide comes — and food is the nearest shore. Then the quiet 'what's wrong with me.' Nothing's wrong. It's a pattern with a tide, and a tide can be met.*
> **R4.** *This week the water runs high near midday. The moon's nearly full — high water rises over the next few nights. I'll meet you there — one small way to ride each high tide.*

**Пример 3 — Capricorn Moon, solar (нет времени), last_quarter.**
> **R1.** *Lee — your tide runs low and constant and turns sharply, and it rises by the day, not the hour — without your birth hour I read it by the day, not the clock, still fully yours. That isn't 'never enough discipline' — it's the steadiness of your water. It's quiet, but it's always there. When the water pulls, it's reaching for a moment where everything's handled, not food.*
> **R2.** *The plans that failed met you at your highest water and called it failure. The turn was never the problem — the plan's timing was. Trying harder was never the missing piece.*
> **R3.** *When the load piles up, the tide comes — and food is the nearest shore. Then the quiet 'what's wrong with me.' Nothing's wrong. It's a pattern with a tide, and a tide can be met.*
> **R4.** *This week the water runs high near across the day. Last quarter moon — a week to let the tide settle and clear. I'll meet you there — one small way to ride each high tide.*

---

## 9. Покрытие и QA
- **Комбинаторика v1:** 4 element × 3 modality × 5 timing × 12 hunger = **720 уникальных R1**; R2 = 3 варианта; R3 = 12; R4 = 12 sign-conjunction + 8 фаз. Полностью детерминированно, без LLM.
- **QA узнавания (приёмка P-1):** прогнать ≥10 реальных карт на 5 тест-юзерах; критерий «узнаю себя» ≥4/5.
- **Линт:** все строки §1–§7 + собранные §8 через ban-лист (P-4) до интеграции.
- **Микро-грамматика:** движок чистит двойные предлоги на стыке (например R4 «near across the day» → «near, across the day» или просто «runs high across the day») — список из ~5 склеек отдать как post-process правило. *(единственный технический момент сборки — флагую для CTO.)*

---

## 10. Что дальше
1. **CTO:** залить пак в tide-signature движок (§0 контракт, §6 шаблоны); добавить post-process склеек (§9).
2. **CPO (я):** при желании — v2-расширение: учесть Rising/Sun как вторичные модификаторы R1 для большей точности узнавания; и контент Anchor-практик (P-2, отдельный трек) под high-tide окна.
3. **Контент-QA:** прогон ≥10 карт + линт перед интеграцией.

*Reveal Content Pack v1, 2026-06-14. EN, голос Весты, no health-claims. Детерминированно (720 R1-комбинаций), 0 токенов. Phase 1.*
