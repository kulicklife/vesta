# Batch A (AI-дизайнер) — статус по DA-1…DA-12

Источник: `inbox/2026-06-20_vesta-execution-backlog-design-then-cto.md` (выводы C1–C8). Гард: no health-claims, тон наставницы. Гейт приёмки: DoD §8 + копи-линт. Файлы — в `screens/`.

| ID | Задача | Статус | Где |
|---|---|---|---|
| **DA-1** | Онбординг-ввод: `Where were you born?`, без stray-ошибки, нативные пикеры, city-autocomplete с дизамбигуацией, экран Confirm с днём недели | ✅ | `screens/onboarding-input.html` |
| **DA-2** | Today → «one tide, one glance»: anchor доминирует, evening-check за действием, тихие входы, без Manage | ✅ | `screens/today.html` |
| **DA-3** | Paywall: eyebrow под момент (день 0, не «DAY 2/3») + Quarter $29.99 decoy | ✅ | `screens/full-flow.html` (goPay) |
| **DA-4** | Живая вода сверху на квиз/онбординг (верх не пустой) | ✅ | `onboarding-input.html`, `quiz-birth.html` (cool-вода + ghost-wheel) |
| **DA-5** | Reveal: de-dup keystone-строка | 🟡 ждёт финальную копи CPO; экран рендерит чистую R1 без дубля | `screens/reveal.html`, `full-flow.html` |
| **DA-6** | Chart → explorable (wheel⟷tide F4, tap-планета) | ✅ | `screens/chart.html` |
| **DA-7** | Story → аудио-плеер (generating/ready/playing, главы, lock-screen Now Playing, EN+RU) | ✅ | `screens/story-audio.html` |
| **DA-8** | Recognition_no суб-флоу: tune-чипы + Check details → re-reading | ✅ | `full-flow.html` (CR-001) |
| **DA-9** | Sample-tide preview (taste→desire→data) | ✅ | `screens/sample-tide.html` |
| **DA-10** | Solar-ветка birth-hour («I don't know» → равноценно) + отражение в Confirm | ✅ | `onboarding-input.html` |
| **DA-11** | Полная карта С ДОМАМИ (time-known): 12 домов, куспиды, аспекты, таблица, перевод | ✅ | `screens/chart-houses.html` (solar без домов — `chart.html`) |
| **DA-12** | Обязательные состояния (loading-нарратив/empty/error/offline/Reduce Motion/Dynamic Type) | 🟡 каталог готов; применить per-screen в DoD-проходе | `screens/states.html` (каталог) + спека `tidecanvas-spec.md`/`dev-requirements.md` |

## Открытое (вход от CPO / на CTO)
- **DA-5/EB-2:** финальная de-dup строка Reveal — от CPO (контент-вход).
- **DA-12:** пер-экранный DoD-проход (применение состояний к каждому критическому экрану) — добиваю при финализации.
- **Batch B (CTO):** EB-1 движок ввода (гайзеттир/пикеры/weekday/пересчёт), EB-2 post-process строк, EB-3 консультантская петля, EB-4 explorability-логика+дома, EB-5 Story+аудио ElevenLabs, EB-6 события, EB-7 i18n, EB-8 guardrail-линт CI. Передаётся после приёмки A.

## Связь правок
DA-1 (предотвращение ошибок: пикеры/autocomplete/confirm) + DA-8 (восстановление: Check details/re-reading) = ошибка ввода закрыта с двух сторон. DA-9 (sample) отвечает на «зачем данные» (taste→desire→data) перед DA-1.

*Batch A статус, 2026-06-20. Готово к приёмке CPO по DoD §8 + копи-линт.*
