(function () {
  const n = document.createElement('link').relList;
  if (n && n.supports && n.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) i(o);
  new MutationObserver(o => {for (const l of o) if (l.type === 'childList') for (const a of l.addedNodes) a.tagName === 'LINK' && a.rel === 'modulepreload' && i(a);}).observe(document, { childList: !0, subtree: !0 });

  function t(o) {
    const l = {};
    return o.integrity && (l.integrity = o.integrity), o.referrerPolicy && (l.referrerPolicy = o.referrerPolicy), o.crossOrigin === 'use-credentials' ? l.credentials = 'include' : o.crossOrigin === 'anonymous' ? l.credentials = 'omit' : l.credentials = 'same-origin', l;
  }

  function i(o) {
    if (o.ep) return;
    o.ep = !0;
    const l = t(o);
    fetch(o.href, l);
  }
})();

function L(e) {return e && !!e.then;}

function M(e) {return e && !!e.finally;}

function A(e) {return e && !!e.is && !e.then && !e.finally;}

const g = () => !0;

class D {constructor(n) {this.children = n;}}

class w extends D {constructor(n, t) {super(t), this.condition = n;}}

class P extends w {
  constructor(n, t) {super(n, t);}

  isDecision() {return !0;}
}

class C extends P {constructor(n) {super(g, n);}}

class B extends w {
  constructor(n, t, i) {super(n, i), this.func = t;}

  isMidway() {return !0;}
}

class I extends w {
  constructor(n, t) {super(n, []), this.func = t;}

  isEnd() {return !0;}
}

function r(e, n) {
  if (L(e)) {
    const t = e.is === !0 ? () => !0 : e.is;
    return new B(t || g, e.then, n);
  }
  if (M(e)) {
    const t = e.is === !0 ? () => !0 : e.is;
    if (Array.isArray(n) && n.length) throw new Error('');
    return new I(t || g, e.finally);
  }
  if (A(e)) return e.is ? new P(e.is, n) : new C(n);
  if (e === null) return new C(n);
  throw new Error('not reached');
}

function s(e, n = {}, ...t) {return e(n, t);}

let u = null, d = null, p = null, T = [];
const S = 1, U = 1e3 / 60;
let v, y;
const x = new MessageChannel;
let E = 0;
const W = () => (E = performance.now(), v - E), k = { didTimeout: !1, timeRemaining: W };
x.port2.onmessage = () => {typeof y == 'function' && y(k);};
const F = e => (requestAnimationFrame(n => {v = n + U, y = e, x.port1.postMessage(null);}), S), q = () => {
  const e = n => {n && (e(n.child), e(n.sibling));};
  u !== null && (e(u.child), p = u), u = null;
}, K = (e, n = []) => {
  var a;
  let t = 0, i, o;
  const l = n.flat(1 / 0);
  for ((a = e.alternate) != null && a.child && (i = e.alternate.child); t < l.length || typeof i < "u";) {
    const h = l[t];
    let f;
    const m = !!(i && h && i.component === h);
    m && i && (f = { component: i.component, alternate: i, return: e, effectTag: 'UPDATE' }), !m && h && (f = { component: h, alternate: null, return: e, effectTag: 'REPLACEMENT' }), !m && i && T.push(i), i && (i = i.sibling), t === 0 ? e.child = f : typeof o < 'u' && (o.sibling = f), o = f, t += 1;
  }
}, z = e => {
  debugger;
  if (K(e, [e.component]), e.child) return e.child;
  let n = e;
  for (; typeof n < "u";) {
    if (n.sibling) return n.sibling;
    n = n.return;
  }
  return null;
}, O = e => {
  for (; d && e.timeRemaining() > 1;) d = z(d);
  !d && u && q(), F(O);
}, G = e => {p = null, u = { component: e, alternate: p }, d = u, T = [], F(O);};
let H = 0;

function c() {console.log('done', H++);}

const R = s(r, null, s(r, null, s(r, { then: c }), s(r, { then: c }), s(r, { then: c }), s(r, { then: c })), s(r, null, s(r, { then: c }), s(r, { then: c }), s(r, { then: c }), s(r, { then: c })), s(r, null, s(r, { then: c }), s(r, { then: c }), s(r, { then: c }), s(r, { then: c })));
console.log(R);
G(R);
