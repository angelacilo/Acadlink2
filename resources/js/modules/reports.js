'use strict';

const { qs, qsa, on, delegate, buildQuery } = require('./utils');

function init() {
  const root = qs('[data-module="reports"]');
  if (!root) return;

  const tabbar = qs('[data-tabs]', root);
  if (tabbar) {
    delegate(tabbar, '[data-tab]', 'click', (e) => {
      e.preventDefault();
      const t = e.delegateTarget;
      const name = t.getAttribute('data-tab');
      qsa('[data-tab]', tabbar).forEach(el => el.classList.toggle('is-active', el === t));
      qsa('[data-pane]', root).forEach(p => p.classList.toggle('is-active', p.getAttribute('data-pane') === name));
    });
  }

  qsa('form[data-filter-form]', root).forEach((form) => {
    qsa('select,input[type="search"]', form).forEach((el) => {
      on(el, 'change', () => form.requestSubmit());
    });
  });

  delegate(root, '[data-action="download-csv"]', 'click', (e) => {
    const btn = e.delegateTarget;
    const form = btn.closest('form[data-filter-form]');
    const params = form ? Object.fromEntries(new FormData(form)) : {};
    const url = btn.getAttribute('data-url') || window.location.pathname;
    const query = buildQuery(Object.assign({ format: 'csv' }, params));
    window.location.href = url + (url.includes('?') ? '&' : '?') + query;
  });
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };
