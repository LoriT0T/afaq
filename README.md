# Āfāq — آفاق

Screen, road, craft and travel — one model of what you actually love, fitted to what you
actually did.

Live: <https://lorit0t.github.io/afaq/>

> سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ — *Fuṣṣilat 41:53*

## The argument

Every media tracker stores. None of them select. A watchlist only grows, a someday-list only
grows, and hobby apps count streaks instead of skill. Āfāq makes a prediction **before** you
go, compares it against what you report, and reports its own error. If that error stops
falling, the app is not working — and it says so on the Model tab.

Four domains, one engine:

| | |
|---|---|
| **Screen** | 60 titles scored on 8 axes. Genre is deliberately not one of them — "anime" contains both *Mushishi* and *Mob Psycho*, so it predicts nothing. |
| **Ride** | A 13-drill motorcycle curriculum where every level is gated on **logged evidence of a named drill**, not on mileage and not on reading. |
| **Craft** | A pursuit portfolio judged on what it *spans*, with recommendations produced by gap analysis rather than by list. |
| **Travel** | Trips with real itineraries and a post-trip debrief, which is the only part that predicts anything about the next one. |

## How the model works

`js/taste.js` is ridge regression, refitted from the log on every page load. Nothing about
the model is stored, so it can never drift out of sync with the data that produced it.
Features are standardised, so a weight reads as *rating points per standard deviation* and
the prior (`LAMBDA = 8`) means the same thing at every sample size.

The honest test is **prospective**. A prediction is frozen the moment a title enters the
queue, before it is watched; calibration compares those frozen predictions against what
actually happened. Rating something retroactively teaches the model but does not test it,
and the app keeps the two apart.

Cold start uses greedy maximin spread: the ten titles furthest apart in the eight axes.
Ten ratings there are worth roughly forty random ones, because near-identical titles cannot
move the weights. The recommender blends predicted score with information gain, weighted
toward information while the model is cold.

## The one thing

`engine.js → theOneThing()` returns exactly one answer per day, chosen by a rule list that
is printed in the app. A list is a decision handed back to the user.

## Stack

Vanilla ES modules, no build step, no dependencies, no account, no server. State is one
`localStorage` key (`afaq.v1`); export is the only backup that exists. Offline PWA with a
**network-first** service worker — cache-first is the usual default and it is wrong, because
a shipped fix then keeps showing the old code and the failure is silent.

**All content lives in `js/data.js`** — catalogue, drills, roads, risk ledger, pursuits,
destinations. Views read from it; nothing is hardcoded in templates. To change what the app
says, edit that file only.

```
js/data.js     all content
js/store.js    persistence, one localStorage key
js/taste.js    the model: fit, predict, explain, calibrate, spread, rank
js/engine.js   gates, gaps, arbitration, seasons, weather
js/app.js      views + router
```

## Dev

```bash
python3 tools/devserver.py 8125 .
```

Use that, never `python -m http.server` — the stdlib server sends `Last-Modified` with no
`Cache-Control`, so browsers serve modules from memory without revalidating and edits become
invisible to the page while tests still pass against the old code.

## Privacy

Nothing leaves the device. The single exception is the optional riding-weather forecast,
which is **off by default**; turning it on sends coordinates rounded to ~11 km to open-meteo
and nothing else. No key, no account, no analytics.
