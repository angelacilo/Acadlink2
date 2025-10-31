'use strict';

const { qs, qsa, on, delegate, ensureToastContainer, toast } = require('./utils');

function init() {
  const root = document.body;
  if (!root) return;

  // Ensure toast container exists for all pages
  ensureToastContainer();

  // Auto display toasts via data attributes if present
  qsa('[data-toast]')
    .forEach((el) => {
      const type = el.getAttribute('data-toast') || 'info';
      const msg = el.getAttribute('data-message') || el.textContent || '';
      if (msg) { (toast[type] || toast.info)(msg); el.remove(); }
    });

  // Generic toggle helper
  delegate(root, '[data-toggle-class]', 'click', (e) => {
    const t = e.delegateTarget;
    const sel = t.getAttribute('data-target') || 'body';
    const cl = t.getAttribute('data-toggle-class');
    const trg = qs(sel);
    if (trg && cl) trg.classList.toggle(cl);
  });

  // Dismiss helper
  delegate(root, '[data-dismiss]', 'click', (e) => {
    const target = e.delegateTarget.getAttribute('data-dismiss');
    const el = target ? qs(target) : e.delegateTarget.closest('.dismissable');
    if (el) el.remove();
  });

  // Auto submit helper
  qsa('[data-autosubmit] select,[data-autosubmit] input', root).forEach((el) => {
    on(el, 'change', () => {
      const f = el.closest('form'); if (f) f.requestSubmit();
    });
  });

  // Global modal toggles available to all modules
  delegate(root, '[data-modal-open]', 'click', (e) => {
    e.preventDefault();
    const id = e.delegateTarget.getAttribute('data-modal-open');
    const m = qs(`[data-modal="${id}"]`);
    if (m) m.classList.add('is-open');
  });

  delegate(root, '[data-modal-close]', 'click', (e) => {
    e.preventDefault();
    const m = e.delegateTarget.closest('[data-modal]');
    if (m) m.classList.remove('is-open');
  });

  // Global confirm handler
  delegate(root, 'form[data-confirm]', 'submit', (e) => {
    const msg = e.delegateTarget.getAttribute('data-confirm') || 'Are you sure?';
    if (!confirm(msg)) e.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };

