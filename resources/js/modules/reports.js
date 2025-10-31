'use strict';

const { qs, qsa, on, delegate, buildQuery, toast } = require('./utils');

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
    qsa('select', form).forEach((el) => {
      on(el, 'change', () => form.requestSubmit());
    });
  });

  delegate(root, '[data-action="download-csv"]', 'click', (e) => {
    const btn = e.delegateTarget;
    const form = btn.closest('form[data-filter-form]');
    const params = form ? Object.fromEntries(new FormData(form)) : {};
    const url = btn.getAttribute('data-url') || window.location.pathname;
    const query = buildQuery(Object.assign({ format: 'csv' }, params));
    // Pre-check: if the nearest table has no rows, show warning and cancel
    const card = btn.closest('.report-card');
    const table = card ? qs('table', card) : null;
    const hasRows = table ? qsa('tbody tr', table).some(tr => tr.querySelector('td') && tr.querySelectorAll('td').length > 1) : false;
    if (!hasRows) { toast.warning('No data available for export'); return; }
    toast.info('Preparing CSV...');
    setTimeout(() => toast.success('CSV exported successfully'), 1200);
    window.location.href = url + (url.includes('?') ? '&' : '?') + query;
  });

  // Client-side PDF export via print-to-PDF of the visible table
  delegate(root, '[data-action="download-pdf"]', 'click', (e) => {
    const btn = e.delegateTarget;
    const card = btn.closest('.report-card');
    const table = card ? qs('table', card) : null;
    if (!table) { toast.warning('No data to export'); return; }
    const title = btn.getAttribute('data-title') || 'Report';
    const win = window.open('', '_blank');
    if (!win) { toast.error('Popup blocked. Allow popups to export PDF.'); return; }
    const styles = `
      <style>
        body{font-family:Inter,Arial,sans-serif;margin:24px}
        h1{font-size:18px;margin:0 0 12px}
        table{width:100%;border-collapse:collapse}
        th,td{padding:8px 10px;border:1px solid #e5e7eb;text-align:left}
        thead th{background:#f3f4f6}
      </style>`;
    win.document.write(`<html><head><title>${title}</title>${styles}</head><body>`);
    win.document.write(`<h1>${title}</h1>`);
    win.document.write(table.outerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 200);
  });
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };
