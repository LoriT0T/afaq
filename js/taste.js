/* Āfāq — the taste model. One engine, used by Screen and Travel alike.
 *
 * The model is a pure function of the log: ridge regression refitted from every
 * rating on every load. Nothing about it is stored, so it can never drift out of
 * sync with the data that produced it.
 *
 * The honest test is PROSPECTIVE, not fit quality. A prediction is frozen the
 * moment a title enters the queue, before it is watched. Calibration compares
 * those frozen predictions against what actually happened. In-sample fit would
 * always look good and would mean nothing.
 */

const LAMBDA = 8;      // ridge prior, in units of pseudo-observations
const CLAMP  = [1,10];

/* ---------- linear algebra: solve (A)w = b for small dense A ---------- */
function solve(A, b){
  const n = b.length;
  const M = A.map((r,i) => [...r, b[i]]);
  for(let c = 0; c < n; c++){
    let p = c;
    for(let r = c+1; r < n; r++) if(Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if(Math.abs(M[p][c]) < 1e-12) continue;
    [M[c], M[p]] = [M[p], M[c]];
    for(let r = 0; r < n; r++){
      if(r === c) continue;
      const f = M[r][c] / M[c][c];
      if(!f) continue;
      for(let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r,i) => Math.abs(r[i]) < 1e-12 ? 0 : r[n] / r[i]);
}

/* ---------- fit ----------
 * samples: [{x:[d], y:number}].  Returns a model that predict() understands.
 * Features are standardised so a weight reads as "rating points per standard
 * deviation of this axis", and so LAMBDA means the same thing at every scale. */
export function fit(samples, d){
  const n = samples.length;
  const base = { w:new Array(d).fill(0), b:6.5, mu:new Array(d).fill(.5), sd:new Array(d).fill(1), n };
  if(!n) return base;

  const b = samples.reduce((s,p) => s + p.y, 0) / n;
  const mu = new Array(d).fill(0), sd = new Array(d).fill(0);
  for(let j = 0; j < d; j++){
    mu[j] = samples.reduce((s,p) => s + p.x[j], 0) / n;
    const v = samples.reduce((s,p) => s + (p.x[j]-mu[j])**2, 0) / n;
    sd[j] = v > 1e-9 ? Math.sqrt(v) : 1;
  }
  if(n < 3) return { ...base, b, mu, sd };   // not enough to identify anything

  const Z = samples.map(p => p.x.map((v,j) => (v - mu[j]) / sd[j]));
  const y = samples.map(p => p.y - b);
  const A = Array.from({length:d}, () => new Array(d).fill(0));
  const r = new Array(d).fill(0);
  for(let j = 0; j < d; j++){
    for(let k = j; k < d; k++){
      let s = 0; for(let i = 0; i < n; i++) s += Z[i][j]*Z[i][k];
      A[j][k] = A[k][j] = s;
    }
    A[j][j] += LAMBDA;
    let s = 0; for(let i = 0; i < n; i++) s += Z[i][j]*y[i];
    r[j] = s;
  }
  return { w:solve(A, r), b, mu, sd, n };
}

export function predict(m, x){
  let v = m.b;
  for(let j = 0; j < m.w.length; j++) v += m.w[j] * ((x[j] - m.mu[j]) / m.sd[j]);
  return Math.max(CLAMP[0], Math.min(CLAMP[1], v));
}

/* Which axes drove this particular prediction, largest absolute pull first. */
export function explain(m, x, axes, top = 3){
  return m.w.map((w,j) => ({
      k:axes[j].k, n:axes[j].n, axis:axes[j],
      pull: w * ((x[j] - m.mu[j]) / m.sd[j]), w
    }))
    .filter(e => Math.abs(e.pull) > .12)
    .sort((a,b) => Math.abs(b.pull) - Math.abs(a.pull))
    .slice(0, top);
}

/* Ranked axes by absolute weight — "what you actually weigh", for the Model view. */
export function profile(m, axes){
  return m.w.map((w,j) => ({ ...axes[j], w }))
    .sort((a,b) => Math.abs(b.w) - Math.abs(a.w));
}

export function confidence(n){
  if(n < 5)  return { k:'cold',    n, label:'Cold',    say:'Too few ratings to say anything. Predictions here are the average, dressed up.' };
  if(n < 12) return { k:'warming', n, label:'Warming', say:'Directionally useful, individually unreliable. Rate more before you trust a single number.' };
  if(n < 30) return { k:'fitting', n, label:'Fitting', say:'The axis weights are stabilising. Check them against your own sense of yourself.' };
  return       { k:'fitted',  n, label:'Fitted',  say:'Enough data that a surprising prediction is worth taking seriously.' };
}

/* ---------- prospective calibration ----------
 * pairs: [{pred, actual, date}] — pred frozen BEFORE watching. */
export function calibration(pairs){
  const p = pairs.filter(x => x.pred != null && x.actual != null)
                 .sort((a,b) => (a.date||'').localeCompare(b.date||''));
  const n = p.length;
  const out = { n, mae:null, bias:null, buckets:[], trend:null, verdict:null };
  if(!n) return out;

  out.mae  = p.reduce((s,x) => s + Math.abs(x.pred - x.actual), 0) / n;
  out.bias = p.reduce((s,x) => s + (x.pred - x.actual), 0) / n;

  const edges = [[1,4],[4,5.5],[5.5,7],[7,8.5],[8.5,10.01]];
  out.buckets = edges.map(([lo,hi]) => {
    const inb = p.filter(x => x.pred >= lo && x.pred < hi);
    return { lo, hi, n:inb.length,
             mean: inb.length ? inb.reduce((s,x) => s + x.actual, 0) / inb.length : null };
  });

  if(n >= 8){
    const h = Math.floor(n/2);
    const mae = a => a.reduce((s,x) => s + Math.abs(x.pred - x.actual), 0) / a.length;
    const early = mae(p.slice(0,h)), late = mae(p.slice(h));
    out.trend = { early, late, better: late < early - .05 };
    out.verdict = out.trend.better
      ? `Improving — the first ${h} predictions were off by ${early.toFixed(1)}, the last ${n-h} by ${late.toFixed(1)}.`
      : `Not improving yet — ${early.toFixed(1)} early against ${late.toFixed(1)} late. Either the axes are wrong for you, or you are rating on something the axes do not capture.`;
  }
  return out;
}

/* ---------- cold start ----------
 * Greedy maximin: the first item is the one furthest from the catalogue centre,
 * then each next item is the one whose nearest already-chosen neighbour is
 * furthest away. Ratings on a maximally spread set identify the weights in the
 * fewest ratings — a set of near-identical titles teaches almost nothing. */
export function spread(items, k){
  if(!items.length) return [];
  const d = items[0].x.length;
  const c = new Array(d).fill(0);
  for(const it of items) for(let j = 0; j < d; j++) c[j] += it.x[j] / items.length;
  const dist = (a,b) => Math.hypot(...a.map((v,j) => v - b[j]));

  const pool = [...items];
  const pick = [];
  let seed = pool.reduce((best,it) => dist(it.x,c) > dist(best.x,c) ? it : best, pool[0]);
  pick.push(seed); pool.splice(pool.indexOf(seed), 1);
  while(pick.length < k && pool.length){
    let best = null, bestD = -1;
    for(const it of pool){
      const nd = Math.min(...pick.map(p => dist(it.x, p.x)));
      if(nd > bestD){ bestD = nd; best = it; }
    }
    pick.push(best); pool.splice(pool.indexOf(best), 1);
  }
  return pick;
}

/* ---------- recommendation ----------
 * Blends predicted score with information gain, weighted toward information
 * while the model is cold. Exploring is not politeness — an item close to
 * things you have already rated cannot move the weights. */
export function rank(items, model, rated, opts = {}){
  /* Capped at 1.0, not 1.6. At n=8 the old bonus was worth more than the entire
   * spread of predictions, so the "recommendations" were really just a diversity
   * sample wearing predicted scores. Exploration should tilt the ranking, not own it. */
  const explore = opts.explore ?? Math.max(0, Math.min(1.0, 8 / Math.max(1, model.n)));
  const seen = rated.map(r => r.x);
  const dist = (a,b) => Math.hypot(...a.map((v,j) => v - b[j]));
  return items.map(it => {
    const pred = predict(model, it.x);
    const info = seen.length ? Math.min(...seen.map(s => dist(it.x, s))) : 1;
    return { it, pred, info, score: pred + explore * info };
  }).sort((a,b) => b.score - a.score);
}
