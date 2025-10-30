'use strict';

const { qs, on } = require('./utils');

function init() {
  const root = qs('[data-module="my-profile"]');
  if (!root) return;

  const pwdToggle = qs('[data-action="toggle-password"]', root);
  on(pwdToggle, 'click', (e) => {
    e.preventDefault();
    const input = qs('input[type="password"]', root);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  const form = qs('form', root);
  on(form, 'submit', () => {
    const btn = qs('button[type="submit"]', form);
    if (btn) { btn.disabled = true; btn.dataset.loading = '1'; }
  });
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };
