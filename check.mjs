import fs from 'fs';
const html = fs.readFileSync(new URL('./ai-risk-atlas.html', import.meta.url), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error('no script found'); process.exit(1); }
let src = m[1];

// stub browser env
const el = () => new Proxy(function(){}, {
  get: (t, p) => {
    if (p === 'style') return new Proxy({}, { get: () => '', set: () => true });
    if (p === 'classList') return { add(){}, remove(){}, toggle(){}, contains(){ return false; } };
    if (p === 'getContext') return () => new Proxy({}, {
      get: (t2, p2) => {
        if (p2 === 'measureText') return () => ({ width: 10 });
        if (p2 === 'createRadialGradient') return () => ({ addColorStop(){} });
        return () => {};
      },
      set: () => true
    });
    if (p === 'addEventListener' || p === 'setPointerCapture') return () => {};
    if (p === 'querySelectorAll') return () => [];
    if (p === 'closest') return () => null;
    if (typeof p === 'string' && (p === 'innerHTML' || p === 'textContent')) return '';
    return el();
  },
  set: () => true,
  apply: () => el()
});
globalThis.document = new Proxy({}, { get: (t,p) => {
  if (p === 'getElementById') return () => el();
  if (p === 'addEventListener') return () => {};
  if (p === 'documentElement') return el();
  if (p === 'activeElement') return null;
  return el();
}});
globalThis.matchMedia = () => ({ matches: true }); // reduced motion => sync sim, exercises simStep fully
globalThis.addEventListener = () => {};
globalThis.requestAnimationFrame = () => 0;
globalThis.getComputedStyle = () => ({ getPropertyValue: () => 'monospace' });
globalThis.innerWidth = 1400; globalThis.innerHeight = 900;
globalThis.devicePixelRatio = 2;
globalThis.performance = { now: () => 0 };

if (!globalThis.localStorage) {
  const store = {};
  globalThis.localStorage = { getItem: k => store[k] ?? null, setItem: (k,v) => { store[k]=String(v); }, removeItem: k => { delete store[k]; } };
}

// expose internals for validation
src += `
;globalThis.__X = { nodes, links, byId, CONCEPTS, SOURCES, THEMES, neighbors, WALKS, CRUX, VS };
`;
const fn = new Function(src);
fn();

const { nodes, links, byId, CONCEPTS, SOURCES, THEMES, WALKS, CRUX, VS } = globalThis.__X;
let errs = [];
SOURCES.forEach(s => { if (!WALKS[s.id] || WALKS[s.id].length < 5) errs.push(`walk missing/short for ${s.id}`); });
Object.entries(WALKS).forEach(([sid, stops]) => {
  const src = SOURCES.find(s => s.id === sid);
  if (!src) errs.push(`walk for unknown source '${sid}'`);
  const seen = new Set();
  stops.forEach(st => {
    if (!byId[st.id]) errs.push(`walk ${sid}: unknown stop '${st.id}'`);
    if (seen.has(st.id)) errs.push(`walk ${sid}: duplicate stop '${st.id}'`);
    seen.add(st.id);
    if (!st.note || st.note.length < 30) errs.push(`walk ${sid}: weak note on '${st.id}'`);
    if (src && !src.concepts.includes(st.id)) errs.push(`walk ${sid}: stop '${st.id}' not among source's concepts`);
  });
});
Object.keys(CRUX).forEach(id => { if (!byId[id]) errs.push(`crux: unknown id '${id}'`); });
VS.forEach(([a,b]) => {
  if (!byId[a] || !byId[b]) errs.push(`vs pair: unknown id in [${a}, ${b}]`);
});
const vsLinks = links.filter(l => l.kind === 'vs').length;
if (vsLinks !== VS.length) errs.push(`vs links mismatch: ${vsLinks} links vs ${VS.length} pairs`);
CONCEPTS.forEach(c => {
  if (!THEMES[c.t]) errs.push(`concept ${c.id}: bad theme ${c.t}`);
  c.rel.forEach(r => { if (!byId[r]) errs.push(`concept ${c.id}: unknown rel '${r}'`); });
  (c.src || []).forEach(s => { if (!byId[s]) errs.push(`concept ${c.id}: unknown src '${s}'`); });
  if (!c.b || c.b.length < 80) errs.push(`concept ${c.id}: blurb too short`);
});
SOURCES.forEach(s => {
  s.concepts.forEach(cid => { if (!byId[cid]) errs.push(`source ${s.id}: unknown concept '${cid}'`); });
  if (!s.url.startsWith('https://')) errs.push(`source ${s.id}: bad url`);
});
// orphans
nodes.forEach(n => { if (n.deg === 0) errs.push(`orphan node: ${n.id}`); });
// layout sanity: finite positions after full sim
nodes.forEach(n => { if (![n.x,n.y].every(Number.isFinite)) errs.push(`non-finite position: ${n.id}`); });
// symmetric src<->concepts check
CONCEPTS.forEach(c => (c.src||[]).forEach(sid => {
  const s = SOURCES.find(x => x.id === sid);
  if (s && !s.concepts.includes(c.id)) { /* one-directional is fine, link still built */ }
}));
if (errs.length) { console.error('FAIL\n' + errs.join('\n')); process.exit(1); }
console.log(`OK — ${nodes.length} nodes (${CONCEPTS.length} concepts + ${SOURCES.length} sources), ${links.length} links, all ids resolve, all positions finite`);
const spread = Math.max(...nodes.map(n => Math.hypot(n.x,n.y)));
console.log(`layout radius: ${spread.toFixed(0)}`);
