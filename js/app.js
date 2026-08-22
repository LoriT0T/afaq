/* Āfāq — views + router. */
import * as S from './store.js';
import * as T from './taste.js';
import * as E from './engine.js';
import { APP, AXES, ADVISORIES, CATALOGUE, DRILLS, IPSGA, LICENCE, RISK, ROADS,
         CONDITIONS, ROADKINDS, HOBBIES, HDIMS, DESTS, TAXES, ITEMKINDS,
         SEED, ATTENTION } from './data.js';

const $ = (s,r=document) => r.querySelector(s);
const app = $('#app'), nav = $('#nav');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n1 = x => (Math.round(x*10)/10).toFixed(1);
const n0 = x => Math.round(x).toString();

const VIEWS = [
  { id:'today',  g:'◐', l:'Today'  },
  { id:'screen', g:'▣', l:'Screen' },
  { id:'ride',   g:'⚡', l:'Ride'   },
  { id:'craft',  g:'✦', l:'Craft'  },
  { id:'travel', g:'✈', l:'Travel' },
  { id:'model',  g:'◈', l:'Model'  }
];
let view = 'today', tripId = null;

/* ---------- ui atoms ---------- */
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .3s'; }, 1700);
  setTimeout(() => t.remove(), 2100);
}
function sheet(title, sub, html){
  close();
  const el = document.createElement('div');
  el.className = 'sheet'; el.id = 'sheet';
  el.innerHTML = `<div class="in"><h3>${esc(title)}</h3>${sub?`<div class="sh-sub">${sub}</div>`:''}${html}</div>`;
  el.addEventListener('click', e => { if(e.target === el) close(); });
  document.body.appendChild(el);
  const f = el.querySelector('input:not([type=checkbox]),textarea,select');
  if(f) setTimeout(() => f.focus(), 60);
  return el;
}
const close = () => $('#sheet')?.remove();

const kindPill = k => `<span class="kind" data-k="${k}">${k}</span>`;
const chipsetHTML = (items, sel, act, key='k') => `<div class="chipset">` + items.map(i =>
  `<button class="chip${sel.includes(i[key])?' on':''}" data-act="${act}" data-k="${esc(i[key])}">${esc(i.n)}</button>`).join('') + `</div>`;

function radar(dims, series){
  /* R and the label radius together must stay inside the viewBox — at R=108 the
   * labels sat at x = -2..262 and the first and last letters were cut off. */
  const R = 86, C = 130, N = dims.length;
  const pt = (j, v) => {
    const a = -Math.PI/2 + j * 2*Math.PI/N;
    return [C + Math.cos(a)*R*v, C + Math.sin(a)*R*v];
  };
  const poly = vals => vals.map((v,j) => pt(j, Math.max(.04, v)).map(n => n.toFixed(1)).join(',')).join(' ');
  const rings = [.25,.5,.75,1].map(r =>
    `<polygon class="grid" points="${dims.map((_,j) => pt(j,r).map(n=>n.toFixed(1)).join(',')).join(' ')}"/>`).join('');
  const axes = dims.map((_,j) => `<line class="axis" x1="${C}" y1="${C}" x2="${pt(j,1)[0].toFixed(1)}" y2="${pt(j,1)[1].toFixed(1)}"/>`).join('');
  const labs = dims.map((d,j) => {
    const [x,y] = pt(j, 1.30);
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${esc(d.n)}</text>`;
  }).join('');
  const shapes = series.map(s => `<polygon class="${s.cls}" points="${poly(s.vals)}"/>`).join('');
  /* Horizontal slack in the viewBox: the side labels are centred at x = C ± R*1.3
   * and half the text width still overhangs a 0–260 box. */
  return `<svg class="radar" viewBox="-20 0 300 260">${rings}${axes}${shapes}${labs}</svg>`;
}

/* ---------- actions ---------- */
const ACTS = {};
const on = (name, fn) => { ACTS[name] = fn; };
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if(!el) return;
  const fn = ACTS[el.dataset.act]; if(!fn) return;
  e.preventDefault(); fn(el.dataset, el);
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-chg]'); if(!el) return;
  ACTS[el.dataset.chg]?.(el.dataset, el);
});
on('close', close);
on('go', d => { view = d.to; tripId = d.id || null; location.hash = d.to; close(); render(); });

/* ---------- render ---------- */
function render(){
  S.stamp();
  const fn = ({ today:vToday, screen:vScreen, ride:vRide, craft:vCraft,
                travel:vTravel, trip:vTrip, model:vModel })[view] || vToday;
  app.innerHTML = `<div class="wrap view">${fn()}</div>`;
  const navView = view === 'trip' ? 'travel' : view;
  nav.innerHTML = VIEWS.map(v =>
    `<button data-act="go" data-to="${v.id}" class="${v.id===navView?'on':''}"><span class="g">${v.g}</span><span class="l">${v.l}</span></button>`).join('');
  window.scrollTo(0,0);
}
addEventListener('hashchange', () => { const h = location.hash.slice(1); if(h && h !== view){ view = h; render(); } });

/* =====================================================================
   TODAY
   ===================================================================== */
function vToday(){
  const one = E.theOneThing();
  const m = E.screenModel(), cal = E.screenCalibration();
  const l = E.ladder(), rs = E.rideStats();
  const g = E.gaps().filter(x => x.open).length;
  const up = S.upcoming()[0];
  const d = new Date();
  const wx = E.weather();
  const day = wx?.find(x => x.date === S.today());
  const v = day ? E.rideVerdict(day) : null;

  return `
  <div class="masthead">
    <div class="kicker">${esc(d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'}))}</div>
    <h1>${APP.name}</h1>
    <div class="ar">${APP.ar}</div>
    <div class="sub">${esc(APP.line)}</div>
  </div>

  <div class="one" data-d="${one.d}">
    <div class="k">${esc(one.k)}</div>
    <h3>${esc(one.h)}</h3>
    <div class="why">${one.why}</div>
    <div class="btns" style="margin-top:13px">
      <button class="btn pri" data-act="go" data-to="${one.go}" data-id="${one.id||''}">Go</button>
    </div>
  </div>
  <div class="hint">One answer, not four lists. The rules that produced it are in <b>Model → How the one thing is chosen</b>.</div>

  ${v ? `<div class="card ${v.ok?'acc':''}" data-d="ride" style="margin-top:14px">
    <div class="row"><div class="grow"><h4>Today’s riding weather</h4><div class="meta">${esc(v.say)}</div></div></div></div>` : ''}

  <div class="sect"><div class="hd"><h3>The four</h3><span class="aux">tap to open</span></div>
    <div class="split">
      <button class="stat" data-act="go" data-to="screen" style="text-align:left;width:100%" data-d="screen">
        <div class="k">Screen · model</div>
        <div class="v" style="color:var(--scr)">${m.n}</div>
        <div class="u">${esc(T.confidence(m.n).label.toLowerCase())}${cal.mae!=null?` · off by ${n1(cal.mae)}`:''}</div></button>
      <button class="stat" data-act="go" data-to="ride" style="text-align:left;width:100%" data-d="ride">
        <div class="k">Ride · ladder</div>
        <div class="v" style="color:var(--rid)">${l.done}<span style="font-size:14px;color:var(--tx-3)">/${l.total}</span></div>
        <div class="u">${esc(l.stage.name)} · ${n0(rs.mi)} mi</div></button>
      <button class="stat" data-act="go" data-to="craft" style="text-align:left;width:100%" data-d="craft">
        <div class="k">Craft · pursuits</div>
        <div class="v" style="color:var(--crf)">${E.portfolio().length}</div>
        <div class="u">${g} open gap${g===1?'':'s'}</div></button>
      <button class="stat" data-act="go" data-to="travel" style="text-align:left;width:100%" data-d="travel">
        <div class="k">Travel · next</div>
        <div class="v" style="color:var(--trv)">${up ? -(S.since(up.from)) : '—'}</div>
        <div class="u">${up ? esc(up.name) : 'nothing planned'}</div></button>
    </div>
  </div>

  <div class="sect"><div class="hd"><h3>Why this app exists</h3></div>
    <div class="card"><div class="body">${esc(APP.why)}</div>
      <div class="body" style="color:var(--acc)">${esc(APP.verseEn)}</div></div>
  </div>`;
}

/* =====================================================================
   SCREEN
   ===================================================================== */
let sKind = 'anime';   // his actual medium; the chips override it
on('s-kind', d => { sKind = d.k === sKind ? '' : d.k; render(); });

function ttRow(t, pred, why, entry){
  const w = entry;
  const days = w && w.status === 'queue' ? S.since(w.added) : null;
  return `<div class="tt">
    <div class="pr">${pred != null ? n1(pred) : '—'}<small>${w && w.score != null ? 'RATED '+n1(w.score) : 'PRED'}</small></div>
    <div>
      <div class="nm">${esc(t.t)} <span class="yr">${t.yr}</span></div>
      <div class="sb">${kindPill(t.k)} ${esc(t.len||'')}${(t.adv||[]).length?` · ${esc(t.adv.join(', '))}`:''}${days!=null?` · waiting ${days}d`:''}</div>
      <div class="rz">${esc(t.why||'')}</div>
      ${why && why.length ? `<div class="sb" style="color:var(--acc);margin-top:5px">${why.map(x =>
        `${esc(x.n)} ${x.pull>0?'+':'−'}${n1(Math.abs(x.pull))}`).join(' · ')}</div>` : ''}
    </div>
    <div class="go">
      ${!w ? `<button class="btn sm" data-act="queue" data-id="${t.id}">Queue</button>` : ''}
      ${w && w.status === 'queue' ? `<button class="btn sm pri" data-act="rate-open" data-id="${w.id}">Rate</button>
        <button class="btn sm ghost" data-act="cull-open" data-id="${w.id}">Kill</button>` : ''}
      ${w && w.status === 'watching' ? `<button class="btn sm pri" data-act="rate-open" data-id="${w.id}">Rate</button>` : ''}
    </div>
  </div>`;
}

function vScreen(){
  const m = E.screenModel(), conf = T.confidence(m.n), cal = E.screenCalibration();
  const st = S.state();
  const q = S.inQueue(), wing = S.watching(), stale = E.staleQueue();
  const recs = E.recommendScreen({ kind:sKind, n:10 });
  const rat = E.rationed();
  const cold = m.n < 12;
  const calSet = cold ? E.calibrationSet(10).filter(t => !st.watch.some(w => w.titleId === t.id)) : [];
  const kinds = [{k:'anime',n:'Anime'},{k:'film',n:'Film'},{k:'tv',n:'TV'},{k:'doc',n:'Documentary'}];

  return `
  <h2 class="page">Screen</h2>
  <p class="lede">${CATALOGUE.length} titles on ${AXES.length} axes. <b>Genre is deliberately not one of them</b> — “anime” contains both Mushishi and Slime-shaped nation-building, so the label predicts nothing. <b>Sincerity</b> and <b>Progression</b> were added on 22 August because the first eight could not separate your 9s from your 5s and those two can. The number on the left is what the model expects you to give it, decided before you watch.</p>

  <div class="card" data-d="screen">
    <div class="row"><div class="grow"><h4>${esc(conf.label)} — ${m.n} rating${m.n===1?'':'s'}</h4>
      <div class="meta">${cal.n ? `${cal.n} prospective checks · off by ${n1(cal.mae)} on average` : 'no prospective checks yet'}</div></div>
      <button class="btn sm" data-act="go" data-to="model">Model</button></div>
    <div class="body">${esc(conf.say)}</div>
  </div>

  ${S.state().watch.length === 0 ? `<div class="card acc" data-d="screen" style="margin-top:12px">
    <h4>Start from what you already told me</h4>
    <div class="body">Ten titles, scored from your own words — Re:Zero at 10 for three rewatches, Suits and Billions at 5 for “too serious, not fun”. Arrested Development and Sunny load as <b>comfort</b> watches and are held out of the fit.</div>
    <div class="btns wide" style="margin-top:11px"><button class="btn pri" data-act="seed">Load the ten</button></div></div>` : ''}

  ${cold && calSet.length ? `<div class="sect" data-d="screen"><div class="hd"><h3>Calibration set</h3><span class="aux">${m.n}/12</span></div>
    <p class="lede">Ten anime picked to sit as far apart from each other as possible in the ${AXES.length} axes. Rate any you have already seen. Ten ratings here are worth roughly forty random ones — near-identical titles teach the model nothing, and <b>the weights only sharpen in the region your ratings occupy</b>, which is why these are anime rather than a spread of the whole shelf.</p>
    <div class="card">${calSet.map(t => `<div class="tt">
      <div class="pr" style="font-size:11px;line-height:1.3;padding-top:4px">${esc(t.k)}</div>
      <div><div class="nm">${esc(t.t)} <span class="yr">${t.yr}</span></div>
        <div class="sb">${esc(t.len||'')}${(t.adv||[]).length?` · ${esc(t.adv.join(', '))}`:''}</div></div>
      <div class="go"><button class="btn sm pri" data-act="seen" data-id="${t.id}">Seen it</button>
        <button class="btn sm ghost" data-act="queue" data-id="${t.id}">Queue</button></div></div>`).join('')}</div>
  </div>` : ''}

  ${wing.length ? `<div class="sect"><div class="hd"><h3>Watching</h3></div>
    <div class="card">${wing.map(w => { const t = E.title(w.titleId); return t ? ttRow(t, w.pred, null, w) : ''; }).join('')}</div></div>` : ''}

  ${q.length ? `<div class="sect"><div class="hd"><h3>Queue</h3><span class="aux">${q.length}${stale.length?` · ${stale.length} stale`:''}</span></div>
    ${stale.length ? `<p class="lede">${stale.length} of these have been waiting over ${E.STALE_DAYS} days. <b>Watch it or kill it with a reason.</b> A queue that only ever grows is not a plan, it is a way of avoiding a decision.</p>` : ''}
    <div class="card">${q.sort((a,b) => (b.pred??0)-(a.pred??0)).map(w => { const t = E.title(w.titleId); return t ? ttRow(t, w.pred, null, w) : ''; }).join('')}</div></div>` : ''}

  <div class="sect" data-d="screen"><div class="hd"><h3>Recommended</h3>
    <span class="aux">${m.n < 12 ? 'exploring' : 'predicting'}</span></div>
    ${chipsetHTML(kinds, sKind?[sKind]:[], 's-kind')}
    <p class="hint">Ranked by predicted score <b>plus an exploration bonus</b> that fades as the model warms up — while it is cold it will deliberately offer things unlike what you have rated, because an item close to what it already knows cannot move the weights. Defaulting to <b>anime</b>: that is what you actually watch, and a list that ignores it is a list you will not use.</p>
    <div class="card" style="margin-top:10px">${recs.length ? recs.map(r => ttRow(r.it, r.pred, r.why, null)).join('')
      : '<div class="empty">Nothing left in the catalogue for this filter.</div>'}</div>
    <div class="btns wide" style="margin-top:10px"><button class="btn" data-act="custom-open">Add your own title</button></div>
  </div>

  <div class="sect" data-d="screen"><div class="hd"><h3>The rationed slots</h3><span class="aux">by your own rate</span></div>
    <p class="lede">You watch roughly <b>one film every four months</b> and <b>one series a year</b>. That is a budget, not a taste — so it is handled here rather than being smuggled into the model as an axis. One pick each, not a list.</p>
    <div class="stack">${Object.entries(rat).map(([k,r]) => `<div class="card" data-d="screen">
      <div class="row top"><div class="grow">
        <div class="sb" style="margin-bottom:5px">${kindPill(k)} <span style="color:var(--tx-3);font-size:11.5px">${k==='film'?'your next film — one every 4 months':k==='tv'?'your next series — one a year':'if you want something shorter'}</span></div>
        <h4>${esc(r.it.t)} <span class="yr" style="color:var(--tx-3);font-weight:400">${r.it.yr}</span></h4>
        <div class="meta">${esc(r.it.len||'')}${(r.it.adv||[]).length?` · ${esc(r.it.adv.join(', '))}`:''}</div></div>
        <div class="pr" style="font-family:var(--mono);font-size:17px;color:var(--acc)">${n1(r.pred)}</div></div>
      <div class="body">${esc(r.it.why)}</div>
      <div class="btns" style="margin-top:11px"><button class="btn sm" data-act="queue" data-id="${r.it.id}">Queue it</button></div>
    </div>`).join('')}</div>
  </div>

  ${S.watched().length ? `<div class="sect"><div class="hd"><h3>Rated</h3><span class="aux">${S.watched().length}</span></div>
    <div class="card">${S.watched().sort((a,b)=>(b.done||'').localeCompare(a.done||'')).slice(0,30).map(w => {
      const t = E.title(w.titleId); if(!t) return '';
      const err = w.pred != null ? w.score - w.pred : null;
      return `<div class="tt"><div class="pr">${n1(w.score)}<small>${w.pred!=null?`PRED ${n1(w.pred)}`:'—'}</small></div>
        <div><div class="nm">${esc(t.t)} <span class="yr">${t.yr}</span></div>
          <div class="sb">${kindPill(t.k)} ${esc(S.human(w.done||w.on))}${err!=null?` · model was ${Math.abs(err)<.5?'right':(err>0?'too harsh':'too generous')} by ${n1(Math.abs(err))}`:''}</div>
          ${w.note?`<div class="rz">${esc(w.note)}</div>`:''}</div><div class="go"></div></div>`;
    }).join('')}</div></div>` : ''}

  ${E.comfortWatches().length ? `<div class="sect"><div class="hd"><h3>Comfort watches</h3>
    <span class="aux">held out of the fit</span></div>
    <p class="lede">Logged, counted, and <b>deliberately excluded from the model</b>. A rewatch here measures what the show is <em>for</em> — something to put on in a rut — not whether you like that kind of thing. Fitting on it would teach the model the opposite of the truth.</p>
    <div class="card">${E.comfortWatches().map(w => { const t = E.title(w.titleId); if(!t) return '';
      return `<div class="tt"><div class="pr" style="color:var(--tx-2)">${n1(w.score)}<small>COMFORT</small></div>
        <div><div class="nm" style="color:var(--tx-2)">${esc(t.t)} <span class="yr">${t.yr}</span></div>
        ${w.note?`<div class="sb">${esc(w.note)}</div>`:''}</div>
        <div class="go"><button class="btn sm ghost" data-act="mode-flip" data-id="${w.id}">Count it</button></div></div>`;
    }).join('')}</div></div>` : ''}

  <div class="sect"><div class="hd"><h3>${esc(ATTENTION.t)}</h3></div>
    <div class="card flat"><div class="body">${esc(ATTENTION.body)}</div>
      <div class="body" style="color:var(--acc)">${esc(ATTENTION.point)}</div>
      <div class="body">${esc(ATTENTION.close)}</div></div>
  </div>

  ${st.culled.length ? `<div class="sect"><div class="hd"><h3>Killed</h3><span class="aux">${st.culled.length}</span></div>
    <div class="card">${st.culled.slice(0,12).map(c => { const t = E.title(c.titleId); return `
      <div class="tt"><div class="pr" style="color:var(--tx-3)">✕</div>
      <div><div class="nm" style="color:var(--tx-2)">${esc(t?.t||'—')}</div>
      <div class="sb">${esc(S.human(c.date))}${c.reason?` · ${esc(c.reason)}`:''}</div></div><div class="go"></div></div>`; }).join('')}</div></div>` : ''}`;
}

on('queue', d => {
  const t = E.title(d.id); if(!t) return;
  S.queue(t.id, T.predict(E.screenModel(), t.x));
  toast('Queued — prediction frozen'); render();
});
on('seen', d => {
  const t = E.title(d.id); if(!t) return;
  const w = S.queue(t.id, T.predict(E.screenModel(), t.x));
  if(w) rateSheet(w.id, t, true);
});
on('rate-open', d => {
  const w = S.state().watch.find(x => x.id === d.id); if(!w) return;
  rateSheet(w.id, E.title(w.titleId), false);
});
function rateSheet(id, t, retro){
  const w = S.state().watch.find(x => x.id === id);
  rateMode = w?.mode || 'engaged';
  sheet(t?.t || 'Rate', retro
    ? 'Rating something you have already seen. The model learns from it, but it does not count as a prospective check — those only come from things predicted before you watched.'
    : `Predicted <b>${w?.pred!=null?n1(w.pred):'—'}</b>. Score it honestly, not relative to the prediction.`, `
    <label class="f"><span>Your score — 1 to 10</span>
      <input type="number" id="sc" min="1" max="10" step=".5" value="${w?.score ?? 7.5}"></label>
    <label class="f"><span>Note — what it actually was for you</span>
      <textarea id="nt" placeholder="Optional. One line is enough.">${esc(w?.note||'')}</textarea></label>
    <label class="f"><span>Which was this</span></label>
    <div class="chipset">
      <button class="chip on" id="md-e" data-act="md" data-m="engaged">Engaged — I chose it</button>
      <button class="chip" id="md-c" data-act="md" data-m="comfort">Comfort — background, a rut</button>
    </div>
    <div class="hint">Comfort watches are logged but held out of the model. A show you put on to decompress tells the model nothing about what you want to watch next.</div>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="rate-save" data-id="${id}" data-retro="${retro?1:0}">Save</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
}
let rateMode = 'engaged';
on('md', d => {
  rateMode = d.m;
  $('#md-e').classList.toggle('on', rateMode === 'engaged');
  $('#md-c').classList.toggle('on', rateMode === 'comfort');
});
on('rate-save', d => {
  const sc = Math.max(1, Math.min(10, Number($('#sc').value)||7));
  if(d.retro === '1'){ const w = S.state().watch.find(x => x.id === d.id); if(w) w.pred = null; }
  S.rate(d.id, sc, $('#nt').value.trim(), rateMode);
  close(); toast(rateMode === 'comfort' ? 'Logged — held out of the fit' : 'Logged'); render();
});
on('mode-flip', d => {
  const w = S.state().watch.find(x => x.id === d.id);
  if(w){ w.mode = w.mode === 'comfort' ? 'engaged' : 'comfort'; S.save(); toast('Counted in the fit'); render(); }
});
on('seed', () => {
  const n = S.seedRatings(SEED);
  S.state().set.onboarded = true; S.save();
  toast(n ? `${n} loaded` : 'Already loaded'); render();
});
on('cull-open', d => {
  const w = S.state().watch.find(x => x.id === d.id);
  sheet('Kill it', 'A reason is required. “Why did I want this and why do I not now” is the part worth keeping.', `
    <label class="f"><span>Reason</span><input type="text" id="rz" placeholder="Wanted it for the premise, not the execution"></label>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn danger" data-act="cull-save" data-id="${w.id}">Kill</button>
      <button class="btn ghost" data-act="close">Keep it</button></div>`);
});
on('cull-save', d => { S.cull(d.id, $('#rz').value.trim()); close(); toast('Killed'); render(); });

on('custom-open', () => {
  sheet('Add a title', 'Score it on the same eight axes so it can be predicted and can teach the model. Middle is 0.5 — only move an axis you have an opinion about.', `
    <label class="f"><span>Title</span><input type="text" id="ct"></label>
    <div class="split">
      <label class="f"><span>Year</span><input type="number" id="cy" value="${new Date().getFullYear()}"></label>
      <label class="f"><span>Kind</span><select id="ck">
        <option value="film">Film</option><option value="anime">Anime</option>
        <option value="tv">TV</option><option value="doc">Documentary</option></select></label>
    </div>
    ${AXES.map((a,j) => `<label class="f"><span>${esc(a.n)} — ${esc(a.lo)} → ${esc(a.hi)}</span>
      <input type="range" id="cx${j}" min="0" max="1" step=".05" value=".5"></label>`).join('')}
    <div class="btns wide" style="margin-top:14px">
      <button class="btn pri" data-act="custom-save">Add</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('custom-save', () => {
  const t = $('#ct').value.trim(); if(!t) return toast('Needs a title');
  S.addCustom({ t, yr:Number($('#cy').value)||new Date().getFullYear(), k:$('#ck').value,
    x:AXES.map((_,j) => Number($('#cx'+j).value)), why:'Added by you.' });
  close(); toast('Added'); render();
});

/* =====================================================================
   RIDE
   ===================================================================== */
function vRide(){
  const l = E.ladder(), rs = E.rideStats(), st = S.state();
  const lic = E.licenceStage();
  return `
  <h2 class="page">Ride</h2>
  <p class="lede">A ladder that <b>does not care how many miles you have</b>. Every level is gated on logged evidence of a named drill — because the failure mode here is knowing exactly what trail braking is and never once having practised it.</p>

  <div class="card acc" data-d="ride">
    <div class="row"><div class="grow"><h4>${esc(l.stage.name)}</h4>
      <div class="meta">${l.done} of ${l.total} drills with evidence${lic?` · ${esc(lic.n)}`:''}</div></div>
      <div style="font-family:var(--mono);font-size:20px;color:var(--acc)">${Math.round(l.done/l.total*100)}%</div></div>
    <div class="bar" style="margin-top:11px"><i style="width:${l.done/l.total*100}%"></i></div>
    <div class="body">${esc(l.stage.say)}</div>
  </div>

  <div class="btns wide" style="margin-top:12px">
    <button class="btn pri" data-act="ride-open">Log a ride</button>
    <button class="btn" data-act="maint-open">Log maintenance</button>
  </div>

  <div class="sect"><div class="hd"><h3>Distance</h3><span class="aux">${rs.n} ride${rs.n===1?'':'s'}</span></div>
    <div class="quad">
      <div class="stat"><div class="k">Total</div><div class="v">${n0(rs.mi)}</div><div class="u">miles</div></div>
      <div class="stat"><div class="k">Seat time</div><div class="v">${n1(rs.hours)}</div><div class="u">hours</div></div>
      <div class="stat"><div class="k">Last 30 days</div><div class="v">${n0(rs.mi30)}</div><div class="u">mi over ${rs.n30} rides</div></div>
      <div class="stat ${rs.near?'warn':''}"><div class="k">Near misses</div><div class="v">${rs.near}</div>
        <div class="u">${rs.nearPer100!=null&&rs.mi>50?`${n1(rs.nearPer100)} per 100 mi`:'log them, they are the data'}</div></div>
    </div>
  </div>

  <div class="sect"><div class="hd"><h3>Conditions ridden</h3><span class="aux">${rs.covered}/${rs.covTotal} covered</span></div>
    <p class="hint">Three or more rides counts as covered. <b>Fair-weather riders have fair-weather skill</b> — and then it rains on the way home from somewhere.</p>
    <div class="card" style="margin-top:10px">${rs.cov.map(c => `
      <div class="wt"><div class="n">${esc(c.n)}</div>
        <div class="tr"><i style="left:0;width:${Math.min(100,c.count/3*100)}%${c.count>=3?'':';background:var(--warn)'}"></i></div>
        <div class="v">${c.count}</div></div>`).join('')}</div>
  </div>

  <div class="sect" data-d="ride"><div class="hd"><h3>The ladder</h3><span class="aux">evidence-gated</span></div>
    <div class="card">${l.rows.map(r => {
      const cls = r.met ? 'done' : (l.next && l.next.drill.id === r.drill.id ? 'now' : '');
      return `<div class="lad ${cls}"><div class="pip"></div>
        <div><div class="nm">${esc(r.drill.n)} <span class="chip sm">${esc(r.drill.sys)}</span></div>
          <div class="ds">${esc(r.drill.is)}</div>
          <details class="acc-d" style="margin-top:9px;background:var(--bg-2)"><summary>How to practise it</summary>
            <div class="in"><p>${esc(r.drill.how)}</p>
              <p style="color:var(--bad)"><b>Failure mode:</b> ${esc(r.drill.fail)}</p></div></details>
          <div class="gate">Gate: ${r.need} logged${r.drill.gate.kind?` ${esc(r.drill.gate.kind)}`:''}${r.drill.gate.mins?` sessions of ${r.drill.gate.mins}+ min`:''}${r.drill.gate.miles?` rides of ${r.drill.gate.miles}+ mi`:''}${r.sub?`, ${r.sub.need} ${r.sub.label}`:''}</div>
          <div class="evi">${r.have}/${r.need}${r.sub?` · wet ${r.sub.n}/${r.sub.need}`:''}${r.last?` · last ${esc(S.human(r.last))}`:''}${r.met?' · MET':''}</div>
          <div class="bar thin" style="margin-top:6px"><i class="${r.met?'ok':''}" style="width:${r.pct*100}%"></i></div>
        </div></div>`;
    }).join('')}</div>
    <div class="hint">The system underneath all of it is IPSGA: ${IPSGA.map(i => `<b>${esc(i.n)}</b>`).join(' · ')}.</div>
  </div>

  <div class="sect"><div class="hd"><h3>IPSGA</h3><span class="aux">Roadcraft — the system of control</span></div>
    <div class="card">${IPSGA.map(i => `<div class="lad"><div class="pip" style="border:0;font-family:var(--serif);color:var(--acc);font-size:15px;text-align:center;width:auto">${i.k}</div>
      <div><div class="nm">${esc(i.n)}</div><div class="ds">${esc(i.is)}</div></div></div>`).join('')}</div>
  </div>

  <div class="sect"><div class="hd"><h3>Licence and training</h3></div>
    <p class="hint">Tick what you hold. Everything below Full A is the legal ladder; everything above it is the one that actually changes your survival odds.</p>
    <div class="card" style="margin-top:10px">${LICENCE.map(x => `
      <div class="lad ${st.lic[x.id]?'done':''}"><div class="pip"></div>
        <div><div class="row"><div class="grow"><div class="nm">${esc(x.n)} <span class="chip sm">${esc(x.full)}</span></div></div>
          <button class="btn sm ${st.lic[x.id]?'ghost':''}" data-act="lic" data-id="${x.id}">${st.lic[x.id]?esc(S.human(st.lic[x.id])):'Mark'}</button></div>
          <div class="ds">${esc(x.is)}</div><div class="gate">${esc(x.next)}</div></div></div>`).join('')}</div>
  </div>

  <div class="sect"><div class="hd"><h3>Roads</h3><span class="aux">minutes from Derby</span></div>
    <div class="card">${ROADS.map(r => `<div class="tt">
      <div class="pr" style="font-size:13px">${r.from}<small>MIN</small></div>
      <div><div class="nm">${esc(r.n)}</div><div class="sb">${esc(r.where)} · ${r.mi} mi · ${'★'.repeat(r.grade)}</div>
        <div class="rz">${esc(r.is)}</div></div><div class="go"></div></div>`).join('')}</div>
  </div>

  <div class="sect"><div class="hd"><h3>The risk ledger</h3><span class="aux">stated once, plainly</span></div>
    <p class="lede">${esc(RISK.lede)}</p>
    ${RISK.facts.map(f => `<details class="acc-d"><summary><span>${esc(f.t)}</span></summary>
      <div class="in"><p>${esc(f.d)}</p><p><span class="chip sm ${f.tier==='Hypothesis'?'warnc':''}">${esc(f.tier)}</span></p></div></details>`).join('')}
    <div class="card" style="margin-top:12px"><h4>Mitigations, in order of expected value</h4>
      ${RISK.ladder.map((x,i) => `<div class="body"><b>${i+1}.</b> ${esc(x)}</div>`).join('')}</div>
  </div>`;
}

on('ride-open', () => {
  sheet('Log a ride', 'Name the drills you actually practised — not the ones you thought about. Only named drills count toward the ladder.', `
    <div class="split">
      <label class="f"><span>Date</span><input type="date" id="rd" value="${S.today()}"></label>
      <label class="f"><span>Miles</span><input type="number" id="rm" min="0" step="1" value="20"></label>
    </div>
    <label class="f"><span>Minutes in the seat</span><input type="number" id="rt" min="0" step="5" value="45"></label>
    <label class="f"><span>Road types</span></label>${chipsetHTML(ROADKINDS, [], 'tg-kind')}
    <label class="f"><span>Conditions</span></label>${chipsetHTML(CONDITIONS, [], 'tg-cond')}
    <label class="f"><span>Drills practised</span></label>
    ${chipsetHTML(DRILLS.map(d => ({k:d.id,n:d.n})), [], 'tg-drill')}
    <label class="f" style="margin-top:14px"><span>Pre-ride check done</span></label>
    ${chipsetHTML([{k:'check',n:'T-CLOCS done'}], [], 'tg-check')}
    <label class="f"><span>Near miss — what happened, and what you would do differently</span>
      <textarea id="rn" placeholder="Leave empty if none. This field is where the learning actually is."></textarea></label>
    <label class="f"><span>Note</span><input type="text" id="ro" placeholder="Road, weather, how it felt"></label>
    <div class="btns wide" style="margin-top:14px">
      <button class="btn pri" data-act="ride-save">Log it</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
  window.__sel = { kind:[], cond:[], drill:[], check:[] };
});
const tg = key => (d, el) => {
  const a = window.__sel[key];
  const i = a.indexOf(d.k); if(i >= 0) a.splice(i,1); else a.push(d.k);
  el.classList.toggle('on');
};
on('tg-kind', tg('kind')); on('tg-cond', tg('cond')); on('tg-drill', tg('drill')); on('tg-check', tg('check'));
on('ride-save', () => {
  const s = window.__sel;
  S.logRide({ date:$('#rd').value || S.today(), mi:$('#rm').value, mins:$('#rt').value,
    kinds:s.kind, conds:s.cond, drills:s.drill, check:s.check.length>0,
    near:$('#rn').value.trim(), note:$('#ro').value.trim() });
  close(); toast('Ride logged'); render();
});
on('maint-open', () => {
  sheet('Log maintenance', 'Chain, pressures, pads, fluid. Eight entries gates the maintenance drill.', `
    <label class="f"><span>What</span><input type="text" id="mw" placeholder="Chain cleaned, lubed, tension checked"></label>
    <div class="split">
      <label class="f"><span>Date</span><input type="date" id="md" value="${S.today()}"></label>
      <label class="f"><span>Odometer</span><input type="number" id="mm" min="0" value="0"></label></div>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="maint-save">Save</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('maint-save', () => {
  const w = $('#mw').value.trim(); if(!w) return toast('What did you do?');
  S.logMaint({ what:w, date:$('#md').value||S.today(), mi:Number($('#mm').value)||0 });
  close(); toast('Logged'); render();
});
on('lic', d => { S.setLic(d.id, !S.state().lic[d.id]); render(); });

/* =====================================================================
   CRAFT
   ===================================================================== */
function vCraft(){
  const ps = E.portfolio(), g = E.gaps(), recs = E.recommendHobbies(6);
  const st = S.state();
  const mine = st.pursuits.filter(p => p.state !== 'dropped');
  const vals = HDIMS.map((_,j) => ps.length ? Math.max(...ps.map(h => h.x[j])) : 0);
  const moto = HOBBIES.find(h => h.id === 'moto');

  return `
  <h2 class="page">Craft</h2>
  <p class="lede">A portfolio is judged on what it <b>spans</b>, not on how much of it there is. Five variations on the same shape is one hobby. The recommendation below is a gap analysis against what you already do — not a list of nice things.</p>

  <div class="card" data-d="craft">
    ${radar(HDIMS, [{ cls:'shape', vals }, { cls:'shape2', vals:moto.x }])}
    <div class="hint" style="text-align:center">Solid: your active pursuits, best coverage per dimension. Dashed: motorcycling alone, for reference.</div>
  </div>

  <div class="sect" data-d="craft"><div class="hd"><h3>Gaps</h3>
    <span class="aux">${g.filter(x=>x.open).length} open</span></div>
    <div class="card">${g.map(x => `<div class="wt" style="grid-template-columns:92px 1fr auto">
      <div class="n" style="color:${x.open?'var(--acc)':'var(--tx-2)'}">${esc(x.dim.n)}</div>
      <div class="ds" style="font-size:12px;color:var(--tx-3);line-height:1.45">${esc(x.say)}</div>
      <div class="v">${x.open?'<span class="chip sm" style="color:var(--acc);border-color:var(--acc-line)">open</span>':'✓'}</div>
    </div>`).join('')}</div>
    <div class="hint">Risk and Capital are reported, never balanced toward. You do not want a portfolio that maximises either.</div>
  </div>

  ${mine.length ? `<div class="sect"><div class="hd"><h3>Yours</h3></div>
    <div class="stack">${mine.map(p => {
      const h = HOBBIES.find(x => x.id === p.hobbyId); if(!h) return '';
      const mins = p.logs.reduce((s,l) => s + l.mins, 0);
      const last = p.logs[0]?.date;
      const cold = (S.since(last || p.started) ?? 0) >= 14;
      return `<div class="card ${p.state==='trial'?'flat':''}" data-d="craft">
        <div class="row"><div class="grow"><h4>${esc(h.n)} <span class="chip sm">${p.state}</span></h4>
          <div class="meta">${n1(mins/60)} h logged · ${p.logs.length} session${p.logs.length===1?'':'s'}${last?` · last ${esc(S.human(last))}`:' · never logged'}</div></div></div>
        ${cold ? `<div class="body" style="color:var(--warn)">Nothing logged in ${S.since(last||p.started)} days.${p.state==='trial'?' A trial that runs indefinitely is not a trial.':''}</div>`:''}
        <div class="btns" style="margin-top:11px">
          <button class="btn sm pri" data-act="p-log" data-id="${h.id}">Log time</button>
          ${p.state==='trial'?`<button class="btn sm" data-act="p-state" data-id="${h.id}" data-s="active">Commit</button>`:''}
          <button class="btn sm ghost danger" data-act="p-state" data-id="${h.id}" data-s="dropped">Drop</button></div></div>`;
    }).join('')}</div></div>` : ''}

  <div class="sect" data-d="craft"><div class="hd"><h3>Recommended</h3><span class="aux">by gap closed</span></div>
    <div class="stack">${recs.map(r => `<div class="card" data-d="craft">
      <div class="row top"><div class="grow"><h4>${esc(r.h.n)}${r.h.anti?' <span class="chip sm warnc">anti-recommendation</span>':''}${r.h.flagged?' <span class="chip sm warnc">read the note</span>':''}${r.h.adjacent?' <span class="chip sm">adjacent</span>':''}</h4>
        <div class="meta">${esc(r.h.cost)} · ceiling ${Math.round(r.h.ceil*100)}%${r.closes.length?` · closes ${r.closes.map(c=>esc(c.dim.n.toLowerCase())).join(', ')}`:''}</div></div>
        <button class="btn sm" data-act="p-state" data-id="${r.h.id}" data-s="trial">Trial</button></div>
      <div class="body">${esc(r.h.is)}</div>
      <div class="body" style="color:var(--acc)">${esc(r.h.why)}</div>
      <details class="acc-d" style="margin-top:11px;background:var(--bg-2)"><summary>First three moves</summary>
        <div class="in">${r.h.first.map((f,i) => `<p><b>${i+1}.</b> ${esc(f)}</p>`).join('')}
          ${r.h.derby?`<p style="color:var(--crf)"><b>Near you:</b> ${esc(r.h.derby)}</p>`:''}
          <p style="color:var(--bad)"><b>Why people quit:</b> ${esc(r.h.fail)}</p></div></details>
    </div>`).join('')}</div>
  </div>

  <div class="sect"><div class="hd"><h3>Everything on the list</h3><span class="aux">${HOBBIES.length}</span></div>
    ${HOBBIES.map(h => `<details class="acc-d"><summary><span>${esc(h.n)}</span><span class="chip sm">${esc(h.cost)}</span></summary>
      <div class="in"><p>${esc(h.is)}</p><p>${esc(h.why)}</p>
        ${h.derby?`<p><b>Near you:</b> ${esc(h.derby)}</p>`:''}
        <p style="color:var(--bad)"><b>Failure mode:</b> ${esc(h.fail)}</p>
        <p>${HDIMS.map((d,j) => `<span class="chip sm">${esc(d.n)} ${Math.round(h.x[j]*10)}</span>`).join(' ')}</p></div></details>`).join('')}
  </div>`;
}
on('p-state', d => {
  S.adopt(d.id, d.s);
  toast(d.s === 'dropped' ? 'Dropped' : d.s === 'active' ? 'Committed' : 'On trial — log something within two weeks');
  render();
});
on('p-log', d => {
  const h = HOBBIES.find(x => x.id === d.id);
  sheet(h.n, 'Time spent doing it, not reading about it.', `
    <label class="f"><span>Minutes</span><input type="number" id="pm" min="0" step="5" value="30"></label>
    <label class="f"><span>What you did</span><input type="text" id="pn" placeholder="Optional"></label>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="p-log-save" data-id="${d.id}">Log</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('p-log-save', d => { S.logPursuit(d.id, $('#pm').value, $('#pn').value.trim()); close(); toast('Logged'); render(); });

/* =====================================================================
   TRAVEL
   ===================================================================== */
let tRegion = '';
on('t-region', d => { tRegion = d.k === tRegion ? '' : d.k; render(); });

function vTravel(){
  const st = S.state();
  const up = S.upcoming(), done = st.trips.filter(t => t.status === 'done');
  const m = E.travelModel();
  const recs = E.recommendDests({ region:tRegion, n:10 });
  const regions = [{k:'uk',n:'UK'},{k:'eu',n:'Europe'},{k:'gulf',n:'Gulf & Levant'},{k:'africa',n:'Africa'},{k:'asia',n:'Asia'}];
  const ready = E.riderReadiness();

  return `
  <h2 class="page">Travel</h2>
  <p class="lede">Trips with real itineraries, and a debrief afterwards. <b>The debrief is the part that matters</b> — without expected-versus-actual, a travel log is a diary and predicts nothing about the next one.</p>

  <div class="btns wide"><button class="btn pri" data-act="trip-open">New trip</button>
    <button class="btn" data-act="place-open">Log a place</button></div>

  ${up.length ? `<div class="sect"><div class="hd"><h3>Ahead</h3></div>
    <div class="stack">${up.map(t => {
      const days = S.tripDays(t), empty = days.filter(d => !d.items.length).length;
      const away = -(S.since(t.from));
      return `<button class="card" data-d="travel" data-act="go" data-to="trip" data-id="${t.id}" style="text-align:left;width:100%">
        <div class="row"><div class="grow"><h4>${esc(t.name)}</h4>
          <div class="meta">${esc(S.human(t.from))} – ${esc(S.human(t.to))} · ${days.length} days · ${esc(t.status)}</div></div>
          <div style="font-family:var(--mono);font-size:19px;color:var(--trv)">${away>0?away+'d':'now'}</div></div>
        ${empty ? `<div class="body">${empty} of ${days.length} days still empty.</div>`:''}</button>`;
    }).join('')}</div></div>` : ''}

  <div class="sect" data-d="travel"><div class="hd"><h3>Where to go</h3>
    <span class="aux">${m.n >= 5 ? 'model + constraints' : `${m.n}/5 debriefs — constraints only`}</span></div>
    <p class="hint">Ranked on season fit now, how good it is on a bike weighted by your <b>actual ladder position</b> (${Math.round(ready*100)}%), cost, and — once five trips have been debriefed — your travel model. Alpine passes are a bad recommendation at stage one, so they are not made.</p>
    ${chipsetHTML(regions, tRegion?[tRegion]:[], 't-region')}
    <div class="stack" style="margin-top:10px">${recs.map(r => `<div class="card" data-d="travel">
      <div class="row top"><div class="grow"><h4>${esc(r.d.n)}</h4>
        <div class="meta">${esc(r.d.c)} · ${r.d.days} days · ${'£'.repeat(r.d.cost)}${r.d.ride?` · ${'★'.repeat(r.d.ride)} on a bike`:''}</div></div>
        <button class="btn sm" data-act="trip-open" data-id="${r.d.id}">Plan</button></div>
      <div class="body">${esc(r.d.why)}</div>
      <div class="sb" style="margin-top:8px">
        <span class="chip sm ${r.season?'on':''}">${r.season?'in season now':esc(r.d.when)}</span>
        ${r.been?'<span class="chip sm">been</span>':''}</div>
    </div>`).join('')}</div>
  </div>

  ${st.places.length ? `<div class="sect"><div class="hd"><h3>Places logged</h3><span class="aux">${st.places.length}</span></div>
    <div class="card">${st.places.slice(0,20).map(p => `<div class="tt">
      <div class="pr">${p.rating?n1(p.rating):'—'}<small>RATED</small></div>
      <div><div class="nm">${esc(p.name)}</div><div class="sb">${esc(p.country)} · ${esc(S.human(p.date))}${p.again!=null?` · ${p.again?'would return':'once was enough'}`:''}</div>
        ${p.note?`<div class="rz">${esc(p.note)}</div>`:''}</div><div class="go"></div></div>`).join('')}</div></div>` : ''}

  ${done.length ? `<div class="sect"><div class="hd"><h3>Done</h3></div>
    <div class="stack">${done.map(t => `<button class="card flat" data-act="go" data-to="trip" data-id="${t.id}" style="text-align:left;width:100%">
      <div class="row"><div class="grow"><h4>${esc(t.name)}</h4>
        <div class="meta">${esc(S.human(t.from))} · ${t.debrief?`rated ${n1(t.debrief.rating)}`:'<span style="color:var(--warn)">no debrief</span>'}</div></div></div></button>`).join('')}</div></div>` : ''}`;
}

function vTrip(){
  const t = S.trip(tripId);
  if(!t) return `<h2 class="page">Trip</h2><div class="empty">Gone.</div>`;
  const days = S.tripDays(t);
  const away = -(S.since(t.from));
  const dest = DESTS.find(d => d.id === t.destId);
  const past = t.to < S.today();
  return `
  <div class="row" style="margin-bottom:14px"><button class="btn sm ghost" data-act="go" data-to="travel">← Travel</button></div>
  <h2 class="page">${esc(t.name)}</h2>
  <p class="lede">${esc(S.humanFull(t.from))} → ${esc(S.humanFull(t.to))} · ${days.length} days${dest?` · ${esc(dest.c)}`:''}${away>0?` · in ${away} days`:''}</p>

  <div class="btns wide">
    <button class="btn" data-act="trip-status" data-id="${t.id}">Status: ${esc(t.status)}</button>
    ${past && !t.debrief ? `<button class="btn pri" data-act="debrief-open" data-id="${t.id}">Debrief</button>` : ''}
    <button class="btn ghost danger" data-act="trip-kill" data-id="${t.id}">Delete</button>
  </div>

  ${dest ? `<div class="card" data-d="travel" style="margin-top:12px"><h4>${esc(dest.n)}</h4>
    <div class="body">${esc(dest.why)}</div>
    <div class="meta">Best window: ${esc(dest.when)}</div></div>` : ''}

  ${t.debrief ? `<div class="card acc" data-d="travel" style="margin-top:12px"><h4>Debrief — ${n1(t.debrief.rating)}/10</h4>
    <div class="body">Pace ${t.debrief.pace}/5 · crowds ${t.debrief.crowd}/5 · cost ${t.debrief.cost}/5</div>
    ${t.debrief.again?`<div class="body"><b>Would change:</b> ${esc(t.debrief.again)}</div>`:''}
    <div class="hint">This is what trains the travel model. Five of these and recommendations stop being constraint-only.</div></div>` : ''}

  <div class="sect" data-d="travel"><div class="hd"><h3>Itinerary</h3>
    <span class="aux">${days.reduce((s,d)=>s+d.items.length,0)} items</span></div>
    ${days.map(d => `<div class="day">
      <div class="dh">${esc(new Date(d.date+'T00:00').toLocaleDateString('en-GB',{weekday:'long'}))}</div>
      <div class="dd">${esc(S.human(d.date))}</div>
      <div style="margin-top:8px">${d.items.length ? d.items.map(i => {
        const kd = ITEMKINDS.find(k => k.k === i.kind);
        return `<div class="it"><div class="t">${esc(i.t||'')}</div>
          <div class="w" style="${i.done?'opacity:.5;text-decoration:line-through':''}">${esc(kd?.g||'')} ${esc(i.txt)}
            ${i.note?`<small>${esc(i.note)}</small>`:''}</div>
          <div><button class="btn sm ghost" data-act="it-done" data-id="${t.id}" data-d="${d.date}" data-i="${i.id}">${i.done?'↺':'✓'}</button>
            <button class="btn sm ghost" data-act="it-kill" data-id="${t.id}" data-d="${d.date}" data-i="${i.id}">✕</button></div></div>`;
      }).join('') : '<div class="hint">Empty.</div>'}</div>
      <button class="btn sm ghost" style="margin-top:8px" data-act="it-open" data-id="${t.id}" data-d="${d.date}">+ Add</button>
    </div>`).join('')}
  </div>`;
}

on('trip-open', d => {
  const dest = d.id ? DESTS.find(x => x.id === d.id) : null;
  sheet('New trip', dest ? `Planning ${esc(dest.n)}. Suggested length is ${dest.days} days; best window ${esc(dest.when)}.` : 'A trip with dates becomes an itinerary. Without dates it stays an idea, which is fine — mark it as one.', `
    <label class="f"><span>Name</span><input type="text" id="tn" value="${dest?esc(dest.n):''}" placeholder="Dolomites, June"></label>
    <div class="split">
      <label class="f"><span>From</span><input type="date" id="tf" value="${S.shift(S.today(),30)}"></label>
      <label class="f"><span>To</span><input type="date" id="tt" value="${S.shift(S.today(), 30 + (dest?.days||4))}"></label></div>
    <label class="f"><span>Status</span><select id="ts">
      <option value="idea">Idea</option><option value="planned" selected>Planned</option>
      <option value="booked">Booked</option><option value="done">Done</option></select></label>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="trip-save" data-id="${d.id||''}">Create</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('trip-save', d => {
  const n = $('#tn').value.trim(); if(!n) return toast('Needs a name');
  const t = S.addTrip({ name:n, destId:d.id||null, from:$('#tf').value, to:$('#tt').value, status:$('#ts').value });
  close(); view = 'trip'; tripId = t.id; toast('Created'); render();
});
on('trip-status', d => {
  const t = S.trip(d.id); const order = ['idea','planned','booked','done'];
  t.status = order[(order.indexOf(t.status)+1) % order.length]; S.save(); render();
});
on('trip-kill', d => {
  const st = S.state(); st.trips = st.trips.filter(x => x.id !== d.id); S.save();
  view = 'travel'; toast('Deleted'); render();
});
on('it-open', d => {
  sheet('Add to ' + S.human(d.d), '', `
    <label class="f"><span>What</span><input type="text" id="iw" placeholder="Bealach na Bà, then Applecross"></label>
    <div class="split">
      <label class="f"><span>Time</span><input type="time" id="it"></label>
      <label class="f"><span>Kind</span><select id="ik">${ITEMKINDS.map(k => `<option value="${k.k}">${esc(k.n)}</option>`).join('')}</select></label></div>
    <label class="f"><span>Note</span><input type="text" id="io" placeholder="Booked / reference / who"></label>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="it-save" data-id="${d.id}" data-d="${d.d}">Add</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('it-save', d => {
  const txt = $('#iw').value.trim(); if(!txt) return toast('What is it?');
  S.addItem(d.id, d.d, { txt, t:$('#it').value, kind:$('#ik').value, note:$('#io').value.trim() });
  close(); render();
});
on('it-done', d => { S.toggleItem(d.id, d.d, d.i); render(); });
on('it-kill', d => { S.killItem(d.id, d.d, d.i); render(); });
on('debrief-open', d => {
  sheet('Debrief', 'Expected against actual. This is the only part of a trip log that predicts anything about the next one.', `
    <label class="f"><span>Would you go again — 1 to 10</span><input type="number" id="dr" min="1" max="10" step=".5" value="7"></label>
    <label class="f"><span>Pace — 1 too slow, 5 too packed</span><input type="range" id="dp" min="1" max="5" value="3"></label>
    <label class="f"><span>Crowds — 1 empty, 5 overrun</span><input type="range" id="dc" min="1" max="5" value="3"></label>
    <label class="f"><span>Cost — 1 under budget, 5 well over</span><input type="range" id="dx" min="1" max="5" value="3"></label>
    <label class="f"><span>The one thing you would change</span><textarea id="da"></textarea></label>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="debrief-save" data-id="${d.id}">Save</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('debrief-save', d => {
  const t = S.trip(d.id);
  t.debrief = { rating:Number($('#dr').value)||7, pace:Number($('#dp').value), crowd:Number($('#dc').value),
                cost:Number($('#dx').value), again:$('#da').value.trim() };
  t.status = 'done'; S.save(); close(); toast('Debriefed — the model learned something'); render();
});
on('place-open', () => {
  sheet('Log a place', 'Somewhere you actually went. Separate from trips, because good places outlive the trip that found them.', `
    <label class="f"><span>Place</span><input type="text" id="pl" placeholder="Blagaj Tekke"></label>
    <div class="split">
      <label class="f"><span>Country</span><input type="text" id="pc"></label>
      <label class="f"><span>Rating</span><input type="number" id="pr" min="1" max="10" step=".5" value="8"></label></div>
    <label class="f"><span>Note</span><textarea id="pn" placeholder="What it actually was"></textarea></label>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="place-save">Save</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('place-save', () => {
  const n = $('#pl').value.trim(); if(!n) return toast('Needs a name');
  S.logPlace({ name:n, country:$('#pc').value.trim(), rating:Number($('#pr').value)||0, note:$('#pn').value.trim() });
  close(); toast('Logged'); render();
});

/* =====================================================================
   MODEL
   ===================================================================== */
function vModel(){
  const m = E.screenModel(), conf = T.confidence(m.n), cal = E.screenCalibration();
  const prof = T.profile(m, AXES);
  const tm = E.travelModel();
  const st = S.state();
  const maxW = Math.max(.35, ...prof.map(p => Math.abs(p.w)));

  return `
  <h2 class="page">Model</h2>
  <p class="lede">What the app believes about you, and whether it is getting less wrong. <b>If the prospective error stops falling, the app is not working</b> — that claim is testable and the number is below.</p>

  <div class="card" data-d="screen">
    <div class="row"><div class="grow"><h4>Screen — ${esc(conf.label)}</h4>
      <div class="meta">${m.n} rating${m.n===1?'':'s'} · ridge regression, refitted on load</div></div></div>
    <div class="body">${esc(conf.say)}</div>
  </div>

  <div class="sect"><div class="hd"><h3>What you weigh</h3><span class="aux">rating points per SD</span></div>
    <div class="card">${prof.map(p => {
      const w = p.w, pctw = Math.min(50, Math.abs(w)/maxW*50);
      return `<div class="wt"><div class="n">${esc(p.n)}</div>
        <div class="tr"><i class="${w<0?'neg':''}" style="${w>=0?`left:50%;width:${pctw}%`:`right:50%;width:${pctw}%`}"></i></div>
        <div class="v">${w>=0?'+':'−'}${n1(Math.abs(w))}</div></div>`;
    }).join('')}
    <div class="hint">Read as: one standard deviation more “${esc(prof[0].hi)}” moves the prediction by ${n1(Math.abs(prof[0].w))} points${prof[0].w<0?', downward':''}. ${m.n < 12 ? '<b>At this sample size these are mostly the prior, not you.</b>' : ''}</div></div>
  </div>

  <div class="sect"><div class="hd"><h3>Prospective calibration</h3><span class="aux">${cal.n} check${cal.n===1?'':'s'}</span></div>
    ${cal.n ? `<div class="card">
      <div class="split" style="margin-bottom:14px">
        <div class="stat ${cal.mae<1?'good':cal.mae<1.6?'warn':'bad'}"><div class="k">Average error</div>
          <div class="v">${n1(cal.mae)}</div><div class="u">points, out of 10</div></div>
        <div class="stat"><div class="k">Bias</div><div class="v">${cal.bias>0?'+':'−'}${n1(Math.abs(cal.bias))}</div>
          <div class="u">${cal.bias>.3?'over-predicting':cal.bias<-.3?'under-predicting':'no systematic lean'}</div></div>
      </div>
      <div class="calib">${cal.buckets.map(b => {
        const h = b.mean != null ? (b.mean/10*100) : 0;
        return `<div class="col"><div class="b ${b.n?'act':''}" style="height:${Math.max(2,h)}%"></div>
          <div class="lab">${b.n ? n1(b.mean) : '—'}</div></div>`;
      }).join('')}</div>
      <div class="calib" style="height:auto;margin-top:2px">${cal.buckets.map(b =>
        `<div class="lab">${b.lo}–${b.hi>10?10:b.hi}</div>`).join('')}</div>
      <div class="hint">Predicted band along the bottom, what you actually gave along the top. A working model has these rising left to right.</div>
      ${cal.verdict ? `<div class="body" style="color:${cal.trend?.better?'var(--ok)':'var(--warn)'};margin-top:12px"><b>${esc(cal.verdict)}</b></div>` : ''}
    </div>` : `<div class="empty">No prospective checks yet. One appears each time you rate something that was queued <b>before</b> you watched it — retroactive ratings teach the model but do not test it.</div>`}
  </div>

  <div class="sect"><div class="hd"><h3>Travel model</h3><span class="aux">${tm.n} debrief${tm.n===1?'':'s'}</span></div>
    <div class="card"><div class="body">${tm.n >= 5
      ? `Fitted on ${tm.n} debriefed trips. Destination ranking now blends taste with season and readiness.`
      : `<b>${tm.n} of 5.</b> Until then, destinations are ranked on constraints only — season, cost, and how much of a riding road it is weighted by your actual ladder position. This is stated rather than hidden because a taste model built on two trips would be noise with a decimal point.`}</div></div>
  </div>

  <div class="sect"><div class="hd"><h3>How the one thing is chosen</h3></div>
    <div class="card"><div class="body">Checked in order, first match wins. A list is a decision handed back to you.</div>
      ${['A live trip — today’s next itinerary item beats everything',
         'A trip inside three weeks with more than half its days empty',
         'Three or more queue items past ' + E.STALE_DAYS + ' days — watch or kill',
         'The next unmet riding drill, if nothing was practised in 30 days and it is riding season',
         'A pursuit on trial with nothing logged for two weeks',
         'A cold screen model — under 12 ratings',
         'The highest-predicted thing already in the queue',
         'The largest open gap in the craft portfolio',
         'Otherwise: the top recommendation'].map((x,i) =>
        `<div class="body"><b>${i+1}.</b> ${esc(x)}</div>`).join('')}</div>
  </div>

  <div class="sect"><div class="hd"><h3>Settings</h3></div>
    <div class="card">
      <label class="f"><span>Hide titles carrying</span></label>
      ${chipsetHTML(ADVISORIES, st.set.hideAdv, 'adv')}
      <div class="hint">Filters the catalogue and the recommendations. Nothing is deleted; clearing a chip brings it back.</div>
      <label class="f"><span>Bike</span><input type="text" id="bk" value="${esc(st.set.bike)}" data-chg="set-bike" placeholder="What you ride"></label>
      <label class="f" style="margin-top:16px"><span>Riding weather</span></label>
      <div class="chipset"><button class="chip${st.set.weather?' on':''}" data-act="wx-toggle">${st.set.weather?'On':'Off'}</button></div>
      <div class="hint">Off by default. Turning it on asks the browser for your location once, rounds it to about 11 km, and sends only that to open-meteo — no key, no account, nothing else leaves the device.</div>
    </div>
  </div>

  <div class="sect"><div class="hd"><h3>Claude</h3><span class="aux">copy out, paste back</span></div>
    <div class="card"><div class="body">Builds a prompt carrying your current state — the model weights, what is queued, where the ladder is, what is planned — so a conversation starts with the facts instead of twenty questions.</div>
      <div class="btns wide" style="margin-top:11px">
        <button class="btn pri" data-act="bridge">Build prompt</button></div></div>
  </div>

  <div class="sect"><div class="hd"><h3>Data</h3></div>
    <div class="card"><div class="body">Everything is in this browser’s <span style="font-family:var(--mono)">localStorage</span> under <span style="font-family:var(--mono)">afaq.v1</span>. No account, no server, no sync. Export is the only backup that exists.</div>
      <div class="btns wide" style="margin-top:11px">
        <button class="btn" data-act="export">Export</button>
        <button class="btn" data-act="import">Import</button>
        <button class="btn ghost danger" data-act="wipe">Reset</button></div></div>
  </div>`;
}
on('adv', (d, el) => {
  const s = S.state().set; const i = s.hideAdv.indexOf(d.k);
  if(i >= 0) s.hideAdv.splice(i,1); else s.hideAdv.push(d.k);
  S.save(); el.classList.toggle('on');
});
on('set-bike', (d, el) => { S.state().set.bike = el.value; S.save(); });
on('wx-toggle', () => {
  const s = S.state().set;
  if(s.weather){ s.weather = false; S.save(); render(); return; }
  if(!navigator.geolocation) return toast('No location available');
  navigator.geolocation.getCurrentPosition(p => {
    s.weather = true; s.lat = p.coords.latitude; s.lon = p.coords.longitude; S.save();
    E.fetchWeather().then(() => { toast('Weather on'); render(); });
  }, () => toast('Location refused — weather stays off'));
});
on('bridge', () => {
  const m = E.screenModel(), l = E.ladder(), rs = E.rideStats(), cal = E.screenCalibration();
  const prof = T.profile(m, AXES).slice(0,4);
  const txt = `I use an app called Āfāq that tracks screen, motorcycling, hobbies and travel, and fits a taste model to my ratings. Here is the current state.

SCREEN — ${m.n} ratings, ${T.confidence(m.n).label.toLowerCase()}${cal.n?`, prospective error ${n1(cal.mae)}/10 over ${cal.n} checks`:''}.
Axis weights (points per SD): ${prof.map(p => `${p.n} ${p.w>=0?'+':''}${n1(p.w)}`).join(', ')}.
Highest rated: ${S.watched().sort((a,b)=>b.score-a.score).slice(0,5).map(w => `${E.title(w.titleId)?.t} (${n1(w.score)})`).join(', ')||'none yet'}.
Queued: ${S.inQueue().map(w => E.title(w.titleId)?.t).slice(0,8).join(', ')||'nothing'}.

RIDE — ${l.stage.name}, ${l.done}/${l.total} drills gated, ${n0(rs.mi)} miles over ${rs.n} rides, ${rs.covered}/${rs.covTotal} conditions covered.
Next unmet drill: ${l.next?l.next.drill.n+` (${l.next.have}/${l.next.need})`:'none — all met'}.

CRAFT — active: ${E.portfolio().map(h=>h.n).join(', ')||'none'}. Open gaps: ${E.gaps().filter(g=>g.open).map(g=>g.dim.n).join(', ')||'none'}.

TRAVEL — ${S.upcoming().map(t=>`${t.name} (${t.from})`).join(', ')||'nothing planned'}. ${E.travelModel().n} debriefed trips.

Given this, what am I not seeing?`;
  sheet('Prompt', 'Copy it into Claude.', `<pre class="prompt">${esc(txt)}</pre>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="copy" data-t="${encodeURIComponent(txt)}">Copy</button>
      <button class="btn ghost" data-act="close">Done</button></div>`);
});
on('copy', async d => {
  try{ await navigator.clipboard.writeText(decodeURIComponent(d.t)); toast('Copied'); }
  catch{ toast('Select and copy manually'); }
});
on('export', () => {
  const txt = S.exportJSON();
  sheet('Export', 'Your entire state. Copy it somewhere that is not this browser.', `
    <pre class="prompt">${esc(txt.slice(0,4000))}${txt.length>4000?'\n… ('+txt.length+' chars total — use Copy)':''}</pre>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="copy" data-t="${encodeURIComponent(txt)}">Copy all</button>
      <button class="btn ghost" data-act="close">Done</button></div>`);
});
on('import', () => {
  sheet('Import', 'Replaces everything currently stored. Export first if you are not sure.', `
    <label class="f"><span>Paste an Āfāq export</span><textarea id="im" style="min-height:180px"></textarea></label>
    <div class="btns wide" style="margin-top:12px">
      <button class="btn pri" data-act="import-save">Replace</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('import-save', () => {
  try{ S.importJSON($('#im').value); close(); toast('Imported'); render(); }
  catch(e){ toast('Not a valid export'); }
});
on('wipe', () => {
  sheet('Reset', 'Deletes every rating, ride, pursuit and trip in this browser. There is no undo and no server copy.', `
    <div class="btns wide" style="margin-top:6px">
      <button class="btn danger" data-act="wipe-yes">Delete everything</button>
      <button class="btn ghost" data-act="close">Cancel</button></div>`);
});
on('wipe-yes', () => { S.reset(); close(); view = 'today'; toast('Reset'); render(); });

/* ---------- init ---------- */
const h0 = location.hash.slice(1);
if(h0 && VIEWS.some(v => v.id === h0)) view = h0;
render();
if(!S.state().set.onboarded && S.state().watch.length >= 3){ S.state().set.onboarded = true; S.save(); }
E.fetchWeather().then(w => { if(w) render(); });
if('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
