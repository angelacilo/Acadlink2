'use strict';

const { qs, qsa, on, delegate } = require('./utils');

function init() {
  const root = qs('[data-module="students"]');
  if (!root) return;

  // Filters autosubmit (match faculty)
  const filterForm = qs('form[data-filter-form]', root);
  if (filterForm) {
    // Auto-submit for text inputs
    qsa('input[type="search"], input[type="text"]', filterForm).forEach((el) => {
      on(el, 'change', () => filterForm.requestSubmit());
      on(el, 'keyup', (e) => { if (e.key === 'Enter') filterForm.requestSubmit(); });
    });
    // Auto-submit for selects, except department when a course select is present
    const depSelect = qs('select[name="department_id"]', filterForm);
    const courseSelect = qs('select[name="course_id"]', filterForm);
    qsa('select', filterForm).forEach((el) => {
      if (el === depSelect && courseSelect) return; // wait for course selection
      on(el, 'change', () => filterForm.requestSubmit());
    });

    const originalCourseOptions = courseSelect ? Array.from(courseSelect.options).map(o => o.cloneNode(true)) : [];

    function rebuildCourseOptions(deptId) {
      if (!courseSelect || originalCourseOptions.length === 0) return;
      const prev = courseSelect.value;
      const first = originalCourseOptions[0].cloneNode(true);
      first.textContent = 'All Courses';
      courseSelect.innerHTML = '';
      courseSelect.appendChild(first);
      originalCourseOptions.slice(1).forEach((opt) => {
        const od = opt.getAttribute('data-dept');
        if (!deptId || (od && od === String(deptId))) {
          courseSelect.appendChild(opt.cloneNode(true));
        }
      });
      const stillExists = Array.from(courseSelect.options).some(o => o.value === prev);
      courseSelect.value = stillExists ? prev : '';
      courseSelect.disabled = false;
    }

    if (depSelect && courseSelect) {
      // Initial build (handles when page loads with department preselected)
      rebuildCourseOptions(depSelect.value);
      on(depSelect, 'change', () => {
        rebuildCourseOptions(depSelect.value);
        // Do not auto-submit on department change; user will pick a course next
      });
      // Auto-submit when course changes
      on(courseSelect, 'change', () => filterForm.requestSubmit());
    }
  }

  // Add Student modal dependent dropdown (if modal exists)
  const addModal = qs('[data-modal="stu-add"]');
  if (addModal) {
    const depSel = qs('select[name="department_id"]', addModal);
    const courseSel = qs('select[name="course_id"]', addModal);
    const original = courseSel ? Array.from(courseSel.options).map(o => o.cloneNode(true)) : [];
    function rebuild(deptId){
      if (!courseSel || original.length === 0) return;
      const first = original[0].cloneNode(true);
      first.textContent = deptId ? 'Select course' : 'Select department first';
      courseSel.innerHTML = '';
      courseSel.appendChild(first);
      original.slice(1).forEach((opt)=>{
        const od = opt.getAttribute('data-dept');
        if (!deptId || (od && od === String(deptId))) courseSel.appendChild(opt.cloneNode(true));
      });
      courseSel.value = '';
      courseSel.disabled = !deptId;
    }
    if (depSel && courseSel) {
      rebuild(depSel.value);
      on(depSel, 'change', () => rebuild(depSel.value));
    }
  }

  // Edit Student modal dependent dropdown (if modal exists)
  const editModal = qs('[data-modal="stu-edit"]');
  if (editModal) {
    const depSelE = qs('select[name="department_id"]', editModal);
    const courseSelE = qs('select[name="course_id"]', editModal);
    const originalE = courseSelE ? Array.from(courseSelE.options).map(o => o.cloneNode(true)) : [];
    function rebuildEdit(deptId, preserveVal){
      if (!courseSelE || originalE.length === 0) return;
      const first = originalE[0].cloneNode(true);
      first.textContent = deptId ? 'Select course' : 'Select department first';
      courseSelE.innerHTML = '';
      courseSelE.appendChild(first);
      originalE.slice(1).forEach((opt)=>{
        const od = opt.getAttribute('data-dept');
        if (!deptId || (od && od === String(deptId))) courseSelE.appendChild(opt.cloneNode(true));
      });
      if (preserveVal) {
        const still = Array.from(courseSelE.options).some(o => o.value === String(preserveVal));
        courseSelE.value = still ? String(preserveVal) : '';
      } else {
        courseSelE.value = '';
      }
      courseSelE.disabled = !deptId;
    }
    // expose for use in populate handler
    editModal._rebuildCourses = rebuildEdit;
    if (depSelE && courseSelE) {
      rebuildEdit(depSelE.value, courseSelE.value);
      on(depSelE, 'change', () => rebuildEdit(depSelE.value));
    }
  }

  // Populate Edit Student modal and open
  const editForm = qs('#form-edit-student');
  delegate(root, '[data-action="edit-student"]', 'click', (e) => {
    const btn = e.delegateTarget;
    if (!editForm) return;
    const id = btn.getAttribute('data-id');
    editForm.action = `/students/${id}`;
    qsa('input, select, textarea', editForm).forEach((el) => {
      const name = el.name; if (!name) return;
      const val = btn.getAttribute(`data-${name}`);
      if (val !== null) {
        if (el.type === 'date' && val && /\d{4}-\d{2}-\d{2}/.test(val)) el.value = val; else el.value = val;
      }
    });
    // Rebuild courses for selected department and preserve selected course
    const depSelE = qs('select[name="department_id"]', editForm);
    const courseVal = btn.getAttribute('data-course_id');
    if (editModal && typeof editModal._rebuildCourses === 'function') {
      editModal._rebuildCourses(depSelE ? depSelE.value : '', courseVal);
    }
    const modal = qs('[data-modal="stu-edit"]');
    if (modal) modal.classList.add('is-open');
  });

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
      const form = qs('#stu-bulk-archive-form');
      if (form) form.requestSubmit();
    });

    // Initial state
    updateHeader();
    updateRowStyles();
  }
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };

