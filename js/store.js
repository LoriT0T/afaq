/* Āfāq — persistence. One localStorage key; everything derived lives in taste.js
 * and engine.js. Nothing computed is stored, so the model can never go stale
 * against the log that produced it. */

const KEY = 'afaq.v1';
const AXES_N = 10;   // kept in step with data.js AXES; only used to pad old custom titles

const BLANK = {
  v: 1,
  set: {
    start:null, hideAdv:[], region:'', bike:'', homeMins:0,
    onboarded:false, weather:false, lat:null, lon:null
  },
  custom:  [],  // user-added titles: {id,t,yr,k,len,x[8],why}
  watch:   [],  // {id,titleId,added,status,pred,score,mode,on,note,ep}
  rides:   [],  // {id,date,mi,mins,kinds[],conds[],drills[],road,note,near,bike}
  maint:   [],  // {id,date,what,mi,note}
  lic:     {},  // licenceId -> ISO date passed
  pursuits:[],  // {id,hobbyId,state,started,note,logs:[{date,mins,note}],marks:{rungKey:date}}
  trips:   [],  // {id,name,destId,place,from,to,status,budget,note,days[],debrief}
  places:  [],  // {id,name,country,date,rating,again,note}
  culled:  []   // {id,titleId,date,reason}
};

let S = load();

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return structuredClone(BLANK);
    return migrate(Object.assign(structuredClone(BLANK), JSON.parse(raw)));
  }catch{ return structuredClone(BLANK); }
}
function migrate(s){
  s.set = Object.assign(structuredClone(BLANK.set), s.set||{});
  for(const r of s.rides){ r.kinds ||= []; r.conds ||= []; r.drills ||= []; }
  for(const w of s.watch) w.mode ||= 'engaged';
  // AXES grew from 8 to 10 on 2026-08-22; pad any title the user scored before that
  for(const c of s.custom) while(c.x.length < AXES_N) c.x.push(.5);
  for(const p of s.pursuits){ p.logs ||= []; p.marks ||= {}; }
  for(const t of s.trips){ t.days ||= []; t.debrief ||= null; }
  return s;
}
export function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(S)); return true; }
  catch(e){ console.warn('save failed', e); return false; }
}
export function state(){ return S; }
export function reset(){ S = structuredClone(BLANK); save(); }
export function replace(o){ S = migrate(Object.assign(structuredClone(BLANK), o)); save(); }
export const uid = () => Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

/* ---------- dates ---------- */
export const iso = d => {
  const x = d ? new Date(d) : new Date();
  return new Date(x.getTime() - x.getTimezoneOffset()*6e4).toISOString().slice(0,10);
};
export const today = () => iso();
export const daysBetween = (a,b) => Math.round((new Date(b+'T00:00') - new Date(a+'T00:00')) / 864e5);
export const shift = (d,n) => iso(new Date(new Date(d+'T00:00').getTime() + n*864e5));
export const since = d => d ? daysBetween(d, today()) : null;
export const human = d => d ? new Date(d+'T00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : '';
export const humanFull = d => d ? new Date(d+'T00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'}) : '';
export function stamp(){ if(!S.set.start){ S.set.start = today(); save(); } return S.set.start; }

/* ---------- screen ---------- */
export function queue(titleId, pred){
  if(S.watch.some(w => w.titleId === titleId && w.status !== 'dropped')) return null;
  const w = { id:uid(), titleId, added:today(), status:'queue', pred:pred ?? null,
              score:null, mode:'engaged', on:null, note:'', ep:'' };
  S.watch.unshift(w); save(); return w;
}
export const watched  = () => S.watch.filter(w => w.status === 'done' && w.score != null);
export const inQueue  = () => S.watch.filter(w => w.status === 'queue');
export const watching = () => S.watch.filter(w => w.status === 'watching');
export const entry    = titleId => S.watch.find(w => w.titleId === titleId && w.status !== 'dropped');
export function startWatch(id){ const w = S.watch.find(x => x.id===id); if(w){ w.status='watching'; w.on=today(); save(); } }
export function rate(id, score, note, mode){
  const w = S.watch.find(x => x.id === id); if(!w) return;
  w.status = 'done'; w.score = Number(score); w.on = w.on || today();
  w.done = today(); if(note != null) w.note = note;
  if(mode) w.mode = mode;
  save();
}
/* Turning a recommendation down. It becomes a dropped watch entry, which is what makes
   it disappear from the pool — screenPool excludes anything already in `watch` — so the
   ranker immediately offers the next best and the list never runs dry. Recorded rather
   than merely hidden, because "not my taste" is a rating and the model should see it. */
export function skip(titleId, reason){
  if(S.watch.some(w => w.titleId === titleId)) return;
  const w = { id:uid(), titleId, added:today(), status:'dropped', pred:null,
              score:null, on:null, note:reason||'', ep:0 };
  S.watch.unshift(w);
  S.culled.unshift({ id:uid(), titleId, date:today(), reason:reason||'not my taste' });
  save(); return w;
}

export function cull(id, reason){
  const w = S.watch.find(x => x.id === id); if(!w) return;
  w.status = 'dropped';
  S.culled.unshift({ id:uid(), titleId:w.titleId, date:today(), reason:reason||'' });
  save();
}
export function addCustom(t){
  const c = { id:'c_'+uid(), t:'', yr:new Date().getFullYear(), k:'film', len:'',
              x:new Array(AXES_N).fill(.5), why:'', adv:[], custom:true, ...t };
  S.custom.unshift(c); save(); return c;
}

/* Load a set of already-watched titles. Additive and id-keyed: anything already in
 * the log is left alone, so this is re-runnable. `pred` stays null because these were
 * never predicted in advance — they teach the model, they do not test it. */
export function seedRatings(rows){
  let n = 0;
  for(const r of rows){
    if(S.watch.some(w => w.titleId === r.id)) continue;
    S.watch.push({ id:uid(), titleId:r.id, added:today(), status:'done', pred:null,
                   score:Number(r.score), mode:r.mode || 'engaged',
                   on:today(), done:today(), note:r.note || '', ep:'' });
    n++;
  }
  save(); return n;
}

/* ---------- ride ---------- */
export function logRide(r){
  const ride = { id:uid(), date:today(), mi:0, mins:0, kinds:[], conds:[], drills:[],
                 road:'', note:'', near:'', bike:S.set.bike||'', check:false, ...r };
  ride.mi = Number(ride.mi)||0; ride.mins = Number(ride.mins)||0;
  S.rides.unshift(ride); save(); return ride;
}
export const rides = () => S.rides;
export const ridesWith = drill => S.rides.filter(r => (r.drills||[]).includes(drill));
export function logMaint(m){
  const e = { id:uid(), date:today(), what:'', mi:0, note:'', ...m };
  S.maint.unshift(e); save(); return e;
}
export function setLic(id, on){ if(on) S.lic[id] = today(); else delete S.lic[id]; save(); }

/* ---------- craft ---------- */
export function adopt(hobbyId, st){
  let p = S.pursuits.find(x => x.hobbyId === hobbyId);
  if(p){ p.state = st; if(st!=='dropped' && !p.started) p.started = today(); }
  else { p = { id:uid(), hobbyId, state:st||'trial', started:today(), note:'', logs:[] }; S.pursuits.unshift(p); }
  save(); return p;
}
export const pursuit = hobbyId => S.pursuits.find(x => x.hobbyId === hobbyId);
export const activePursuits = () => S.pursuits.filter(p => p.state === 'active' || p.state === 'trial');
export function logPursuit(hobbyId, mins, note){
  const p = pursuit(hobbyId); if(!p) return null;
  p.logs.unshift({ date:today(), mins:Number(mins)||0, note:note||'' }); save(); return p;
}

/* A rung is CLAIMED, never accrued. Sessions gate when you may claim one — they
   never award it — because the whole objection this app has to hobby trackers is
   that they count instead of measure. Fifty hours of the same mistake is fifty
   hours of the same mistake. The date is kept rather than a boolean so the ladder
   can show how long each stage actually took, which is the only honest picture of
   how slow a craft really is. */
export function markRung(hobbyId, key, on){
  const p = pursuit(hobbyId); if(!p) return null;
  p.marks ||= {};
  if(on === false || (on === undefined && p.marks[key])) delete p.marks[key];
  else p.marks[key] = today();
  save(); return p;
}

/* ---------- travel ---------- */
export function addTrip(t){
  const trip = { id:uid(), name:'', destId:null, place:'', from:today(), to:shift(today(),3),
                 status:'idea', budget:0, note:'', days:[], debrief:null, ...t };
  S.trips.unshift(trip); save(); return trip;
}
export const trip = id => S.trips.find(t => t.id === id);
export const tripsBy = st => S.trips.filter(t => t.status === st);
export const upcoming = () => S.trips.filter(t => t.status !== 'done' && t.to >= today())
  .sort((a,b) => a.from.localeCompare(b.from));
export function tripDays(t){
  const out = []; if(!t.from || !t.to) return out;
  if(t.to < t.from){ [t.from, t.to] = [t.to, t.from]; save(); }   // a form can produce an inverted range
  const n = Math.max(0, daysBetween(t.from, t.to));
  for(let i = 0; i <= Math.min(n, 60); i++){
    const d = shift(t.from, i);
    out.push({ date:d, items:(t.days.find(x => x.date === d)?.items) || [] });
  }
  return out;
}
export function addItem(tripId, date, item){
  const t = trip(tripId); if(!t) return null;
  let day = t.days.find(d => d.date === date);
  if(!day){ day = { date, items:[] }; t.days.push(day); t.days.sort((a,b)=>a.date.localeCompare(b.date)); }
  const it = { id:uid(), t:'', kind:'see', txt:'', note:'', done:false, ...item };
  day.items.push(it); day.items.sort((a,b) => (a.t||'99').localeCompare(b.t||'99'));
  save(); return it;
}
export function killItem(tripId, date, itemId){
  const d = trip(tripId)?.days.find(x => x.date === date); if(!d) return;
  d.items = d.items.filter(i => i.id !== itemId); save();
}
export function toggleItem(tripId, date, itemId){
  const i = trip(tripId)?.days.find(x => x.date === date)?.items.find(y => y.id === itemId);
  if(i){ i.done = !i.done; save(); }
}
export function logPlace(p){
  const e = { id:uid(), name:'', country:'', date:today(), rating:0, again:null, note:'', ...p };
  S.places.unshift(e); save(); return e;
}

/* ---------- export / import ---------- */
export function exportJSON(){ return JSON.stringify(S, null, 2); }
export function importJSON(txt){
  const o = JSON.parse(txt);
  if(!o || typeof o !== 'object' || !Array.isArray(o.watch)) throw new Error('not an Āfāq export');
  replace(o); return true;
}
