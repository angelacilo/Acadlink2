'use strict';

function qs(sel, scope = document) { return scope ? scope.querySelector(sel) : null; }
function qsa(sel, scope = document) { return scope ? Array.from(scope.querySelectorAll(sel)) : []; }
function on(el, ev, handler) { if (el) el.addEventListener(ev, handler); }
function delegate(root, selector, ev, handler) {
  if (!root) return;
  root.addEventListener(ev, (e) => {
    const t = e.target.closest(selector);
    if (t && root.contains(t)) handler(Object.assign(e, { delegateTarget: t }));
  });
}
function normalize(v) { return (v || '').toString().toLowerCase().trim(); }
function toggle(el, show) { if (!el) return; el.style.display = show ? '' : 'none'; }
function buildQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.append(k, v);
  });
  return usp.toString();
}

module.exports = { qs, qsa, on, delegate, normalize, toggle, buildQuery };
