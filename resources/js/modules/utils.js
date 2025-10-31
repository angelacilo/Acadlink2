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

// Toast utilities (bottom-left). API compatible shim for `sonner` style usage.
function ensureToastContainer(){
  let c = document.querySelector('.toast-container');
  if (!c) {
    c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}
function addToast(message, type = 'info'){
  const c = ensureToastContainer();
  const el = document.createElement('div');
  el.className = 'toast-item';
  const colors = {
    success: '#065f46',
    error: '#991b1b',
    info: '#0f172a',
    warning: '#92400e'
  };
  el.style.borderLeft = '4px solid ' + (colors[type] || colors.info);
  el.textContent = message;
  c.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; el.style.transition = 'all .2s ease'; }, 2800);
  setTimeout(() => { el.remove(); }, 3200);
}

const toast = {
  success: (msg) => addToast(msg, 'success'),
  error: (msg) => addToast(msg, 'error'),
  info: (msg) => addToast(msg, 'info'),
  warning: (msg) => addToast(msg, 'warning')
};

if (typeof window !== 'undefined') { window.toast = toast; }

module.exports = { qs, qsa, on, delegate, normalize, toggle, buildQuery, ensureToastContainer, toast };
