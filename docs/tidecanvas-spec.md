# Vesta — TideCanvas & Transitions Spec (B1) — контракт для разработки

**Дата:** 2026-06-14 · **Автор:** Head of Design
**Закрывает:** блокер **B1** из acceptance-gate ([[2026-06-14_cpo-design-acceptance-gate]]) + DoD-пункты зоны дизайна: **G-A** (единый холст), **G-C** (эскалация награды), **G-D** (VoiceOver-нарратив), **G-F** (partial-reveal), Reduce Motion, 60fps.
**Для:** CTO (реализация) + Head of Design (источник правды по движению).
**Тезис, который защищаем:** *история медленно оживает на одном холсте.* Все прототипы доказывают это; этот документ делает его **контрактом**, чтобы разработка не построила на каждом экране свою линию.

> Связано: дизайн-стратегия v2 (F1–F12), дев-спека +Addendum F1–F12 ([[2026-06-14_vesta-dev-requirements]]), нарративный путь B0–B13.

---

## 1. Принцип: один холст, ноль пересозданий

**TideCanvas** — единственный персистентный слой воды, живущий **под** всей навигацией активационного пути и daily. Экраны — это карточки/оверлеи над ним; они **читают и пишут** общую модель прилива, но **никогда не создают свою линию заново**.

- Один `requestAnimationFrame`-цикл (один Canvas; в RN — один Skia/`<Canvas>`), не по экрану.
- Состояние прилива живёт в **сторе** (Zustand/аналог), переживает переходы между экранами. Навигация меняет оверлей-карточку, не воду.
- Любая «смена экрана» = изменение **целей** модели (которые плавно лерпятся) + смена карточки. Вода не моргает.

---

## 2. Модель прилива (TideState) — единый источник

```ts
TideState = {
  baseY: number,        // уровень воды (доля высоты). Растёт по ходу пути.
  amp: number,          // амплитуда живых волн
  crestH: number,       // высота «высокой воды» (гребень)
  peakX: number,        // позиция гребня (окно high tide)
  warm: 0..1,           // cool→warm: золото/свет/блики появляются по мере роста
  light: 0..1,          // яркость солнца-Весты
  layers: int,          // composed-слои (compose, F5)
  env: 'dawn'|'day'|'dusk'|'night',
  swells: Swell[],      // временные всплески (тап/событие)
  ripples: Ripple[],    // кольца на поверхности
  motes: Mote[],        // тонущие частицы (глубина)
  trust: 0..1           // «trust meter» — накопление награды (см. §5)
}
```

**Правила:**
- Экран задаёт **targets** (`baseYT, ampT, crestT, warmT, lightT, layersT, peakXT`); рендер лерпит текущие к целям (`v += (vT - v) * k`, k≈0.05). Это даёт плавность и непрерывность через переходы.
- `surfaceY(x,t)` — чистая функция от TideState (волны + гребень(ы) + swells). Все экраны используют **одну** `surfaceY`.
- Тяжёлые статические профили (натальные позиции, недельный профиль) **кэшируются** (массив), не считаются экспонентами каждый кадр (см. §8).

---

## 3. Контракт непрерывности (continuity)

- **Внутри сессии путь** не сбрасывает TideState: прилив, «зажжённый» в Lighting и углублённый в Reveal, доживает до Paywall/Day0/Charge.
- **web→app handoff (G-B):** при переходе с web (Quiz→Paywall) в app deep-link несёт снапшот: `chart`, `recognition_result`, `day_index`, `composed_layers`, и **сериализованный TideState** (baseY/warm/crest/layers/peakX/env). App **гидрирует** ту же воду — момент «same line, now in your pocket», не повторный квиз и не новая линия.
- Если снапшот недоступен — app восстанавливает по `user_id` (chart+recognition+day_index) и реконструирует TideState детерминированно (та же формула).

---

## 4. Система переходов — один приём везде

**Transition primitive (единственный):** `transition(render, x?) = waterSwell(x) + cardCrossFade(render, 430ms)`.
- `waterSwell(x)` — всплеск в точке x (или у гребня) → разбегается рябью; синхронный haptic.
- `cardCrossFade` — текущая карточка fade+slide-down out (210ms) → swap контента → fade+slide-up in (220ms).
- Вода под карточкой **продолжает жить** во время перехода (не участвует в fade).
- Reduce Motion: без слайда — мгновенный swap + статичный всплеск-«вспышка».

### 4.1 Карта переходов (choreography)

| Переход | Триггер | Дельта TideState (targets) | Карточка | Haptic |
|---|---|---|---|---|
| Quiz: ответ | tap option | `baseYT` ↑ на шаг (море прибывает) | след. вопрос | light |
| Quiz→Birth | last answer | hold `baseY`; `env` dusk | поля рождения; ghost-wheel show | light |
| Birth: поле | tap field | tick; ghost-wheel-сегмент lit | обновить поля | light tick |
| **Birth→Lighting** | «Light my chart» | спарк→`pourStart`; `warmT:0→1`, `lightT↑`, `crestT↑`, `baseYT`↑; колесо unfurl (та же ghost-карта загорается) | loading-нарратив→печать сигнатуры | medium → soft на «зажжении» |
| Lighting→Reveal | CTA «Read what I see» | tide уже сформирован; hold | reveal-слой R1 | light |
| Reveal: бит | tap | swell + `crestT`+=, `lightT`+= (compose), `trust`+= (§5) | след. R-слой | soft, нарастает |
| recognition_no | tap «Not quite» | swell | чипы→переякор→gate | light |
| **Reveal→Paywall** | «Yes, that's me» | big swell; `crestT`=max; composed-линия как оффер; `trust`=1 | пейволл | success-накат |
| **Paywall→Day0** | trial_start (web→app) | **handoff** §3: гидрировать тот же TideState; `env` morning; entrance = твоя линия «переехала», без reset | Today+Anchor | soft «мы начинаем» |
| Day0: anchor done | «Mark as ridden» | success swell; `layersT`+=1 (новый слой) ; `crestT` чуть ↑ | done-строка | success |
| Day→Evening | «How did today feel» | `env` dawn→night cross-fade | evening check | light |
| →Charge (день 7) | trial end | неделя «вырастает» в линию (amp 0→1 профиля, §8) | charge-карточка | тихие тики по дням |

> **Никаких «cut»-переходов.** Каждая смена сцены проходит через `transition()`. Это и есть консистентность, которую требует продукт.

---

## 5. Эскалация награды — «trust meter» (G-C / D3)

Свет и haptic **не** настраиваются пер-экранно — они растут как **одна кривая** через биты узнавания B4→B8.

```
trust: 0 → 1 across recognition beats
beat B3 (Lighting peak): trust 0.45
B4 Reveal-1: 0.55   B5 Reveal-2: 0.68   B6 Reveal-3: 0.80   B7 Reveal-4: 0.90
B8 «Yes, that's me»: 1.0 (climax)
```

| Что | Привязка к trust |
|---|---|
| Vesta-light `light` | `0.45 + trust*0.55` |
| glow/shadowBlur линии | `mix(5, 12, trust)` |
| haptic на бите | intensity `mix(.3, .9, trust)` (soft→success-накат на climax) |
| тёплый рефлекс/блики | scale by `trust` |

CTO: реализовать `trust` как поле TideState; биты только инкрементят его. Нотация выше = таблица значений.

---

## 6. Motion / haptic токены (свод, из Addendum F1–F12)

`motion.tide = { transition:430, drawWheel:2200, unfurl:1400, breatheNow:3000, driftWater:8000, crossEnv:700, riseWeek:3200 }`
`haptic.tide = { swell(rampLight), anchorDone(success), insightPeak(soft+sharp), highTideAlert(double-soft), tick(light) }`
easing: переходы — easeInOut; «рост недели»/«подъём» — easeInOutCubic. Всё дышит, без bounce.

---

## 7. VoiceOver-нарратив (G-D) — холст проходим без зрения

- **Tideline** — не декор: `accessibilityLabel` = осмысленная сводка, напр. *«Your tide: rises early, high near evening. Now: calm.»* Обновляется при смене `peakX`/`crest`.
- **Wheel (Chart)** — каждая планета = отдельный a11y-элемент с label («Moon, pulling tonight — your high tide»); активная объявляется при выборе.
- **Reveal-композиция** — каждый бит = **custom action / announcement**: свайп вправо у VoiceOver = «следующий слой»; озвучивается текст слоя; recognition gate — стандартные кнопки. Прожимаемость работает без зрения.
- **Vesta-light** — `accessibilityValue` по состоянию («Vesta is thinking», «Vesta is speaking»); декоративный motion `accessibilityElementsHidden`.
- Стриминг-ответ диалога доступен VoiceOver по завершении печати.

---

## 8. Partial-reveal (G-F), состояния, Reduce Motion, перф

- **Partial-reveal:** reveal рендерит **столько слоёв, сколько пришло** (1–4), без плейсхолдеров; недостающие просто отсутствуют. TideState.layers отражает доступные.
- **Loading** = нарратив на воде («Reading the shape of your tide…») + дышащий свет, не спиннер. **Offline** = последняя линия дня из кэша TideState. **Error** = мягкий тон + retry, ввод/линия не теряются.
- **Reduce Motion:** вода замирает на одном кадре (или очень тихий дрейф ≤ порога); переходы → мгновенный swap; draw/pour/rise → конечный кадр; thinking → текст-индикатор. Фолбэки F1–F12 — в дев-спеке.
- **Перф (60fps на SC-3/4/7):** один rAF; кэш статических профилей (натальные позиции, недельный профиль) — экспоненты считать 1× при resize; на кадр — дешёвые синусы + lookup; не плодить градиенты там, где можно переиспользовать; в RN — Skia + worklets, без JS-bridge на кадр.

---

## 9. Реализация в RN (рекомендации CTO)

- Один `<Canvas>` (**Skia** рекомендуется) хостит TideCanvas-модель на корневом уровне навигатора активации/daily; экраны (карточки) — оверлеи в навигаторе поверх него.
- TideState — в сторе (Zustand); экраны при `focus` выставляют targets; рендер-цикл лерпит. Навигация **не размонтирует** Canvas.
- Переход экранов синхронизирован с `transition()` (swell + cross-fade), не нативный stack-push (или push с прозрачным фоном, чтобы вода просвечивала).
- web (верх воронки) использует тот же модельный код (общий TS-модуль `tide-core`), чтобы web и app рисовали идентичную линию и handoff нёс совместимый TideState.

---

## 10. Acceptance criteria для B1

- [ ] Один Canvas/один rAF на весь активационный путь; навигация не пересоздаёт воду (проверка: при переходе Lighting→Reveal→Paywall линия визуально непрерывна, без моргания).
- [ ] TideState в сторе переживает переходы; web→app handoff гидрирует ту же линию (та же форма/уровень/слои).
- [ ] Все смены сцен проходят через единый `transition()` (swell + cross-fade) — нет «cut».
- [ ] `trust`-кривая управляет светом+haptic через B4→B8 (не пер-экранные значения).
- [ ] VoiceOver: tideline и колесо озвучиваются осмысленно; reveal проходим по битам.
- [ ] Reduce Motion и partial-reveal реализованы; 60fps на SC-3/4/7 на проде-прототипе.

---

*B1 — контракт TideCanvas/переходов. Закрывает G-A и DoD-пункты зоны дизайна (G-C, G-D, G-F, Reduce Motion, 60fps). B2 (event-map) — за CPO/CTO, B3 (guardrail-линт) — совместно. UI-тексты EN, без health-claims; пояснения RU.*
