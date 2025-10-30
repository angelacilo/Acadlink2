'use strict';

const { qs, qsa, on, delegate } = require('./utils');

function init() {
  const root = qs('[data-module="system-settings"]');
  if (!root) return;

  // Tab navigation -> update query params and reload
  const tabs = qs('[data-tabs]', root);
  if (tabs) {
    delegate(tabs, '[data-tab]', 'click', (e) => {
      e.preventDefault();
      const name = e.delegateTarget.getAttribute('data-tab');
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'system-settings');
      url.searchParams.set('tab', name);
      window.location.href = url.toString();
    });
  }

  // Populate edit Course
  const editCourseForm = qs('#form-edit-course');
  delegate(root, '[data-action="edit-course"]', 'click', (e) => {
    const btn = e.delegateTarget;
    if (!editCourseForm) return;
    const id = btn.getAttribute('data-id');
    editCourseForm.action = `/settings/courses/${id}`;
    qs('[name="course_name"]', editCourseForm).value = btn.getAttribute('data-course_name') || '';
    qs('[name="department_id"]', editCourseForm).value = btn.getAttribute('data-department_id') || '';
    const modal = qs('[data-modal="course-edit"]');
    if (modal) modal.classList.add('is-open');
  });

  // Populate edit Department
  const editDeptForm = qs('#form-edit-department');
  delegate(root, '[data-action="edit-department"]', 'click', (e) => {
    const btn = e.delegateTarget;
    if (!editDeptForm) return;
    const id = btn.getAttribute('data-id');
    editDeptForm.action = `/settings/departments/${id}`;
    qs('[name="department_name"]', editDeptForm).value = btn.getAttribute('data-department_name') || '';
    qs('[name="department_head"]', editDeptForm).value = btn.getAttribute('data-department_head') || '';
    const modal = qs('[data-modal="department-edit"]');
    if (modal) modal.classList.add('is-open');
  });

  // Populate edit Academic Year
  const editYearForm = qs('#form-edit-year');
  delegate(root, '[data-action="edit-year"]', 'click', (e) => {
    const btn = e.delegateTarget;
    if (!editYearForm) return;
    const id = btn.getAttribute('data-id');
    editYearForm.action = `/settings/academic-years/${id}`;
    qs('[name="school_year"]', editYearForm).value = btn.getAttribute('data-school_year') || '';
    const modal = qs('[data-modal="year-edit"]');
    if (modal) modal.classList.add('is-open');
  });

  // Confirm destructive deletes
  delegate(root, 'form[data-confirm]', 'submit', (e) => {
    const msg = e.delegateTarget.getAttribute('data-confirm') || 'Are you sure?';
    if (!confirm(msg)) e.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };
