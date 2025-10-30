'use strict';

const { qs, qsa, on, delegate, buildQuery } = require('./utils');

function init() {
  const root = qs('[data-module="students"]');
  if (!root) return;

  const form = qs('form[data-filter-form]', root);
  if (form) {
    qsa('input[type="search"], input[type="text"], select', form).forEach((el) => {
      on(el, 'change', () => form.requestSubmit());
      on(el, 'keyup', (e) => { if (e.key === 'Enter') form.requestSubmit(); });
    });
  }

  const table = qs('table', root);
  if (table) {
    const checkAll = qs('[data-check="all"]', root);
    const checks = () => qsa('tbody input[type="checkbox"][name="ids[]"]', table);
    const bulkBar = qs('[data-bulk="actions"]', root);

    on(checkAll, 'change', () => { checks().forEach(c => c.checked = checkAll.checked); toggleBulk(); });
    delegate(table, 'tbody input[type="checkbox"][name="ids[]"]', 'change', toggleBulk);

    function toggleBulk() {
      if (!bulkBar) return;
      const any = checks().some(c => c.checked);
      bulkBar.classList.toggle('is-visible', any);
    }
  }

  const search = qs('[data-action="search-clear"]', root);
  on(search, 'click', () => {
    const q = qs('input[name="q"]', form); if (q) q.value = '';
    if (form) form.requestSubmit();
  });

  const sorter = qs('[data-sorter]', root);
  on(sorter, 'change', () => {
    const params = Object.fromEntries(new FormData(form));
    params.sort = sorter.value;
    const query = buildQuery(params);
    window.location.search = query;
  });
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };
