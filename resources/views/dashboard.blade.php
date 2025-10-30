<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    <script src="{{ mix('js/app.js') }}" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body class="l-shell">
    <aside class="l-aside">
        <div class="brand">
            <div class="brand-icon">🎓</div>
            <div>
                <div class="brand-title">AcadLink</div>
                <div class="brand-sub">Admin Portal</div>
            </div>
        </div>
        <nav class="nav">
            <a class="nav-link {{ ($activeView==='dashboard') ? 'is-active' : '' }}" href="{{ route('dashboard', ['view'=>'dashboard']) }}">
                <span class="ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/>
                    </svg>
                </span>
                <span>Dashboard</span>
            </a>
            <a class="nav-link {{ ($activeView==='faculty') ? 'is-active' : '' }}" href="{{ route('dashboard', ['view'=>'faculty']) }}">
                <span class="ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </span>
                <span>Faculty</span>
            </a>
            <a class="nav-link {{ ($activeView==='students') ? 'is-active' : '' }}" href="{{ route('dashboard', ['view'=>'students']) }}">
                <span class="ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M22 10L12 4 2 10l10 6 10-6Z"/><path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"/>
                    </svg>
                </span>
                <span>Students</span>
            </a>
            <a class="nav-link {{ ($activeView==='reports') ? 'is-active' : '' }}" href="{{ route('dashboard', ['view'=>'reports']) }}">
                <span class="ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
                    </svg>
                </span>
                <span>Reports</span>
            </a>
            <a class="nav-link {{ ($activeView==='system-settings') ? 'is-active' : '' }}" href="{{ route('dashboard', ['view'=>'system-settings']) }}">
                <span class="ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/>
                    </svg>
                </span>
                <span>System Settings</span>
            </a>
            <a class="nav-link {{ ($activeView==='profile') ? 'is-active' : '' }}" href="{{ route('dashboard', ['view'=>'profile']) }}">
                <span class="ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                </span>
                <span>My Profile</span>
            </a>
        </nav>
    </aside>

    <main class="l-main">
        @if($activeView === 'dashboard')
            <h1 class="page-title">Dashboard</h1>
            <p class="page-sub">Overview of students and faculty</p>

            <div class="kpi-grid">
                <div class="card kpi">
                    <div>
                        <div class="label">Total Students</div>
                        <div class="value">{{ number_format($totalStudents) }}</div>
                    </div>
                    <div class="icon" aria-hidden="true"></div>
                </div>
                <div class="card kpi">
                    <div>
                        <div class="label">Total Faculty</div>
                        <div class="value">{{ number_format($totalFaculty) }}</div>
                    </div>
                    <div class="icon" aria-hidden="true"></div>
                </div>
            </div>

            <div class="dash-grid">
                <div class="card">
                    <div class="chart-title">Students per Course</div>
                    <canvas id="studentsChart" height="140"></canvas>
                </div>
                <div class="card">
                    <div class="chart-title">Faculty per Department</div>
                    <canvas id="facultyChart" height="140"></canvas>
                </div>
            </div>
        @elseif($activeView === 'faculty')
            <div data-module="faculty" class="page">
                <div class="page-head">
                    <div>
                        <h1 class="page-title">Faculty Management</h1>
                        <p class="page-sub">Manage faculty member information</p>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center">
                        <button class="btn" data-action="bulk-archive" disabled>Archive Selected</button>
                        <button class="btn btn-dark" data-modal-open="fac-add">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                            Add Faculty
                        </button>
                    </div>
                </div>

                <div class="card" style="margin-bottom:12px">
                    <div class="filter-bar">
                        <form data-filter-form method="GET" action="{{ route('dashboard') }}">
                            <input type="hidden" name="view" value="faculty" />
                            <div class="input-group" style="min-width:320px">
                                <span class="input-group-text">🔎</span>
                                <input type="search" name="q" value="{{ request('q') }}" placeholder="Search by name or email..." class="form-control" />
                            </div>
                            <select name="department_id" class="form-select">
                                <option value="">All Departments</option>
                                @foreach($departments as $d)
                                    <option value="{{ $d->department_id }}" {{ request('department_id')==$d->department_id ? 'selected' : '' }}>{{ $d->department_name }}</option>
                                @endforeach
                            </select>
                            <select name="archived" class="form-select">
                                <option value="0" {{ !$showArchived ? 'selected' : '' }}>Active</option>
                                <option value="1" {{ $showArchived ? 'selected' : '' }}>Archived</option>
                            </select>
                        </form> 
                    </div>
                </div>

                <form id="bulk-archive-form" method="POST" action="{{ route('faculty.bulk-archive') }}" style="display:none">
                    @csrf
                </form>

                <div class="card">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="width:40px">@if(!$showArchived)<input type="checkbox" data-check="all" />@endif</th>
                                    <th>Faculty ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Position</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th style="width:120px">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($faculties as $f)
                                    <tr>
                                        <td>
                                            @if(!$showArchived)
                                                <input type="checkbox" name="ids[]" value="{{ $f->faculty_id }}" form="bulk-archive-form" />
                                            @endif
                                        </td>
                                        <td>{{ $f->faculty_id }}</td>
                                        <td>{{ $f->first_name }} {{ $f->middle_name }} {{ $f->last_name }}</td>
                                        <td>{{ $f->email_address }}</td>
                                        <td>{{ $f->position ?? 'N/A' }}</td>
                                        <td>{{ optional($f->department)->department_name ?? 'N/A' }}</td>
                                        <td>
                                            @php $status = strtolower($f->status ?? 'Active'); @endphp
                                            <span class="badge {{ $status==='active'?'success':($status==='on leave'?'warn':'') }}">{{ $f->status ?? 'Active' }}</span>
                                        </td>
                                        <td>
                                            @if(!$showArchived)
                                                <button type="button" class="btn btn-light btn-sm" data-action="edit" 
                                                    data-id="{{ $f->faculty_id }}"
                                                    data-first_name="{{ $f->first_name }}"
                                                    data-middle_name="{{ $f->middle_name }}"
                                                    data-last_name="{{ $f->last_name }}"
                                                    data-suffix="{{ $f->suffix }}"
                                                    data-date_of_birth="{{ optional($f->date_of_birth)->format('Y-m-d') }}"
                                                    data-sex="{{ $f->sex }}"
                                                    data-email_address="{{ $f->email_address }}"
                                                    data-phone_number="{{ $f->phone_number }}"
                                                    data-address="{{ $f->address }}"
                                                    data-position="{{ $f->position }}"
                                                    data-department_id="{{ $f->department_id }}"
                                                    data-status="{{ $f->status }}">
                                                    ✏️
                                                </button>
                                                <form action="{{ route('faculty.destroy', $f) }}" method="POST" style="display:inline-block">
                                                    @csrf @method('DELETE')
                                                    <button class="btn btn-light btn-sm" type="submit">🗑️</button>
                                                </form>
                                            @else
                                                <form action="{{ route('faculty.restore', $f->faculty_id) }}" method="POST" style="display:inline-block">
                                                    @csrf
                                                    <button class="btn btn-light btn-sm" type="submit">↩️ Restore</button>
                                                </form>
                                            @endif
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="8">No faculty found</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Add Faculty Modal -->
                <div class="modal" data-modal="fac-add">
                    <div class="modal-card">
                        <div class="modal-header">
                            <strong>Add Faculty</strong>
                            <button class="btn btn-light btn-sm" data-modal-close>✖</button>
                        </div>
                        <div class="modal-body">
                            <form method="POST" action="{{ route('faculty.store') }}" id="form-add-faculty" class="form-grid">
                                @csrf
                                <input class="form-control" name="first_name" placeholder="First Name *" required />
                                <input class="form-control" name="middle_name" placeholder="Middle Name" />
                                <input class="form-control" name="last_name" placeholder="Last Name *" required />
                                <input class="form-control" name="suffix" placeholder="Suffix" />
                                <input class="form-control" type="date" name="date_of_birth" placeholder="Date of Birth" />
                                <select class="form-select" name="sex">
                                    <option value="">Sex</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                                <input class="form-control" type="email" name="email_address" placeholder="Email Address *" required />
                                <input class="form-control" name="phone_number" placeholder="Phone Number" />
                                <input class="form-control" name="address" placeholder="Address" />
                                <input class="form-control" name="position" placeholder="Position *" />
                                <select class="form-select" name="department_id">
                                    <option value="">Department</option>
                                    @foreach($departments as $d)
                                        <option value="{{ $d->department_id }}">{{ $d->department_name }}</option>
                                    @endforeach
                                </select>
                                <select class="form-select" name="status" required>
                                    <option>Active</option>
                                    <option>On Leave</option>
                                    <option>Inactive</option>
                                </select>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-light" data-modal-close>Cancel</button>
                            <button class="btn btn-dark" form="form-add-faculty" type="submit">Add Faculty</button>
                        </div>
                    </div>
                </div>

                <!-- Edit Faculty Modal -->
                <div class="modal" data-modal="fac-edit">
                    <div class="modal-card">
                        <div class="modal-header">
                            <strong>Edit Faculty</strong>
                            <button class="btn btn-light btn-sm" data-modal-close>✖</button>
                        </div>
                        <div class="modal-body">
                            <form method="POST" action="#" id="form-edit-faculty" class="form-grid">
                                @csrf
                                @method('PUT')
                                <input class="form-control" name="first_name" placeholder="First Name *" required />
                                <input class="form-control" name="middle_name" placeholder="Middle Name" />
                                <input class="form-control" name="last_name" placeholder="Last Name *" required />
                                <input class="form-control" name="suffix" placeholder="Suffix" />
                                <input class="form-control" type="date" name="date_of_birth" placeholder="Date of Birth" />
                                <select class="form-select" name="sex">
                                    <option value="">Sex</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                                <input class="form-control" type="email" name="email_address" placeholder="Email Address *" required />
                                <input class="form-control" name="phone_number" placeholder="Phone Number" />
                                <input class="form-control" name="address" placeholder="Address" />
                                <input class="form-control" name="position" placeholder="Position *" />
                                <select class="form-select" name="department_id">
                                    <option value="">Department</option>
                                    @foreach($departments as $d)
                                        <option value="{{ $d->department_id }}">{{ $d->department_name }}</option>
                                    @endforeach
                                </select>
                                <select class="form-select" name="status" required>
                                    <option>Active</option>
                                    <option>On Leave</option>
                                    <option>Inactive</option>
                                </select>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-light" data-modal-close>Cancel</button>
                            <button class="btn btn-dark" form="form-edit-faculty" type="submit">Update Faculty</button>
                        </div>
                    </div>
                </div>
            </div>
        @elseif($activeView === 'students')
            <div data-module="students" class="page">
                <div class="page-head">
                    <div>
                        <h1 class="page-title">Student Management</h1>
                        <p class="page-sub">Manage student information</p>
                    </div>
                    <div>
                        <button class="btn btn-dark" data-modal-open="stu-add">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                            Add Student
                        </button>
                    </div>
                </div>

                <div class="card">
                    <div style="font-weight:600">Student List</div>
                    <div class="page-sub" style="margin:4px 0 10px">Search and filter student members</div>
                    <div class="filter-bar">
                        <form data-filter-form method="GET" action="{{ route('dashboard') }}">
                            <input type="hidden" name="view" value="students" />
                            <div class="input-group" style="min-width:320px">
                                <span class="input-group-text">🔎</span>
                                <input type="search" name="q" value="{{ request('q') }}" placeholder="Search by name or email..." class="form-control" />
                            </div>
                            <select name="course_id" class="form-select">
                                <option value="">All Courses</option>
                                @foreach($courses as $c)
                                    <option value="{{ $c->course_id }}" {{ request('course_id')==$c->course_id ? 'selected' : '' }}>{{ $c->course_name }}</option>
                                @endforeach
                            </select>
                            <select name="department_id" class="form-select">
                                <option value="">All Departments</option>
                                @foreach($departments as $d)
                                    <option value="{{ $d->department_id }}" {{ request('department_id')==$d->department_id ? 'selected' : '' }}>{{ $d->department_name }}</option>
                                @endforeach
                            </select>
                        </form>
                    </div>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="width:40px"><input type="checkbox" data-check="all" /></th>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td colspan="8">No students found</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        @elseif($activeView === 'reports')
            <h1 class="page-title">Reports</h1>
            <p class="page-sub">Generate and download reports</p>
            <div data-module="reports" class="page">
                <div class="tabs" data-tabs>
                    <button data-tab="students" class="is-active">Student Reports</button>
                    <button data-tab="faculty">Faculty Reports</button>
                </div>
                <div class="tab-pane is-active" data-pane="students">
                    <div class="card report-card">
                        <div class="report-head">
                            <form data-filter-form class="settings">
                                <select class="form-select"><option>All Courses</option></select>
                                <select class="form-select"><option>All Academic Years</option></select>
                            </form>
                            <button class="download" data-action="download-csv" data-url="#">Download CSV</button>
                        </div>
                        <div class="summary">Total students in report: 0</div>
                    </div>
                </div>
                <div class="tab-pane" data-pane="faculty">
                    <div class="card report-card">
                        <div class="report-head">
                            <form data-filter-form class="settings">
                                <select class="form-select"><option>All Departments</option></select>
                            </form>
                            <button class="download" data-action="download-csv" data-url="#">Download CSV</button>
                        </div>
                        <div class="summary">Total faculty in report: 0</div>
                    </div>
                </div>
            </div>
        @elseif($activeView === 'system-settings')
            <h1 class="page-title">System Settings</h1>
            <p class="page-sub">Manage courses, departments, and academic years</p>
            <div data-module="system-settings" class="page">
                <div class="tabs" data-tabs>
                    <button data-tab="courses" class="{{ $activeTab==='courses' ? 'is-active' : '' }}">Courses</button>
                    <button data-tab="departments" class="{{ $activeTab==='departments' ? 'is-active' : '' }}">Departments</button>
                    <button data-tab="academic-years" class="{{ $activeTab==='academic-years' ? 'is-active' : '' }}">Academic Years</button>
                </div>

                <!-- Courses Pane -->
                <div class="tab-pane {{ $activeTab==='courses' ? 'is-active' : '' }}" data-pane="courses">
                    <div class="card" style="margin-top:12px">
                        <div class="page-head">
                            <div>
                                <div style="font-weight:600">Courses</div>
                                <div class="page-sub" style="margin:4px 0 0">Manage course information</div>
                            </div>
                            <button class="btn btn-dark" data-modal-open="course-add">+ Add Course</button>
                        </div>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Department</th>
                                        <th style="width:120px">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($courses as $c)
                                        <tr>
                                            <td>{{ $c->course_name }}</td>
                                            <td>{{ optional($c->department)->department_name ?? 'N/A' }}</td>
                                            <td>
                                                <button class="btn btn-light btn-sm" type="button" data-action="edit-course"
                                                    data-id="{{ $c->course_id }}"
                                                    data-course_name="{{ $c->course_name }}"
                                                    data-department_id="{{ $c->department_id }}">✏️</button>
                                                <form data-confirm="Remove course?" action="{{ route('settings.courses.destroy', $c) }}" method="POST" style="display:inline-block">
                                                    @csrf @method('DELETE')
                                                    <button class="btn btn-light btn-sm" type="submit">🗑️</button>
                                                </form>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr><td colspan="3">No courses found</td></tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Departments Pane -->
                <div class="tab-pane {{ $activeTab==='departments' ? 'is-active' : '' }}" data-pane="departments">
                    <div class="card" style="margin-top:12px">
                        <div class="page-head">
                            <div>
                                <div style="font-weight:600">Departments</div>
                                <div class="page-sub" style="margin:4px 0 0">Manage department information</div>
                            </div>
                            <button class="btn btn-dark" data-modal-open="department-add">+ Add Department</button>
                        </div>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Department Name</th>
                                        <th style="width:120px">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($departments as $d)
                                        <tr>
                                            <td>{{ $d->department_name }}</td>
                                            <td>
                                                <button class="btn btn-light btn-sm" type="button" data-action="edit-department"
                                                    data-id="{{ $d->department_id }}"
                                                    data-department_name="{{ $d->department_name }}"
                                                    data-department_head="{{ $d->department_head }}">✏️</button>
                                                <form data-confirm="Remove department?" action="{{ route('settings.departments.destroy', $d) }}" method="POST" style="display:inline-block">
                                                    @csrf @method('DELETE')
                                                    <button class="btn btn-light btn-sm" type="submit">🗑️</button>
                                                </form>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr><td colspan="2">No departments found</td></tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Academic Years Pane -->
                <div class="tab-pane {{ $activeTab==='academic-years' ? 'is-active' : '' }}" data-pane="academic-years">
                    <div class="card" style="margin-top:12px">
                        <div class="page-head">
                            <div>
                                <div style="font-weight:600">Academic Years</div>
                                <div class="page-sub" style="margin:4px 0 0">Manage academic year information</div>
                            </div>
                            <button class="btn btn-dark" data-modal-open="year-add">+ Add Academic Year</button>
                        </div>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>School Year</th>
                                        <th style="width:120px">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($academicYears as $y)
                                        <tr>
                                            <td>{{ $y->school_year }}</td>
                                            <td>
                                                <button class="btn btn-light btn-sm" type="button" data-action="edit-year"
                                                    data-id="{{ $y->academic_year_id }}"
                                                    data-school_year="{{ $y->school_year }}">✏️</button>
                                                <form data-confirm="Remove academic year?" action="{{ route('settings.years.destroy', $y) }}" method="POST" style="display:inline-block">
                                                    @csrf @method('DELETE')
                                                    <button class="btn btn-light btn-sm" type="submit">🗑️</button>
                                                </form>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr><td colspan="2">No academic years found</td></tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Modals: Courses -->
                <div class="modal is-themed" data-modal="course-add">
                    <div class="modal-card">
                        <div class="modal-header"><strong>Add Course</strong><button class="btn btn-light btn-sm" data-modal-close>✖</button></div>
                        <div class="modal-body">
                            <form method="POST" action="{{ route('settings.courses.store') }}" id="form-add-course" class="form-grid">
                                @csrf
                                <input class="form-control" name="course_name" placeholder="Course Name *" required />
                                <select class="form-select" name="department_id">
                                    <option value="">Department</option>
                                    @foreach($departments as $d)
                                        <option value="{{ $d->department_id }}">{{ $d->department_name }}</option>
                                    @endforeach
                                </select>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-light" data-modal-close>Cancel</button>
                            <button class="btn btn-dark" form="form-add-course" type="submit">Add Course</button>
                        </div>
                    </div>
                </div>
                <div class="modal" data-modal="course-edit">
                    <div class="modal-card">
                        <div class="modal-header"><strong>Edit Course</strong><button class="btn btn-light btn-sm" data-modal-close>✖</button></div>
                        <div class="modal-body">
                            <form method="POST" action="#" id="form-edit-course" class="form-grid">
                                @csrf @method('PUT')
                                <input class="form-control" name="course_name" placeholder="Course Name *" required />
                                <select class="form-select" name="department_id">
                                    <option value="">Department</option>
                                    @foreach($departments as $d)
                                        <option value="{{ $d->department_id }}">{{ $d->department_name }}</option>
                                    @endforeach
                                </select>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-light" data-modal-close>Cancel</button>
                            <button class="btn btn-dark" form="form-edit-course" type="submit">Update Course</button>
                        </div>
                    </div>
                </div>

                <!-- Modals: Departments -->
                <div class="modal is-themed" data-modal="department-add">
                    <div class="modal-card">
                        <div class="modal-header"><strong>Add Department</strong><button class="btn btn-light btn-sm" data-modal-close>✖</button></div>
                        <div class="modal-body">
                            <form method="POST" action="{{ route('settings.departments.store') }}" id="form-add-department" class="form-grid">
                                @csrf
                                <input class="form-control" name="department_name" placeholder="Department Name *" required />
                                <input class="form-control" name="department_head" placeholder="Department Head" />
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-light" data-modal-close>Cancel</button>
                            <button class="btn btn-dark" form="form-add-department" type="submit">Add Department</button>
                        </div>
                    </div>
                </div>
                <div class="modal" data-modal="department-edit">
                    <div class="modal-card">
                        <div class="modal-header"><strong>Edit Department</strong><button class="btn btn-light btn-sm" data-modal-close>✖</button></div>
                        <div class="modal-body">
                            <form method="POST" action="#" id="form-edit-department" class="form-grid">
                                @csrf @method('PUT')
                                <input class="form-control" name="department_name" placeholder="Department Name *" required />
                                <input class="form-control" name="department_head" placeholder="Department Head" />
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-light" data-modal-close>Cancel</button>
                            <button class="btn btn-dark" form="form-edit-department" type="submit">Update Department</button>
                        </div>
                    </div>
                </div>

                <!-- Modals: Academic Years -->
                <div class="modal is-themed" data-modal="year-add">
                    <div class="modal-card">
                        <div class="modal-header"><strong>Add Academic Year</strong><button class="btn btn-light btn-sm" data-modal-close>✖</button></div>
                        <div class="modal-body">
                            <form method="POST" action="{{ route('settings.years.store') }}" id="form-add-year" class="form-grid">
                                @csrf
                                <input class="form-control" name="school_year" placeholder="e.g., 2024 - 2025" required />
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-light" data-modal-close>Cancel</button>
                            <button class="btn btn-dark" form="form-add-year" type="submit">Add Academic Year</button>
                        </div>
                    </div>
                </div>
                <div class="modal" data-modal="year-edit">
                    <div class="modal-card">
                        <div class="modal-header"><strong>Edit Academic Year</strong><button class="btn btn-light btn-sm" data-modal-close>✖</button></div>
                        <div class="modal-body">
                            <form method="POST" action="#" id="form-edit-year" class="form-grid">
                                @csrf @method('PUT')
                                <input class="form-control" name="school_year" placeholder="e.g., 2024 - 2025" required />
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-light" data-modal-close>Cancel</button>
                            <button class="btn btn-dark" form="form-edit-year" type="submit">Update Academic Year</button>
                        </div>
                    </div>
                </div>
            </div>
        @elseif($activeView === 'profile')
            <h1 class="page-title">My Profile</h1>
            <p class="page-sub">Manage your admin account</p>
            <div data-module="my-profile" class="page">
                <div class="profile-card">
                    <div class="avatar" aria-hidden="true"></div>
                    <form style="margin-top:12px;max-width:420px">
                        <div class="form-grid">
                            <input class="form-control" placeholder="Username" />
                            <input class="form-control" placeholder="Email" />
                            <input class="form-control" type="password" placeholder="Password" />
                            <button data-action="toggle-password" class="btn btn-light" type="button">Show/Hide Password</button>
                        </div>
                        <div class="actions"><button class="btn btn-primary" type="submit">Save</button></div>
                    </form>
                </div>
            </div>
        @endif
    </main>

    @if (session('status'))
        <div class="toast" id="app-toast" role="status" aria-live="polite">{{ session('status') }}</div>
        <script>
            setTimeout(() => { const t = document.getElementById('app-toast'); if (t) t.remove(); }, 3500);
        </script>
    @endif

    <script>
        const studentLabels = @json($studentLabels);
        const studentData = @json($studentData);
        const facultyLabels = @json($facultyLabels);
        const facultyData = @json($facultyData);

        const sCanvas = document.getElementById('studentsChart');
        if (sCanvas) {
            new Chart(sCanvas, {
                type: 'bar',
                data: {labels: studentLabels, datasets: [{
                    label: 'Students',
                    data: studentData,
                    backgroundColor: '#3b82f6'
                }]},
                options: {plugins:{legend:{display:true}},scales:{y:{beginAtZero:true}}}
            });
        }

        const fCanvas = document.getElementById('facultyChart');
        if (fCanvas) {
            new Chart(fCanvas, {
                type: 'doughnut',
                data: {labels: facultyLabels, datasets: [{
                    label: 'Faculty',
                    data: facultyData,
                    backgroundColor: ['#8b5cf6','#6366f1','#22c55e','#f59e0b','#ef4444','#06b6d4']
                }]},
                options: {plugins:{legend:{position:'bottom'}}}
            });
        }
    </script>
</body>
</html>
