/* Āfāq — domain logic. Gates, gaps, arbitration.
 *
 * The rule that runs through all of it: a level is earned by logged evidence,
 * never by reading about it. That is aimed squarely at the failure mode of
 * knowing a great deal and applying none of it. */

import * as S from './store.js';
import * as T from './taste.js';
import { CATALOGUE, AXES, DRILLS, HOBBIES, HDIMS, DESTS, TAXES, CONDITIONS, LICENCE } from './data.js';

/* ---------- titles ---------- */
export const allTitles = () => [...CATALOGUE, ...S.state().custom];
export const title = id => allTitles().find(t => t.id === id);

export function ratedSamples(){
  return S.watched().map(w => ({ w, t:title(w.titleId) })).filter(p => p.t)
    .map(p => ({ x:p.t.x, y:p.w.score, id:p.t.id, date:p.w.done || p.w.on }));
}
export function screenModel(){ return T.fit(ratedSamples(), AXES.length); }

export function screenCalibration(){
  return T.calibration(S.watched().map(w => ({ pred:w.pred, actual:w.score, date:w.done || w.on })));
}

/* Filter out anything already dealt with, plus anything carrying an advisory
 * the user has chosen to hide. */
export function screenPool(opts = {}){
  const st = S.state();
  const taken = new Set(st.watch.map(w => w.titleId));
  const hide = new Set(st.set.hideAdv || []);
  return allTitles().filter(t => {
    if(taken.has(t.id)) return false;
    if(opts.kind && t.k !== opts.kind) return false;
    if(hide.size && (t.adv || []).some(a => hide.has(a))) return false;
    return true;
  });
}

export function recommendScreen(opts = {}){
  const m = screenModel();
  return T.rank(screenPool(opts), m, ratedSamples(), opts).slice(0, opts.n || 12)
    .map(r => ({ ...r, why: T.explain(m, r.it.x, AXES) }));
}

/* The cold-start set: maximally spread titles, so the first handful of ratings
 * identify the weights instead of confirming each other. */
export function calibrationSet(k = 10){
  return T.spread(screenPool(), k);
}

/* A queue entry that has sat unwatched long enough to be a decision rather than
 * an intention. Watchlists only ever grow unless something forces the question. */
export const STALE_DAYS = 45;
export function staleQueue(){
  return S.inQueue().filter(w => (S.since(w.added) ?? 0) >= STALE_DAYS)
    .sort((a,b) => a.added.localeCompare(b.added));
}

/* =====================================================================
   RIDE
   ===================================================================== */
const ADVERSE = ['wet','cold','night','wind','fog'];

function qualifying(drill){
  const g = drill.gate || {};
  return S.rides().filter(r => {
    if(g.key === 'check') return !!r.check;
    if(!(r.drills || []).includes(drill.id)) return false;
    if(g.kind === 'adverse') return (r.conds || []).some(c => ADVERSE.includes(c));
    if(g.kind) return (r.kinds || []).includes(g.kind);
    if(g.mins) return (r.mins || 0) >= g.mins;
    if(g.miles) return (r.mi || 0) >= g.miles;
    return true;
  });
}

export function drillState(drill){
  const g = drill.gate || {};
  const q = qualifying(drill);
  const need = g.rides || g.sessions || g.logs || 1;
  const have = g.logs ? S.state().maint.length : q.length;
  let sub = null;
  if(g.wet){
    const wet = q.filter(r => (r.conds || []).includes('wet')).length;
    sub = { n:wet, need:g.wet, label:'in the wet' };
  }
  const met = have >= need && (!sub || sub.n >= sub.need);
  return { drill, have, need, sub, met, pct: Math.min(1, have / need),
           last: q[0]?.date || null };
}

export function ladder(){
  const rows = DRILLS.slice().sort((a,b) => a.ord - b.ord).map(drillState);
  const next = rows.find(r => !r.met) || null;
  const done = rows.filter(r => r.met).length;
  const stages = [
    [0,  'Untested',   'Nothing practised yet. Miles do not count here.'],
    [1,  'Green',      'The machine skills are starting. Slow control before anything fast.'],
    [4,  'Competent',  'You can place the bike where you want it. Vision is the next multiplier.'],
    [7,  'Consolidated','The system is running most of the time. Now make it run when it is raining.'],
    [10, 'Advanced-ready','You have the evidence to get real value out of IAM or RoSPA.'],
    [13, 'Systematic', 'Every drill on the curriculum has logged evidence behind it.']
  ];
  const st = stages.filter(s => done >= s[0]).pop();
  return { rows, next, done, total:rows.length, stage:{ name:st[1], say:st[2] } };
}

export function rideStats(){
  const rs = S.rides();
  const mi = rs.reduce((s,r) => s + (r.mi||0), 0);
  const mins = rs.reduce((s,r) => s + (r.mins||0), 0);
  const last30 = rs.filter(r => (S.since(r.date) ?? 999) <= 30);
  const near = rs.filter(r => (r.near||'').trim()).length;
  // `count`, not `n` — CONDITIONS entries already use `n` for the display name,
  // and spreading a count over it silently replaced every label with a number.
  const cov = CONDITIONS.map(c => ({
    ...c, count: rs.filter(r => (r.conds||[]).includes(c.k)).length
  }));
  const covered = cov.filter(c => c.count >= 3).length;
  return {
    n:rs.length, mi, hours:mins/60,
    mi30:last30.reduce((s,r) => s + (r.mi||0), 0), n30:last30.length,
    near, nearPer100: mi > 0 ? near / (mi/100) : null,
    cov, covered, covTotal:CONDITIONS.length,
    longest: rs.reduce((m,r) => Math.max(m, r.mi||0), 0),
    last: rs[0]?.date || null
  };
}

/* How much a riding destination is worth recommending depends on whether the
 * rider is ready for it. Alpine passes are a bad recommendation at stage one. */
export function riderReadiness(){
  const l = ladder();
  return Math.min(1, (l.done / l.total) * .7 + (S.state().lic.a || S.state().lic.a2 ? .3 : 0));
}

export const licenceStage = () => {
  const l = S.state().lic;
  return [...LICENCE].reverse().find(x => l[x.id]) || null;
};

/* =====================================================================
   CRAFT — a portfolio is judged on what it SPANS, not on how much of it
   there is. Five variations on the same shape is one hobby.
   ===================================================================== */
const WANT = { ar:'span', so:'span', ki:'span', ge:'high', rk:'report', wx:'low', cp:'report', po:'high' };

/* Motorcycling counts as part of the portfolio the moment there are rides logged,
 * whether or not it was ever adopted as a pursuit. The app already knows he rides;
 * making him tick a box to say so would produce a gap analysis that ignores the
 * largest thing in it. */
export function portfolio(){
  const ps = S.activePursuits().map(p => HOBBIES.find(h => h.id === p.hobbyId)).filter(Boolean);
  const moto = HOBBIES.find(h => h.id === 'moto');
  if(S.rides().length && !ps.some(h => h.id === 'moto')) ps.unshift(moto);
  return ps;
}

export function gaps(){
  const ps = portfolio();
  return HDIMS.map((d,j) => {
    const want = WANT[d.k];
    if(!ps.length) return { dim:d, j, lo:null, hi:null, want, open: want !== 'report',
                            say:'Nothing logged yet.', loBy:null, hiBy:null };
    const loBy = ps.reduce((a,b) => b.x[j] < a.x[j] ? b : a);
    const hiBy = ps.reduce((a,b) => b.x[j] > a.x[j] ? b : a);
    const lo = loBy.x[j], hi = hiBy.x[j];
    let open = false, say = '';
    if(want === 'span'){
      if(hi - lo < .38){
        open = true;
        say = hi < .5 ? `Everything you do sits at the “${d.lo}” end.`
                      : `Everything you do sits at the “${d.hi}” end.`;
      } else say = `${loBy.n} to ${hiBy.n}.`;
    }
    else if(want === 'high'){
      if(hi < .6){ open = true; say = `Nothing you do is meaningfully “${d.hi}”.`; }
      else say = `Covered by ${hiBy.n}.`;
    }
    else if(want === 'low'){
      if(lo > .45){ open = true; say = `Everything you do is “${d.hi}”. One thing should not be.`; }
      else say = `${loBy.n} survives it.`;
    }
    else say = `${lo.toFixed(1)}–${hi.toFixed(1)} — highest is ${hiBy.n}.`;
    return { dim:d, j, lo, hi, open, say, want, loBy, hiBy };
  });
}

/* Score a candidate by how much of the open gap it actually closes. Adjacent
 * pursuits and the deliberate anti-recommendation are pushed down, not hidden —
 * the argument for skipping them is more useful than their absence. */
export function recommendHobbies(n = 8){
  const have = new Set(S.state().pursuits.filter(p => p.state !== 'dropped').map(p => p.hobbyId));
  const g = gaps();
  const ps = portfolio();
  return HOBBIES.filter(h => !have.has(h.id) && !h.anchor).map(h => {
    let fill = 0; const closes = [];
    for(const gap of g){
      if(!gap.open) continue;
      const v = h.x[gap.j];
      let c = 0;
      if(gap.want === 'high') c = Math.max(0, v - (gap.hi ?? 0));
      else if(gap.want === 'low') c = Math.max(0, (gap.lo ?? 1) - v);
      else if(gap.want === 'span'){
        const mid = ((gap.lo ?? .5) + (gap.hi ?? .5)) / 2;
        c = Math.max(0, Math.abs(v - mid) - .2);
      }
      if(c > .08){ fill += c; closes.push({ dim:gap.dim, c }); }
    }
    const dupe = ps.length ? Math.max(...ps.map(p => 1 - Math.hypot(...p.x.map((v,j) => v - h.x[j])) / Math.sqrt(HDIMS.length))) : 0;
    let score = fill * 2.2 + h.ceil * .8 - dupe * .9;
    if(h.adjacent) score -= .8;
    if(h.anti) score -= 1.6;
    return { h, score, fill, closes:closes.sort((a,b) => b.c - a.c).slice(0,3) };
  }).sort((a,b) => b.score - a.score).slice(0, n);
}

/* =====================================================================
   TRAVEL
   ===================================================================== */
const MON = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const monthsOf = (() => {
  const cache = {};
  return when => {
    if(cache[when]) return cache[when];
    const set = new Set();
    for(const part of String(when).toLowerCase().split(',')){
      const found = [...part.matchAll(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/g)].map(m => MON.indexOf(m[1]));
      if(found.length >= 2){
        let [a,b] = [found[0], found[found.length-1]];
        for(let i = 0; i < 12; i++){ const m = (a+i)%12; set.add(m); if(m === b) break; }
      } else found.forEach(m => set.add(m));
    }
    return cache[when] = set;
  };
})();
export const inSeason = (dest, month) => monthsOf(dest.when).has(month ?? new Date().getMonth());

export function travelSamples(){
  return S.state().trips.filter(t => t.destId && t.debrief && t.debrief.rating > 0)
    .map(t => { const d = DESTS.find(x => x.id === t.destId); return d ? { x:d.x, y:t.debrief.rating, date:t.to } : null; })
    .filter(Boolean);
}
export const travelModel = () => T.fit(travelSamples(), TAXES.length);

export function recommendDests(opts = {}){
  const st = S.state();
  const month = opts.month ?? new Date().getMonth();
  const m = travelModel();
  const warm = m.n >= 5;
  const ready = riderReadiness();
  const been = new Set(st.trips.filter(t => t.status === 'done').map(t => t.destId));
  return DESTS.filter(d => !opts.region || d.region === opts.region)
    .filter(d => !opts.maxDays || d.days <= opts.maxDays)
    .map(d => {
      const season = inSeason(d, month);
      const ride = (d.ride / 3) * ready;
      const taste = warm ? (T.predict(m, d.x) - m.b) : 0;
      let score = (season ? 2 : 0) + ride * 1.8 + taste * .8 - (d.cost - 1) * .35;
      if(been.has(d.id)) score -= 3;
      return { d, score, season, ride, taste, been:been.has(d.id) };
    }).sort((a,b) => b.score - a.score).slice(0, opts.n || 10);
}

/* =====================================================================
   THE ONE THING — a list is a decision handed back to you. Exactly one
   answer comes out of here, and the rules that produce it are in the open.
   ===================================================================== */
export function theOneThing(){
  const st = S.state();
  const now = new Date();

  if(!st.set.onboarded)
    return { d:'screen', k:'Start here', h:'Rate ten things you have already seen',
      why:'The model cannot say anything useful about you until it has seen you disagree with it. The calibration set is chosen to be as spread out as possible, so ten ratings there are worth forty random ones.',
      go:'screen', act:'calibrate' };

  const live = st.trips.find(t => t.from <= S.today() && t.to >= S.today() && t.status !== 'idea');
  if(live){
    const day = live.days.find(d => d.date === S.today());
    const next = (day?.items || []).find(i => !i.done);
    return { d:'travel', k:'Today, on the ground',
      h: next ? next.txt || next.t : `${live.name} — nothing planned for today`,
      why: next ? `Next on the itinerary${next.t ? ` at ${next.t}` : ''}. Everything else on the list can wait until this is done.`
                : 'An empty day inside a live trip is either rest you chose or a gap you did not notice. Decide which.',
      go:'travel', act:'trip', id:live.id };
  }

  const soon = S.upcoming()[0];
  if(soon && (S.since(soon.from) ?? -99) >= -21 && soon.status !== 'idea'){
    const days = S.tripDays(soon);
    const empty = days.filter(d => !d.items.length).length;
    if(empty > days.length / 2)
      return { d:'travel', k:'Leaving soon', h:`${soon.name} is in ${-S.since(soon.from)} days and ${empty} of ${days.length} days are empty`,
        why:'An itinerary written the night before is a list of whatever was easiest to find. The good things need booking.',
        go:'travel', act:'trip', id:soon.id };
  }

  const stale = staleQueue();
  if(stale.length >= 3){
    const t = title(stale[0].titleId);
    return { d:'screen', k:'The queue is a decision you keep not making',
      h:`${stale.length} things have sat unwatched for over ${STALE_DAYS} days`,
      why:`Starting with <b>${t?.t || 'the oldest'}</b>. Watch it or kill it with a reason — a list that only ever grows is not a plan.`,
      go:'screen', act:'cull' };
  }

  const l = ladder(), rs = rideStats();
  const month = now.getMonth();
  const ridingSeason = month >= 2 && month <= 10;
  if(l.next && ridingSeason && (rs.n30 === 0 || !l.next.last || (S.since(l.next.last) ?? 999) > 30))
    return { d:'ride', k:'Next on the ladder', h:l.next.drill.n,
      why:`${l.next.drill.is} You have <b>${l.next.have} of ${l.next.need}</b> logged. ${rs.n30 === 0 ? 'Nothing at all in the last thirty days.' : 'Nothing on this drill in the last thirty days.'}`,
      go:'ride', act:'drill', id:l.next.drill.id };

  const trial = st.pursuits.find(p => p.state === 'trial' &&
    (S.since(p.logs[0]?.date || p.started) ?? 0) >= 14);
  if(trial){
    const h = HOBBIES.find(x => x.id === trial.hobbyId);
    return { d:'craft', k:'A trial that has stopped', h:`${h?.n || 'A pursuit'} — two weeks with nothing logged`,
      why:'A trial that runs indefinitely is not a trial. Commit to it or drop it; both are answers, drift is not.',
      go:'craft', act:'pursuit', id:trial.hobbyId };
  }

  const m = screenModel();
  if(m.n < 12)
    return { d:'screen', k:'The model is still cold', h:`${m.n} of 12 ratings in`,
      why:'Below about twelve ratings the axis weights are mostly the prior, and every prediction is the average wearing a number. Rate things you have already seen — it costs nothing and it is the fastest way through.',
      go:'screen', act:'calibrate' };

  const q = S.inQueue();
  if(q.length){
    const w = q.reduce((b,x) => (x.pred ?? 0) > (b.pred ?? 0) ? x : b, q[0]);
    const t = title(w.titleId);
    return { d:'screen', k:'Top of the queue', h:t?.t || 'Something you queued',
      why:`Predicted <b>${(w.pred ?? 0).toFixed(1)}</b> for you — the highest thing you have waiting. ${t?.why || ''}`,
      go:'screen', act:'watch', id:w.id };
  }

  const g = gaps().filter(x => x.open);
  if(g.length){
    const rec = recommendHobbies(1)[0];
    if(rec) return { d:'craft', k:'The gap in the portfolio', h:rec.h.n,
      why:`${g[0].say} ${rec.h.why}`, go:'craft', act:'hobby', id:rec.h.id };
  }

  const rec = recommendScreen({ n:1 })[0];
  return { d:'screen', k:'Best guess', h:rec?.it.t || 'Nothing queued',
    why: rec ? `Predicted ${rec.pred.toFixed(1)}. ${rec.it.why}` : 'Everything in the catalogue is dealt with. Add something of your own.',
    go:'screen', act:'watch' };
}

/* =====================================================================
   WEATHER — opt-in, no key, coordinates rounded to ~11 km before they
   leave the device. Off by default; the app is fully usable without it.
   ===================================================================== */
let WX = null;
export const weather = () => WX;
export async function fetchWeather(){
  const s = S.state().set;
  if(!s.weather || s.lat == null || s.lon == null) return null;
  const la = Math.round(s.lat*10)/10, lo = Math.round(s.lon*10)/10;
  try{
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}`
      + `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max`
      + `&forecast_days=3&timezone=auto`;
    const r = await fetch(u); if(!r.ok) return null;
    const j = await r.json();
    WX = (j.daily?.time || []).map((d,i) => ({
      date:d, tmax:j.daily.temperature_2m_max[i], tmin:j.daily.temperature_2m_min[i],
      rain:j.daily.precipitation_probability_max[i], wind:j.daily.wind_speed_10m_max[i]
    }));
    return WX;
  }catch{ return null; }
}
export function rideVerdict(day){
  if(!day) return null;
  const bad = [];
  if(day.rain >= 60) bad.push('rain likely');
  if(day.tmin <= 4) bad.push('cold tyres and possible ice');
  if(day.wind >= 45) bad.push('strong wind');
  if(!bad.length) return { ok:true, say:`${Math.round(day.tmax)}°C, ${day.rain}% rain. Good day for it.` };
  return { ok:false, say:`${bad.join(', ')}. Rideable, but it is a wet-weather drill, not a fast one.` };
}
