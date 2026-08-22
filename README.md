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
| **Screen** | 91 titles scored on 10 axes. Genre is deliberately not one of them — "anime" contains both *Mushishi* and *Slime*, so the label predicts nothing. |
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

### Two axes that were not there on day one

The first eight axes were built for prestige film and could not separate the owner's 9s from
his 5s. **Sincerity** (ironic ↔ earnest) and **Progression** (static ↔ visible ladder) can, and
they were added from his own account of why *Suits* and *Billions* failed for him — "too serious,
not fun" — against a top tier of *Re:Zero*, *Slime* and *Akame ga Kill*. Sincerity now carries
the largest weight in the fitted model.

### Mode: engaged vs comfort

Every rating carries a mode. **Comfort watches are excluded from the fit.** Three rewatches of
*Arrested Development* is the strongest raw signal in the log and the most misleading — it
measures what the show is *for* (something to put on in a rut), not whether he likes that kind
of thing. Fitting on it teaches the model the opposite of the truth.

### Format is a budget, not a taste

About one film every four months and one series a year. That constraint lives in the ranking
layer as **rationed slots** — one film pick, one series pick — rather than as an axis, because
"is it animated" would otherwise absorb variance belonging to Sincerity and Progression.

Cold start uses greedy maximin spread over the medium actually watched: the ten anime furthest
apart in the ten axes. Weights only sharpen in the region the ratings occupy, so spreading
calibration across prestige film would sharpen the model where he goes once a quarter and
leave it blurry everywhere he lives.
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
