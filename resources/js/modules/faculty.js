'use strict';

const { qs, qsa, on, delegate } = require('./utils');

function init() {
  const root = qs('[data-module="faculty"]');
  if (!root) return;

  // Filters autosubmit
  const filterForm = qs('form[data-filter-form]', root);
  if (filterForm) {
    qsa('input[type="search"], input[type="text"], select', filterForm).forEach((el) => {
      on(el, 'change', () => filterForm.requestSubmit());
      on(el, 'keyup', (e) => { if (e.key === 'Enter') filterForm.requestSubmit(); });
    });
  }

  // Bulk selection bar
  const table = qs('table', root);
  if (table) {
    const checkAll = qs('[data-check="all"]', root);
    const checks = () => qsa('tbody input[type="checkbox"][name="ids[]"]', table);
    const archiveBtn = qs('[data-action="bulk-archive"]', root);

    if (checkAll) on(checkAll, 'change', () => { checks().forEach(c => c.checked = checkAll.checked); updateHeader(); updateRowStyles(); });
    delegate(table, 'tbody input[type="checkbox"][name="ids[]"]', 'change', () => { updateHeader(); updateRowStyles(); });

    function updateHeader() {
      if (!archiveBtn) return;
      const any = checks().some(c => c.checked);
      archiveBtn.disabled = !any;
    }

    function updateRowStyles(){
      qsa('tbody tr', table).forEach((tr) => {
        const cb = qs('input[type="checkbox"][name="ids[]"]', tr);
        tr.classList.toggle('is-selected', !!(cb && cb.checked));
      });
    }

    // Row click toggles selection (ignore if clicking on buttons/links/forms)
    delegate(table, 'tbody tr', 'click', (e) => {
      const target = e.target;
      if (target.closest('button, a, form, input, select, label, svg, path')) return;
      const tr = e.delegateTarget;
      const cb = qs('input[type="checkbox"][name="ids[]"]', tr);
      if (cb) { cb.checked = !cb.checked; updateHeader(); updateRowStyles(); }
    });

    // Header archive action
    if (archiveBtn) on(archiveBtn, 'click', (e) => {
      e.preventDefault();
      const any = checks().some(c => c.checked);
      if (!any) return;
      const form = qs('#bulk-archive-form');
      if (form) form.requestSubmit();
    });

    // Initial state
    updateHeader();
    updateRowStyles();
  }

  // Edit modal populate
  const editForm = qs('#form-edit-faculty');
  delegate(root, '[data-action="edit"]', 'click', (e) => {
    const btn = e.delegateTarget;
    if (!editForm) return;
    const id = btn.getAttribute('data-id');
    editForm.action = `/faculty/${id}`;
    qsa('input, select, textarea', editForm).forEach((el) => {
      const name = el.name;
      if (!name) return;
      const val = btn.getAttribute(`data-${name}`);
      if (val !== null) {
        if (el.type === 'date' && val && /\d{4}-\d{2}-\d{2}/.test(val)) el.value = val;
        else el.value = val;
      }
    });
    const modal = qs('[data-modal="fac-edit"]', root) || qs('[data-modal="fac-edit"]');
    if (modal) modal.classList.add('is-open');
  });
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };
