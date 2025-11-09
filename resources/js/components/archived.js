import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiFilter, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../sass/settings.scss';
import '../../sass/student.scss';
import '../../sass/archived.scss';

const statusClasses = {
    continuing: 'student-status student-status--continuing',
    returnee: 'student-status student-status--returnee',
    dropped: 'student-status student-status--dropped',
};

const entityOptions = [
    { label: 'Student', value: 'student' },
    { label: 'Faculty', value: 'faculty' },
    { label: 'Department', value: 'department' },
    { label: 'Course', value: 'course' },
    { label: 'Academic Year', value: 'academicYear' },
];

const entityConfig = {
    student: {
        label: 'Student',
        endpoint: '/api/students',
        idKey: 'student_id',
        backPath: '/student',
        filters: { department: true, course: true },
        searchText: (record) =>
            [
                record.full_name,
                record.first_name,
                record.last_name,
                record.department?.name,
                record.course?.course_name,
                record.course?.name,
                record.status,
            ]
                .filter(Boolean)
                .join(' '),
    },
    faculty: {
        label: 'Faculty',
        endpoint: '/api/faculties',
        idKey: 'faculty_id',
        backPath: '/faculty',
        filters: { department: true },
        searchText: (record) =>
            [
                record.full_name,
                record.first_name,
                record.last_name,
                record.department?.name,
                record.position,
                record.status,
            ]
                .filter(Boolean)
                .join(' '),
    },
    department: {
        label: 'Department',
        endpoint: '/api/departments',
        idKey: 'department_id',
        backPath: '/settings',
        filters: { course: true },
        searchText: (record) =>
            [record.name, ...(record.courses || []).map((course) => course.course_name || course.name)]
                .filter(Boolean)
                .join(' '),
    },
    course: {
        label: 'Course',
        endpoint: '/api/courses',
        idKey: 'course_id',
        backPath: '/settings',
        filters: { department: true },
        searchText: (record) =>
            [record.course_name || record.name, record.department?.name].filter(Boolean).join(' '),
    },
    academicYear: {
        label: 'Academic Year',
        endpoint: '/api/academic-years',
        idKey: 'academic_year_id',
        backPath: '/settings',
        filters: {},
        searchText: (record) => [record.school_year].filter(Boolean).join(' '),
    },
};

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function Archived() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialEntityParam = searchParams.get('entity');
    const initialEntity = entityOptions.some((option) => option.value === initialEntityParam)
        ? initialEntityParam
        : 'student';

    const [activeEntity, setActiveEntity] = useState(initialEntity);
    const [records, setRecords] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);

    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [courseFilter, setCourseFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    useEffect(() => {
        const param = searchParams.get('entity');
        const normalized = entityOptions.some((option) => option.value === param) ? param : 'student';
        if (normalized !== activeEntity) {
            setActiveEntity(normalized);
        }
    }, [searchParams]);

    useEffect(() => {
        setSearchParams((previous) => {
            const current = previous.get('entity');
            if (current === activeEntity) {
                return previous;
            }
            const next = new URLSearchParams(previous);
            next.set('entity', activeEntity);
            return next;
        });
    }, [activeEntity, setSearchParams]);

    useEffect(() => {
        const loadLookups = async () => {
            try {
                const [deptRes, courseRes] = await Promise.all([
                    fetch('/api/departments'),
                    fetch('/api/courses'),
                ]);

                const [deptData, courseData] = await Promise.all([deptRes.json(), courseRes.json()]);
                setDepartments(Array.isArray(deptData) ? deptData : []);
                setCourses(Array.isArray(courseData) ? courseData : []);
            } catch (error) {
                console.error('Error loading archive filters:', error);
            }
        };

        loadLookups();
    }, []);

    useEffect(() => {
        const loadRecords = async () => {
            const config = entityConfig[activeEntity];
            if (!config) {
                setRecords([]);
                return;
            }

            setLoading(true);
            setDepartmentFilter('all');
            setCourseFilter('all');
            setSearchTerm('');

            try {
                const response = await fetch(`${config.endpoint}?archived=1`);
                const data = await response.json();
                setRecords(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(`Error loading archived ${config.label.toLowerCase()}s:`, error);
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        loadRecords();
    }, [activeEntity]);

    const filtersConfig = entityConfig[activeEntity]?.filters || {};

    const filteredRecords = useMemo(() => {
        let data = Array.isArray(records) ? [...records] : [];

        if (activeEntity === 'student') {
            if (filtersConfig.department && departmentFilter !== 'all') {
                data = data.filter(
                    (record) => String(record.department_id ?? '') === String(departmentFilter),
                );
            }

            if (filtersConfig.course && courseFilter !== 'all') {
                data = data.filter((record) => String(record.course_id ?? '') === String(courseFilter));
            }
        } else if (activeEntity === 'faculty') {
            if (filtersConfig.department && departmentFilter !== 'all') {
                data = data.filter(
                    (record) => String(record.department_id ?? '') === String(departmentFilter),
                );
            }
        } else if (activeEntity === 'course') {
            if (filtersConfig.department && departmentFilter !== 'all') {
                data = data.filter(
                    (record) => String(record.department_id ?? '') === String(departmentFilter),
                );
            }
        } else if (activeEntity === 'department') {
            if (filtersConfig.course && courseFilter !== 'all') {
                data = data.filter((record) =>
                    Array.isArray(record.courses)
                        ? record.courses.some(
                              (course) => String(course.course_id ?? '') === String(courseFilter),
                          )
                        : false,
                );
            }
        }

        const config = entityConfig[activeEntity];
        const factory = config?.searchText;
        const normalizedTerm = searchTerm.trim().toLowerCase();

        if (factory && normalizedTerm) {
            data = data.filter((record) => factory(record).toLowerCase().includes(normalizedTerm));
        }

        return data;
    }, [records, activeEntity, departmentFilter, courseFilter, searchTerm, filtersConfig]);

    const closeSuccessModal = () => {
        setSuccessModalOpen(false);
        setSuccessMessage('');
    };

    const refreshRecords = () => {
        const config = entityConfig[activeEntity];
        if (!config) return;
        setLoading(true);
        fetch(`${config.endpoint}?archived=1`)
            .then((response) => response.json())
            .then((data) => setRecords(Array.isArray(data) ? data : []))
            .catch((error) => {
                console.error(`Error refreshing archived ${config.label.toLowerCase()}s:`, error);
                setRecords([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleRestore = async (recordId) => {
        const config = entityConfig[activeEntity];
        if (!config || !recordId) return;

        try {
            const response = await fetch(`${config.endpoint}/${recordId}/restore`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccessMessage(`${config.label} restored.`);
                setSuccessModalOpen(true);
                refreshRecords();
            }
        } catch (error) {
            console.error(`Error restoring ${config.label.toLowerCase()}:`, error);
        }
    };

    const handleDelete = async (recordId) => {
        const config = entityConfig[activeEntity];
        if (!config || !recordId) return;

        const confirmed = window.confirm(
            `Delete this ${config.label.toLowerCase()} permanently? This action cannot be undone.`,
        );
        if (!confirmed) return;

        try {
            const response = await fetch(`${config.endpoint}/${recordId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccessMessage(`${config.label} deleted permanently.`);
                setSuccessModalOpen(true);
                refreshRecords();
            }
        } catch (error) {
            console.error(`Error deleting ${config.label.toLowerCase()}:`, error);
        }
    };

    const renderSuccessModal = () => {
        if (!successModalOpen) {
            return null;
        }

        return (
            <div className="settings-modal__overlay" onClick={closeSuccessModal}>
                <div className="settings-modal settings-modal--success" onClick={(event) => event.stopPropagation()}>
                    <button
                        type="button"
                        className="settings-modal__close"
                        aria-label="Close"
                        onClick={closeSuccessModal}
                    >
                        <FiX size={20} aria-hidden="true" />
                    </button>
                    <div className="settings-modal__success-icon">
                        <FiCheck size={42} aria-hidden="true" />
                    </div>
                    <h2 className="settings-modal__success-title">Success</h2>
                    <p className="settings-modal__success-message">{successMessage || 'Action completed.'}</p>
                </div>
            </div>
        );
    };

    const renderEmptyState = () => {
        const label = entityConfig[activeEntity]?.label || 'item';
        return (
            <div className="archive-empty">
                <div className="archive-empty__icon" aria-hidden="true">
                    <FiFilter size={64} />
                </div>
                <h2>No archived {label.toLowerCase()}s yet</h2>
                <p>When you archive a {label.toLowerCase()}, it will appear here for quick restore or cleanup.</p>
            </div>
        );
    };

    const renderTableHeader = () => {
        switch (activeEntity) {
            case 'student':
                return (
                    <header className="settings-table__header" style={{ '--settings-columns': 6 }}>
                        <span>Student</span>
                        <span>Department</span>
                        <span>Course</span>
                        <span>Status</span>
                        <span>Archived At</span>
                        <span>Action</span>
                    </header>
                );
            case 'faculty':
                return (
                    <header className="settings-table__header" style={{ '--settings-columns': 5 }}>
                        <span>Faculty</span>
                        <span>Department</span>
                        <span>Position</span>
                        <span>Archived At</span>
                        <span>Action</span>
                    </header>
                );
            case 'department':
                return (
                    <header className="settings-table__header" style={{ '--settings-columns': 4 }}>
                        <span>Department</span>
                        <span>Courses</span>
                        <span>Archived At</span>
                        <span>Action</span>
                    </header>
                );
            case 'course':
                return (
                    <header className="settings-table__header" style={{ '--settings-columns': 5 }}>
                        <span>Course</span>
                        <span>Department</span>
                        <span>Archived At</span>
                        <span>Action</span>
                    </header>
                );
            case 'academicYear':
                return (
                    <header className="settings-table__header" style={{ '--settings-columns': 3 }}>
                        <span>Academic Year</span>
                        <span>Archived At</span>
                        <span>Action</span>
                    </header>
                );
            default:
                return null;
        }
    };

    const renderTableRow = (record) => {
        const config = entityConfig[activeEntity];
        const recordId = record?.[config?.idKey];

        switch (activeEntity) {
            case 'student':
                return (
                    <div key={recordId} className="settings-table__row" style={{ '--settings-columns': 6 }}>
                        <span>{record.full_name || `${record.first_name} ${record.last_name}`}</span>
                        <span>{record.department?.name || '—'}</span>
                        <span>{record.course?.course_name || record.course?.name || '—'}</span>
                        <span
                            className={
                                statusClasses[(record.status || '').toLowerCase()] ||
                                'student-status student-status--continuing'
                            }
                        >
                            {record.status || 'Continuing'}
                        </span>
                        <span>{formatDate(record.archived_at)}</span>
                        <span className="settings-table__actions">
                            <button
                                type="button"
                                className="settings-chip settings-chip--outline"
                                onClick={() => handleRestore(recordId)}
                            >
                                Restore
                            </button>
                            <button
                                type="button"
                                className="settings-chip settings-chip--ghost settings-chip--danger"
                                onClick={() => handleDelete(recordId)}
                            >
                                Delete
                            </button>
                        </span>
                    </div>
                );
            case 'faculty':
                return (
                    <div key={recordId} className="settings-table__row" style={{ '--settings-columns': 5 }}>
                        <span>{record.full_name || `${record.first_name} ${record.last_name}`}</span>
                        <span>{record.department?.name || '—'}</span>
                        <span>{record.position || '—'}</span>
                        <span>{formatDate(record.archived_at)}</span>
                        <span className="settings-table__actions">
                            <button
                                type="button"
                                className="settings-chip settings-chip--outline"
                                onClick={() => handleRestore(recordId)}
                            >
                                Restore
                            </button>
                            <button
                                type="button"
                                className="settings-chip settings-chip--ghost settings-chip--danger"
                                onClick={() => handleDelete(recordId)}
                            >
                                Delete
                            </button>
                        </span>
                    </div>
                );
            case 'department':
                return (
                    <div key={recordId} className="settings-table__row" style={{ '--settings-columns': 4 }}>
                        <span>{record.name}</span>
                        <span>
                            {Array.isArray(record.courses) && record.courses.length > 0
                                ? record.courses
                                      .map((course) => course.course_name || course.name)
                                      .filter(Boolean)
                                      .join(', ')
                                : '—'}
                        </span>
                        <span>{formatDate(record.archived_at)}</span>
                        <span className="settings-table__actions">
                            <button
                                type="button"
                                className="settings-chip settings-chip--outline"
                                onClick={() => handleRestore(recordId)}
                            >
                                Restore
                            </button>
                            <button
                                type="button"
                                className="settings-chip settings-chip--ghost settings-chip--danger"
                                onClick={() => handleDelete(recordId)}
                            >
                                Delete
                            </button>
                        </span>
                    </div>
                );
            case 'course':
                return (
                    <div key={recordId} className="settings-table__row" style={{ '--settings-columns': 5 }}>
                        <span>{record.course_name || record.name}</span>
                        <span>{record.department?.name || '—'}</span>
                        <span>{formatDate(record.archived_at)}</span>
                        <span className="settings-table__actions">
                            <button
                                type="button"
                                className="settings-chip settings-chip--outline"
                                onClick={() => handleRestore(recordId)}
                            >
                                Restore
                            </button>
                            <button
                                type="button"
                                className="settings-chip settings-chip--ghost settings-chip--danger"
                                onClick={() => handleDelete(recordId)}
                            >
                                Delete
                            </button>
                        </span>
                    </div>
                );
            case 'academicYear':
                return (
                    <div key={recordId} className="settings-table__row" style={{ '--settings-columns': 3 }}>
                        <span>{record.school_year}</span>
                        <span>{formatDate(record.archived_at)}</span>
                        <span className="settings-table__actions">
                            <button
                                type="button"
                                className="settings-chip settings-chip--outline"
                                onClick={() => handleRestore(recordId)}
                            >
                                Restore
                            </button>
                            <button
                                type="button"
                                className="settings-chip settings-chip--ghost settings-chip--danger"
                                onClick={() => handleDelete(recordId)}
                            >
                                Delete
                            </button>
                        </span>
                    </div>
                );
            default:
                return null;
        }
    };

    const config = entityConfig[activeEntity];
    const showDepartmentFilter = Boolean(filtersConfig.department);
    const showCourseFilter = Boolean(filtersConfig.course);
    const showSearchInput = Boolean(config?.searchText);

    const handleBackClick = () => {
        if (config?.backPath) {
            navigate(config.backPath);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="archive-page">
            <header className="archive-header">
                <button type="button" className="archive-header__back" onClick={handleBackClick}>
                    <FiArrowLeft size={18} aria-hidden="true" />
                    <span>{config?.label} Archive</span>
                </button>
            </header>

            <section className="archive-toolbar" aria-label="Archive filters">
                <div className="archive-toolbar__filters">
                    <span className="archive-toolbar__icon" aria-hidden="true">
                        <FiFilter size={20} />
                    </span>

                    {showSearchInput && (
                        <label className="archive-toolbar__search" aria-label="Search archived records">
                            <FiSearch size={18} aria-hidden="true" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder={`Search ${config?.label.toLowerCase()}s`}
                            />
                        </label>
                    )}

                    {showDepartmentFilter && (
                        <select
                            className="archive-toolbar__select"
                            value={departmentFilter}
                            onChange={(event) => setDepartmentFilter(event.target.value)}
                            aria-label="Filter by department"
                        >
                            <option value="all">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.department_id} value={dept.department_id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {showCourseFilter && (
                        <select
                            className="archive-toolbar__select"
                            value={courseFilter}
                            onChange={(event) => setCourseFilter(event.target.value)}
                            aria-label="Filter by course"
                        >
                            <option value="all">All Courses</option>
                            {courses.map((course) => (
                                <option key={course.course_id} value={course.course_id}>
                                    {course.course_name || course.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <select
                        className="archive-toolbar__select archive-toolbar__select--entity"
                        value={activeEntity}
                        onChange={(event) => setActiveEntity(event.target.value)}
                        aria-label="Select archive category"
                    >
                        {entityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <main className="archive-content">
                <div className="settings-table" aria-label={`Archived ${config?.label.toLowerCase()} list`}>
                    {renderTableHeader()}

                    <div className="settings-table__body">
                        {loading ? (
                            <div className="settings-table__empty">Loading...</div>
                        ) : filteredRecords.length === 0 ? (
                            renderEmptyState()
                        ) : (
                            filteredRecords.map((record) => renderTableRow(record))
                        )}
                    </div>
                </div>
            </main>

            {renderSuccessModal()}
        </div>
    );
}

export default Archived;
