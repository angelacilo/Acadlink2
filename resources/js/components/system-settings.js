import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiArchive, FiCheck, FiChevronLeft, FiChevronRight, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideBarMenu from './sidebarmenu';
import '../../sass/settings.scss';

const icons = {
    search: <FiSearch size={20} aria-hidden="true" />,
    archive: <FiArchive size={18} aria-hidden="true" />,
    plus: <FiPlus size={18} aria-hidden="true" />,
    chevronLeft: <FiChevronLeft size={18} aria-hidden="true" />,
    chevronRight: <FiChevronRight size={18} aria-hidden="true" />,
    close: <FiX size={20} aria-hidden="true" />,
    check: <FiCheck size={42} aria-hidden="true" />,
};

const tabConfig = {
    course: {
        label: 'Course',
        addLabel: 'Add Courses',
        columns: [
            { key: 'name', label: 'Course Name' },
            { key: 'department', label: 'Department' },
            { key: 'actions', label: 'Action', type: 'actions' },
        ],
    },
    department: {
        label: 'Department',
        addLabel: 'Add Department',
        columns: [
            { key: 'name', label: 'Department Name' },
            { key: 'head', label: 'Department Head' },
            { key: 'actions', label: 'Action', type: 'actions' },
        ],
    },
    academicYear: {
        label: 'Academic Year',
        addLabel: 'Add Academic Year',
        columns: [
            { key: 'year', label: 'Academic Year' },
            { key: 'actions', label: 'Action', type: 'actions' },
        ],
    },
};

const tabOrder = ['course', 'department', 'academicYear'];
const successEntityMap = {
    course: 'Course',
    department: 'Department',
    academicYear: 'Academic Year',
};

function SystemSettings() {
    const [activeTab, setActiveTab] = useState(tabOrder[0]);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    const [modalType, setModalType] = useState(null);
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const [courseForm, setCourseForm] = useState({ course_name: '', department_id: '' });
    const [departmentForm, setDepartmentForm] = useState({ name: '' });
    const [academicYearForm, setAcademicYearForm] = useState({ school_year: '' });

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successEntity, setSuccessEntity] = useState('item');

    const navigate = useNavigate();
    const [editingId, setEditingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState({ course: 1, department: 1, academicYear: 1 });

    const archiveEntityMap = {
        course: 'course',
        department: 'department',
        academicYear: 'academicYear',
    };

    const fetchAll = async () => {
        setListLoading(true);
        try {
            const [courseRes, deptRes, ayRes] = await Promise.all([
                axios.get('/api/courses'),
                axios.get('/api/departments'),
                axios.get('/api/academic-years'),
            ]);

            const courseData = Array.isArray(courseRes.data?.data) ? courseRes.data.data : courseRes.data;
            const deptData = Array.isArray(deptRes.data?.data) ? deptRes.data.data : deptRes.data;
            const ayData = Array.isArray(ayRes.data?.data) ? ayRes.data.data : ayRes.data;

            setCourses(Array.isArray(courseData) ? courseData : []);
            setDepartments(Array.isArray(deptData) ? deptData : []);
            setAcademicYears(Array.isArray(ayData) ? ayData : []);
        } catch (error) {
            console.error('Error fetching settings data:', error);
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);


    const resetFormForType = (type) => {
        if (type === 'course') {
            setCourseForm({ course_name: '', department_id: '' });
        } else if (type === 'department') {
            setDepartmentForm({ name: '' });
        } else if (type === 'academicYear') {
            setAcademicYearForm({ school_year: '' });
        }
    };

    const closeModal = () => {
        const currentType = modalType;
        setModalType(null);
        setEditingId(null);
        if (currentType) {
            resetFormForType(currentType);
        }
        setFormError('');
        setFormLoading(false);
    };

    const handleAddClick = () => {
        const entityLabel = successEntityMap[activeTab] || 'Item';
        setEditingId(null);
        resetFormForType(activeTab);
        setFormError('');
        setFormLoading(false);
        setSuccessEntity(entityLabel);
        setSuccessMessage('');
        setModalType(activeTab);
    };

    const handleArchiveNavigate = () => {
        const entity = archiveEntityMap[activeTab] || 'course';
        navigate(`/archive?entity=${entity}`);
    };

    const handleArchive = async (id) => {
        if (!id) return;
        const confirmArchive = window.confirm('Are you sure you want to archive this item?');
        if (!confirmArchive) return;

        try {
            let endpoint = '';
            if (activeTab === 'course') {
                endpoint = `/api/courses/${id}/archive`;
            } else if (activeTab === 'department') {
                endpoint = `/api/departments/${id}/archive`;
            } else if (activeTab === 'academicYear') {
                endpoint = `/api/academic-years/${id}/archive`;
            }

            if (!endpoint) return;

            const response = await axios.post(endpoint);
            const data = response.data || {};

            if ((response.status >= 200 && response.status < 300) && data.success) {
                const entityLabel = successEntityMap[activeTab] || 'Item';
                setSuccessEntity(entityLabel);
                setSuccessMessage(`${entityLabel} archived.`);
                setSuccessModalOpen(true);
                fetchAll();
            }
        } catch (error) {
            console.error('Error archiving record:', error);
        }
    };

    const buildPayloadForType = (type) => {
        if (type === 'course') {
            return {
                course_name: courseForm.course_name,
                department_id: courseForm.department_id ? Number(courseForm.department_id) : null,
            };
        }
        if (type === 'department') {
            return {
                name: departmentForm.name,
            };
        }
        if (type === 'academicYear') {
            return {
                school_year: academicYearForm.school_year,
            };
        }
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!modalType) return;

        const entity = successEntityMap[modalType] || 'item';
        const payload = buildPayloadForType(modalType);
        if (!payload) return;

        const isEdit = Boolean(editingId);
        const url = isEdit ? `/api/${modalType === 'academicYear' ? 'academic-years' : `${modalType}s`}/${editingId}` : `/api/${modalType === 'academicYear' ? 'academic-years' : `${modalType}s`}`;
        const method = isEdit ? 'PUT' : 'POST';

        setFormLoading(true);
        setFormError('');

        try {
            const response = await axios({
                url,
                method,
                data: payload,
            });

            const data = response.data || {};

            if ((response.status >= 200 && response.status < 300) && data.success) {
                const actionLabel = isEdit ? 'updated' : 'added';
                setSuccessEntity(entity);
                setSuccessMessage(`${entity} ${actionLabel}.`);
                setSuccessModalOpen(true);
                closeModal();
                fetchAll();
            } else {
                const errorMessage = data.errors
                    ? Object.values(data.errors)
                          .flat()
                          .join(' ')
                    : data.message || `Unable to ${isEdit ? 'update' : 'add'} ${entity.toLowerCase()}.`;
                setFormError(errorMessage);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormError('Something went wrong. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const currentRows = useMemo(() => {
        if (activeTab === 'course') {
            return courses.map((course) => ({
                id: course.course_id,
                name: course.course_name || '—',
                department: course.department?.name || course.department_name || '—',
                raw: course,
            }));
        }

        if (activeTab === 'department') {
            return departments.map((dept) => ({
                id: dept.department_id,
                name: dept.name || '—',
                head: dept.faculty_head_name || dept.faculty_head || '—',
                raw: dept,
            }));
        }

        return academicYears.map((ay) => ({
            id: ay.academic_year_id,
            year: ay.school_year || '—',
            raw: ay,
        }));
    }, [activeTab, courses, departments, academicYears]);

    const pageSize = 20;
    const pageState = currentPage[activeTab] || 1;
    const totalPages = Math.max(1, Math.ceil(currentRows.length / pageSize));
    const paginatedRows = useMemo(() => {
        const startIndex = (pageState - 1) * pageSize;
        return currentRows.slice(startIndex, startIndex + pageSize);
    }, [currentRows, pageState]);

    useEffect(() => {
        setCurrentPage((previous) => ({ ...previous, [activeTab]: 1 }));
    }, [activeTab]);

    useEffect(() => {
        setCurrentPage((previous) => {
            const current = previous[activeTab] || 1;
            const bounded = Math.min(Math.max(1, current), totalPages);
            if (bounded === current) {
                return previous;
            }
            return { ...previous, [activeTab]: bounded };
        });
    }, [activeTab, totalPages]);

    const openEditModal = (type, record) => {
        if (!type || !record) return;
        const entityLabel = successEntityMap[type] || 'Item';
        setModalType(type);
        setEditingId(record.id);
        setFormError('');
        setFormLoading(false);
        setSuccessEntity(entityLabel);
        setSuccessMessage('');
        setCurrentPage((previous) => ({ ...previous, [type]: 1 }));

        if (type === 'course') {
            setCourseForm({
                course_name: record.raw?.course_name || '',
                department_id: record.raw?.department_id ? String(record.raw.department_id) : '',
            });
        } else if (type === 'department') {
            setDepartmentForm({ name: record.raw?.name || '' });
        } else if (type === 'academicYear') {
            setAcademicYearForm({ school_year: record.raw?.school_year || '' });
        }
    };

    const renderModal = () => {
        if (!modalType) return null;

        const isEdit = Boolean(editingId);

        const titleMap = {
            course: isEdit ? 'EDIT COURSE' : 'ADD COURSE',
            department: isEdit ? 'EDIT DEPARTMENT' : 'ADD DEPARTMENT',
            academicYear: isEdit ? 'EDIT ACADEMIC YEAR' : 'ADD ACADEMIC YEAR',
        };

        const subtitleMap = {
            course: isEdit ? 'Update course information' : 'Enter course information',
            department: isEdit ? 'Update department information' : 'Enter department information',
            academicYear: isEdit ? 'Update academic year information' : 'Enter academic year information',
        };

        const submitLabelMap = {
            course: formLoading ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update Course' : 'Add Course',
            department: formLoading ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update Department' : 'Add Department',
            academicYear:
                formLoading ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update Academic Year' : 'Add Academic Year',
        };

        return (
            <div className="settings-modal__overlay" onClick={closeModal}>
                <div className="settings-modal" onClick={(event) => event.stopPropagation()}>
                    <div className="settings-modal__header">
                        <div>
                            <h2 className="settings-modal__title">{titleMap[modalType]}</h2>
                            <p className="settings-modal__subtitle">{subtitleMap[modalType]}</p>
                        </div>
                        <button
                            type="button"
                            className="settings-modal__close"
                            aria-label="Close"
                            onClick={closeModal}
                        >
                            {icons.close}
                        </button>
                    </div>

                    <form className="settings-modal__form" onSubmit={handleSubmit}>
                        {formError && <div className="settings-modal__error">{formError}</div>}

                        {modalType === 'course' && (
                            <>
                                <div className="settings-modal__field">
                                    <label htmlFor="courseName" className="settings-modal__label">
                                        Course Name:
                                    </label>
                                    <input
                                        id="courseName"
                                        className="settings-modal__input"
                                        type="text"
                                        placeholder="e.g., Introduction to Computer Science"
                                        value={courseForm.course_name}
                                        onChange={(event) =>
                                            setCourseForm((prev) => ({
                                                ...prev,
                                                course_name: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="settings-modal__field">
                                    <label htmlFor="courseDepartment" className="settings-modal__label">
                                        Department:
                                    </label>
                                    <select
                                        id="courseDepartment"
                                        className="settings-modal__input"
                                        value={courseForm.department_id}
                                        onChange={(event) =>
                                            setCourseForm((prev) => ({
                                                ...prev,
                                                department_id: event.target.value,
                                            }))
                                        }
                                        required
                                    >
                                        <option value="">-- select department --</option>
                                        {departments.map((dept) => (
                                            <option key={dept.department_id} value={dept.department_id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {modalType === 'department' && (
                            <div className="settings-modal__field">
                                <label htmlFor="departmentName" className="settings-modal__label">
                                    Department Name:
                                </label>
                                <input
                                    id="departmentName"
                                    className="settings-modal__input"
                                    type="text"
                                    placeholder="e.g., Computer Studies Program"
                                    value={departmentForm.name}
                                    onChange={(event) =>
                                        setDepartmentForm({ name: event.target.value })
                                    }
                                    required
                                />
                            </div>
                        )}

                        {modalType === 'academicYear' && (
                            <div className="settings-modal__field">
                                <label htmlFor="academicYear" className="settings-modal__label">
                                    Academic Year:
                                </label>
                                <input
                                    id="academicYear"
                                    className="settings-modal__input"
                                    type="text"
                                    placeholder="e.g., 2025-2026"
                                    value={academicYearForm.school_year}
                                    onChange={(event) =>
                                        setAcademicYearForm({ school_year: event.target.value })
                                    }
                                    required
                                />
                            </div>
                        )}

                        <div className="settings-modal__actions">
                            <button type="submit" className="settings-modal__button" disabled={formLoading}>
                                {submitLabelMap[modalType]}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const closeSuccessModal = () => {
        setSuccessModalOpen(false);
        setSuccessMessage('');
    };

    const renderSuccessModal = () => {
        if (!successModalOpen) return null;

        return (
            <div className="settings-modal__overlay" onClick={closeSuccessModal}>
                <div
                    className="settings-modal settings-modal--success"
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        className="settings-modal__close"
                        aria-label="Close"
                        onClick={closeSuccessModal}
                    >
                        {icons.close}
                    </button>
                    <div className="settings-modal__success-icon">{icons.check}</div>
                    <h2 className="settings-modal__success-title">Success</h2>
                    <p className="settings-modal__success-message">
                        {successMessage || `New ${successEntity.toLowerCase()} is added.`}
                    </p>
                </div>
            </div>
        );
    };

    const currentConfig = tabConfig[activeTab];

    return (
        <div className="dashboard-layout settings-page">
            <SideBarMenu />

            <main className="settings-content">
                <header className="settings-header">
                    <h1 className="settings-title">Settings</h1>
                </header>

                <section className="settings-controls" aria-label="Settings controls">
                    <label className="settings-search" aria-label="Search">
                        <span className="settings-search__icon" aria-hidden="true">
                            {icons.search}
                        </span>
                        <input
                            type="search"
                            className="settings-search__input"
                            placeholder="Search"
                            aria-label="Search settings"
                        />
                    </label>

                    <div className="settings-button-group" role="group" aria-label="Settings actions">
                        <button
                            type="button"
                            className="settings-btn settings-btn--ghost"
                            onClick={handleArchiveNavigate}
                        >
                            <span className="settings-btn__icon" aria-hidden="true">
                                {icons.archive}
                            </span>
                            Archived
                        </button>
                        <button type="button" className="settings-btn settings-btn--primary" onClick={handleAddClick}>
                            <span className="settings-btn__icon" aria-hidden="true">
                                {icons.plus}
                            </span>
                            {currentConfig.addLabel}
                        </button>
                    </div>
                </section>

                <nav className="settings-tabs" aria-label="Settings categories">
                    {tabOrder.map((key) => {
                        const tab = tabConfig[key];
                        const isActive = key === activeTab;
                        return (
                            <button
                                type="button"
                                key={key}
                                className={`settings-tab${isActive ? ' settings-tab--active' : ''}`}
                                onClick={() => setActiveTab(key)}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                <section className="settings-table" aria-label={`${currentConfig.label} management`}>
                    <header
                        className="settings-table__header"
                        style={{ '--settings-columns': currentConfig.columns.length }}
                    >
                        {currentConfig.columns.map((column) => (
                            <span key={column.key}>{column.label}</span>
                        ))}
                    </header>

                    <div className="settings-table__body">
                        {listLoading ? (
                            <div className="settings-table__empty">Loading...</div>
                        ) : currentRows.length === 0 ? (
                            <div className="settings-table__empty">No data available</div>
                        ) : (
                            paginatedRows.map((row) => (
                                <div
                                    key={row.id}
                                    className="settings-table__row"
                                    style={{ '--settings-columns': currentConfig.columns.length }}
                                >
                                    {currentConfig.columns.map((column) => {
                                        if (column.type === 'actions') {
                                            return (
                                                <span key={column.key} className="settings-table__actions">
                                                    <button
                                                        type="button"
                                                        className="settings-chip settings-chip--outline"
                                                        onClick={() => openEditModal(activeTab, row)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="settings-chip settings-chip--ghost"
                                                        onClick={() => handleArchive(row.id)}
                                                    >
                                                        Archive
                                                    </button>
                                                </span>
                                            );
                                        }

                                        if (column.type === 'status') {
                                            return (
                                                <span key={column.key} className="settings-status settings-status--action">
                                                    {row[column.key]}
                                                </span>
                                            );
                                        }

                                        return <span key={column.key}>{row[column.key]}</span>;
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <footer className="settings-footer" aria-label="Pagination">
                    <button
                        type="button"
                        className="settings-pagination"
                        aria-label="Previous page"
                        onClick={() =>
                            setCurrentPage((previous) => ({
                                ...previous,
                                [activeTab]: Math.max(1, pageState - 1),
                            }))
                        }
                        disabled={pageState <= 1}
                    >
                        <span aria-hidden="true">{icons.chevronLeft}</span>
                    </button>
                    <span className="settings-page-indicator">
                        {pageState} / {totalPages}
                    </span>
                    <button
                        type="button"
                        className="settings-pagination"
                        aria-label="Next page"
                        onClick={() =>
                            setCurrentPage((previous) => ({
                                ...previous,
                                [activeTab]: Math.min(totalPages, pageState + 1),
                            }))
                        }
                        disabled={pageState >= totalPages}
                    >
                        <span aria-hidden="true">{icons.chevronRight}</span>
                    </button>
                </footer>

                {renderModal()}
                {renderSuccessModal()}
            </main>
        </div>
    );
}

export default SystemSettings;
