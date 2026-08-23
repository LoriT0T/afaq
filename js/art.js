/* Āfāq — pictures, and where they come from.
 *
 * A recommendation without a poster is a row of text asking you to remember whether you
 * have seen something. With one, you know in a glance. So every title gets a real image,
 * a real synopsis, the audience score, and a way to the trailer.
 *
 * TWO SOURCES, BOTH KEYLESS, BOTH CORS-CLEAN — which matters because this is a static
 * page in a public repo and there is nowhere to hide a key:
 *
 *   Jikan (api.jikan.moe)   the MyAnimeList mirror. Poster, synopsis, score, episode
 *                           count and often the trailer's YouTube id. Most of this
 *                           catalogue is anime, so this covers most of it, and it is
 *                           better than a general source would be — the right poster,
 *                           the right season, a score from people who watch the genre.
 *   Wikipedia REST          everything else. The lead image on a film's article is its
 *                           poster, and the extract is a serviceable overview.
 *
 * iTunes was tried and dropped: it answers 200 with an empty result set from this
 * storefront, which is worse than failing.
 *
 * Everything is cached in localStorage under `afaq.art`, keyed by title id, and a miss
 * is cached too. Without that, a browse of the catalogue is ninety network calls and
 * Jikan starts refusing them — its rate limit is about three a second, which is why
 * lookups here are queued rather than fired in parallel.
 *
 * Nothing here blocks a render. A row draws immediately with a lettered placeholder and
 * the picture arrives when it arrives.
 */

const KEY = 'afaq.art';
const TTL = 90 * 864e5;          // three months; posters do not change

const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const write = c => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* full */ } };

let cache = read();

export const cached = id => {
  const r = cache[id];
  if (!r) return null;
  if (Date.now() - (r.at || 0) > TTL) return null;
  return r;
};

/* Jikan asks for no more than about three calls a second and answers 429 or 504 when
   pushed. One at a time with a gap is slower and actually works. */
let chain = Promise.resolve();
const queued = fn => (chain = chain.then(fn, fn).then(r => new Promise(res => setTimeout(() => res(r), 420))));

/* A circuit breaker. Jikan goes down for hours at a time, and without this every anime
   in the catalogue retries it twice before falling back — ninety titles became several
   hundred doomed requests and a console full of 504s. Three consecutive failures and it
   is left alone for the rest of the session; one success reopens it. */
let jikanFails = 0;
const JIKAN_OUT = 3;
const jikanUp = () => jikanFails < JIKAN_OUT;

async function fromJikan(title, year) {
  const u = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=3&sfw`;
  /* Jikan answers 429 when pushed and 504 when its upstream is slow. Both clear on
     their own, so it is worth one patient retry before handing over to Wikipedia. */
  let r = await fetch(u);
  if (!r.ok && (r.status === 429 || r.status >= 500) && jikanFails < JIKAN_OUT - 1) {
    await new Promise(res => setTimeout(res, 900));
    r = await fetch(u);
  }
  if (!r.ok) { jikanFails++; throw new Error('jikan ' + r.status); }
  jikanFails = 0;
  const list = (await r.json()).data || [];
  if (!list.length) return null;
  /* Prefer the entry whose start year matches — a long-running title has sequels with
     nearly identical names and the first hit is often the wrong season. */
  const pick = list.find(a => year && a.aired?.prop?.from?.year === year) || list[0];
  return {
    img: pick.images?.jpg?.large_image_url || pick.images?.jpg?.image_url || null,
    overview: pick.synopsis || '',
    score: pick.score || null,
    scoreOf: pick.score ? 10 : null,
    votes: pick.scored_by || null,
    trailer: pick.trailer?.youtube_id || null,
    link: pick.url || null,
    source: 'MyAnimeList'
  };
}

/**
 * Wikipedia, searched rather than guessed.
 *
 * The first version built candidate titles by hand — `Monster (film)`, `Monster`, and
 * so on — and it was wrong in the way that matters: the bare title for "Monster" is the
 * dictionary article about monsters, and for "Mushishi" it is the live-action film
 * rather than the 46-episode series. Guessing a URL and taking whatever answers is not
 * a lookup. Searching with the kind as a qualifier returns Monster_(manga) and
 * Vinland_Saga_(TV_series), which are the right articles.
 *
 * Two requests instead of one, and worth it.
 */
const KIND_WORD = { anime: 'anime', tv: 'TV series', film: 'film', doc: 'documentary film' };

/* ── OMDb: the only legitimate route to IMDb ────────────────────────
   IMDb itself has no free public API — the official one is enterprise — and imdb.com
   answers 403 to anything that is not a browser, so scraping it is both blocked and
   against their terms. OMDb is the long-standing third party that republishes IMDb
   data, it is CORS-clean, and a free key returns both the IMDb rating and IMDb's own
   poster art. One key, and the pictures genuinely come from IMDb. */
const OMDB_KEY = () => { try { return localStorage.getItem('afaq.omdb') || ''; } catch { return ''; } };
export const hasOmdb = () => !!OMDB_KEY();
export const setOmdb = k => { localStorage.setItem('afaq.omdb', String(k || '').trim()); cache = {}; write(cache); };

async function fromOmdb(title, year, kind) {
  const key = OMDB_KEY(); if (!key) return null;
  const type = kind === 'film' || kind === 'doc' ? 'movie' : 'series';
  const u = `https://www.omdbapi.com/?apikey=${encodeURIComponent(key)}`
    + `&t=${encodeURIComponent(title)}${year ? `&y=${year}` : ''}&type=${type}`;
  const r = await fetch(u);
  if (!r.ok) throw new Error('omdb ' + r.status);
  const j = await r.json();
  if (j.Response === 'False') return null;
  const rating = parseFloat(j.imdbRating);
  return {
    img: j.Poster && j.Poster !== 'N/A' ? j.Poster : null,
    overview: j.Plot && j.Plot !== 'N/A' ? j.Plot : '',
    score: Number.isFinite(rating) ? rating : null,
    votes: j.imdbVotes && j.imdbVotes !== 'N/A' ? Number(j.imdbVotes.replace(/,/g, '')) : null,
    trailer: null,
    link: j.imdbID ? `https://www.imdb.com/title/${j.imdbID}/` : null,
    source: 'IMDb'
  };
}

/* ── TMDB, if a key is present ──────────────────────────────────────
   The purpose-built source: a poster for essentially everything, the right one, plus a
   rating and an overview. It needs a free key, so it cannot be the default in a public
   repo — paste one in Travel → Settings and it becomes the primary lookup, with Jikan
   and Wikipedia staying as the keyless fallback. Worth doing: the alternatives are a
   community mirror that was returning 504 all afternoon, and an encyclopedia that has
   to be talked into the right article. */
const TMDB_KEY = () => { try { return localStorage.getItem('afaq.tmdb') || ''; } catch { return ''; } };
export const hasTmdb = () => !!TMDB_KEY();
export const setTmdb = k => { localStorage.setItem('afaq.tmdb', String(k || '').trim()); cache = {}; write(cache); };

async function fromTmdb(title, year, kind) {
  const key = TMDB_KEY(); if (!key) return null;
  const type = kind === 'film' || kind === 'doc' ? 'movie' : 'tv';
  const yq = year ? (type === 'movie' ? `&year=${year}` : `&first_air_date_year=${year}`) : '';
  const r = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${encodeURIComponent(key)}`
    + `&query=${encodeURIComponent(title)}${yq}`);
  if (!r.ok) throw new Error('tmdb ' + r.status);
  const hit = (await r.json()).results?.[0];
  if (!hit) return null;
  return {
    img: hit.poster_path ? `https://image.tmdb.org/t/p/w500${hit.poster_path}` : null,
    overview: hit.overview || '',
    score: hit.vote_average ? Math.round(hit.vote_average * 10) / 10 : null,
    votes: hit.vote_count || null,
    trailer: null,
    link: `https://www.themoviedb.org/${type}/${hit.id}`,
    source: 'TMDB'
  };
}

async function fromWikipedia(title, year, kind) {
  /* The year is part of the query, not decoration. Without it "Monster" finds a 2022
     Malayalam thriller ahead of the 2004 series, and the search has no other way to
     know which one is meant. */
  const q = `${title} ${year || ''} ${KIND_WORD[kind] || ''}`.trim();
  let key = null;
  try {
    const r = await fetch('https://en.wikipedia.org/w/rest.php/v1/search/page?limit=1&q=' + encodeURIComponent(q));
    if (r.ok) key = (await r.json()).pages?.[0]?.key || null;
  } catch { /* fall through to the plain title */ }
  if (!key) key = title.replace(/ /g, '_');

  const r2 = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(key));
  if (!r2.ok) return null;
  const j = await r2.json();
  if (j.type === 'disambiguation' || !j.extract) return null;
  return {
    /* The API hands back a small thumbnail; asking for 500px gives something worth
       looking at without pulling the full-resolution scan. */
    img: j.thumbnail?.source ? j.thumbnail.source.replace(/\/\d+px-/, '/500px-') : null,
    overview: j.extract || '',
    score: null, trailer: null,
    link: j.content_urls?.desktop?.page || null,
    source: 'Wikipedia'
  };
}

/**
 * Look a title up, from cache if possible. Never throws and never blocks a render —
 * a failure is cached as a miss so the same dead lookup is not retried on every paint.
 */
export async function look(t) {
  const hit = cached(t.id);
  if (hit) return hit;

  const run = async () => {
    let got = null, errored = false;

    /* A keyed source first, since both are better than either fallback. IMDb leads
       when its key is present because that is the number most people mean by "the
       rating", and its poster art is the one they picture. */
    if (hasOmdb()) {
      try { got = await fromOmdb(t.t, t.yr, t.k); errored = false; } catch { errored = true; }
    }
    if (!got && hasTmdb()) {
      try { got = await fromTmdb(t.t, t.yr, t.k); errored = false; } catch { errored = true; }
    }

    if (!got && t.k === 'anime' && jikanUp()) {
      try { got = await fromJikan(t.t, t.yr); }
      catch { errored = true; }                    // 504 and 429 are routine there
      /* Wikipedia covers both cases: an anime Jikan has never heard of, and an anime it
         simply failed to answer for. Falling back only on "not found" left the whole
         catalogue blank the first time Jikan had a bad afternoon. */
      if (!got) { try { got = await fromWikipedia(t.t, t.yr, 'film'); errored = false; } catch { errored = true; } }
    } else if (!got) {
      try { got = await fromWikipedia(t.t, t.yr, t.k); errored = false; } catch { errored = true; }
    }

    /* A miss is only cached when both sources genuinely had nothing. Caching a network
       failure would turn one bad afternoon into a permanently pictureless catalogue,
       since nothing would ever ask again. */
    if (!got && errored) return { img: null, overview: '', source: null, transient: true };

    const rec = { ...(got || { img: null, overview: '', source: null }), at: Date.now(), miss: !got };
    cache[t.id] = rec;
    write(cache);
    return rec;
  };
  return queued(run);
}

/** A trailer link that always exists. Jikan gives an id when it has one; otherwise this
    is a search, which is honest — better than a dead button. */
export const trailerHref = (t, art) =>
  art && art.trailer
    ? `https://www.youtube.com/watch?v=${art.trailer}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(t.t + ' ' + (t.yr || '') + ' trailer')}`;

/** Deterministic colour so a title with no poster still looks like itself. */
export function tint(id) {
  let h = 2166136261;
  for (const c of String(id)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return `hsl(${(h >>> 0) % 360} 34% 26%)`;
}

/**
 * Fill in every poster on the page that is still a placeholder.
 * Called after a render; walks the DOM rather than being threaded through every view,
 * because a poster is decoration and should never be on the critical path of drawing.
 */
export async function hydrate(root = document) {
  const slots = [...root.querySelectorAll('[data-art]:not([data-art-done])')];
  for (const el of slots) {
    el.setAttribute('data-art-done', '1');
    const t = { id: el.dataset.art, t: el.dataset.title, yr: +el.dataset.yr || null, k: el.dataset.kind };
    const a = await look(t);
    if (!a) continue;

    /* The text arrives on the same trip as the picture. It used to be rendered from
       cache at paint time, which meant it only ever appeared on the *second* visit to
       a title — the first render always ran before the lookup it depended on. */
    const ov = root.querySelector(`[data-ov="${CSS.escape(t.id)}"]`);
    if (ov && a.overview && !ov.textContent.trim()) {
      ov.textContent = a.overview.length > 210 ? a.overview.slice(0, 210) + '…' : a.overview;
    }
    const src = root.querySelector(`[data-src="${CSS.escape(t.id)}"]`);
    if (src && !src.textContent.trim() && (a.score || a.source)) {
      src.innerHTML = (a.score ? `<b>${a.score}</b>/10${a.votes ? ` · ${Math.round(a.votes / 1000)}k ratings` : ''} · ` : '')
                    + (a.source || '').replace(/[<>&]/g, '');
    }

    if (!a.img) continue;
    const img = new Image();
    img.src = a.img; img.alt = '';
    img.loading = 'lazy'; img.decoding = 'async';
    img.onload = () => { el.innerHTML = ''; el.appendChild(img); el.classList.add('has-img'); };
    /* A broken image is worse than none — keep the placeholder and say nothing. */
    img.onerror = () => {};
  }
}

/* ══════════════════════════════════════════════════════════════════
   PLACES — Pexels, for the travel destinations.

   Same philosophy as the posters above: decoration, never on the critical
   path, cached hard, and a transient failure is never cached as "no image".
   Pexels is the one source here because destinations are places rather than
   works — there is no IMDb for the Lake District. The key is a client-side
   key by design: Pexels' free tier is per-key rate limiting, not a secret,
   and the alternative is a proxy server for wallpaper.
   ══════════════════════════════════════════════════════════════════ */
const PEXELS_KEY = 'zdZkFzT5JGk1mX02XMV7yvEVptHP3JVsTdPFxQmoUAbIxF8yW19lZgY4';
const PLACE_KEY = 'afaq.art.places';

const readPlaces = () => { try { return JSON.parse(localStorage.getItem(PLACE_KEY) || '{}'); } catch { return {}; } };
const writePlaces = c => { try { localStorage.setItem(PLACE_KEY, JSON.stringify(c)); } catch { /* full */ } };

async function placeImage(id, query) {
  const cache = readPlaces();
  if (cache[id] !== undefined) return cache[id];
  try {
    const r = await fetch('https://api.pexels.com/v1/search?query=' + encodeURIComponent(query)
      + '&per_page=1&orientation=landscape', { headers: { Authorization: PEXELS_KEY } });
    if (!r.ok) return null;                       // rate-limited or down: try again next visit
    const d = await r.json();
    const p = d.photos && d.photos[0];
    /* `landscape` is 1200×627 — right for a card, a tenth of the original. */
    const url = p ? p.src.landscape : null;
    const credit = p ? { by: p.photographer, at: p.url } : null;
    cache[id] = url ? { url, credit } : null;     // a genuine empty result may cache
    writePlaces(cache);
    return cache[id];
  } catch { return null; }
}

/** Fill destination cards. Markup contract: data-place="<id>" data-q="<search>". */
export async function hydratePlaces(root = document) {
  const slots = [...root.querySelectorAll('[data-place]:not([data-place-done])')];
  for (const el of slots) {
    el.setAttribute('data-place-done', '1');
    const got = await placeImage(el.dataset.place, el.dataset.q || el.dataset.place);
    if (!got || !got.url) continue;
    const img = new Image();
    img.src = got.url; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    img.onload = () => {
      el.style.backgroundImage = `url("${got.url}")`;
      el.classList.add('has-img');
      /* Pexels asks for attribution; it rides in the corner of the card. */
      if (got.credit) {
        const c = document.createElement('a');
        c.className = 'px-credit'; c.href = got.credit.at; c.target = '_blank'; c.rel = 'noopener';
        c.textContent = got.credit.by;
        el.appendChild(c);
      }
    };
    img.onerror = () => {};
  }
}
