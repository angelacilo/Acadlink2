import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiPlus, FiArchive, FiChevronLeft, FiChevronRight, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideBarMenu from './sidebarmenu';
import '../../sass/settings.scss';
import '../../sass/faculties.scss';

const statusColors = {
    active: 'faculty-status faculty-status--active',
    'on leave': 'faculty-status faculty-status--leave',
    inactive: 'faculty-status faculty-status--inactive',
};

const positionOptions = ['Part-time', 'Dean', 'Instructor', 'Department Head'];
const statusOptions = ['Active', 'On Leave', 'Inactive'];
const sexOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
];

const defaultFormState = {
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    department_id: '',
    position: '',
    status: 'Active',
    sex: '',
    email_address: '',
    phone_number: '',
    date_of_birth: '',
    address: '',
};

export function Faculties() {
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(defaultFormState);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [editingFacultyId, setEditingFacultyId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    const fetchFaculties = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/faculties');
            const facultyData = Array.isArray(response.data?.data) ? response.data.data : response.data;
            setFaculties(Array.isArray(facultyData) ? facultyData : []);
        } catch (error) {
            console.error('Error loading faculties:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/api/departments');
            const departmentData = Array.isArray(response.data?.data) ? response.data.data : response.data;
            setDepartments(Array.isArray(departmentData) ? departmentData : []);
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    };

    useEffect(() => {
        fetchFaculties();
        fetchDepartments();
    }, []);

    const isEditing = editingFacultyId !== null;

    const filteredFaculties = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return faculties.filter((faculty) => {
            const matchesSearch = [
                faculty.full_name,
                faculty.first_name,
                faculty.last_name,
                faculty.position,
                faculty.department?.name,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(normalizedSearch));

            const matchesDepartment =
                departmentFilter === 'all' ||
                String(faculty.department_id || '') === String(departmentFilter);

            return matchesSearch && matchesDepartment;
        });
    }, [faculties, searchTerm, departmentFilter]);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredFaculties.length / 20)), [filteredFaculties.length]);

    const paginatedFaculties = useMemo(() => {
        const startIndex = (currentPage - 1) * 20;
        return filteredFaculties.slice(startIndex, startIndex + 20);
    }, [filteredFaculties, currentPage]);

    const openCreateForm = () => {
        setEditingFacultyId(null);
        setForm(defaultFormState);
        setFormError('');
        setFormLoading(false);
        setShowForm(true);
        setSuccessModalOpen(false);
        setSuccessMessage('');
        fetchDepartments();
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, departmentFilter]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleEdit = (facultyId) => {
        const existing = faculties.find((faculty) => faculty.faculty_id === facultyId);
        if (!existing) {
            return;
        }

        setEditingFacultyId(facultyId);
        setForm({
            first_name: existing.first_name || '',
            middle_name: existing.middle_name || '',
            last_name: existing.last_name || '',
            suffix: existing.suffix || '',
            department_id: existing.department_id ? String(existing.department_id) : '',
            position: existing.position || '',
            status: existing.status || 'Active',
            sex: existing.sex || '',
            email_address: existing.email_address || '',
            phone_number: existing.phone_number || '',
            date_of_birth: existing.date_of_birth ? String(existing.date_of_birth).slice(0, 10) : '',
            address: existing.address || '',
        });
        setFormError('');
        setFormLoading(false);
        setSuccessModalOpen(false);
        setSuccessMessage('');
        setShowForm(true);
        fetchDepartments();
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingFacultyId(null);
        setForm(defaultFormState);
        setFormError('');
        setFormLoading(false);
        setSuccessModalOpen(false);
        setSuccessMessage('');
    };

    const handleChange = (field) => (event) => {
        setForm((previous) => ({
            ...previous,
            [field]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormLoading(true);
        setFormError('');

        const payload = {
            ...form,
            department_id: form.department_id ? Number(form.department_id) : null,
            date_of_birth: form.date_of_birth || null,
            sex: form.sex || null,
            email_address: form.email_address || null,
            phone_number: form.phone_number || null,
            address: form.address || null,
        };

        const endpoint = isEditing ? `/api/faculties/${editingFacultyId}` : '/api/faculties';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await axios({
                url: endpoint,
                method,
                data: payload,
            });

            const data = response.data || {};

            if ((response.status >= 200 && response.status < 300) && data.success) {
                setForm(defaultFormState);
                setShowForm(false);
                setEditingFacultyId(null);
                setSuccessMessage(isEditing ? 'Faculty details updated.' : 'New faculty is added.');
                setSuccessModalOpen(true);
                fetchFaculties();
                fetchDepartments();
            } else {
                const message = data.errors
                    ? Object.values(data.errors)
                          .flat()
                          .join(' ')
                    : data.message || 'Unable to add faculty.';
                setFormError(message);
            }
        } catch (error) {
            console.error('Error creating faculty:', error);
            setFormError('Something went wrong. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleArchive = async (id) => {
        if (!id) return;
        const confirmed = window.confirm('Are you sure you want to archive this faculty?');
        if (!confirmed) return;

        try {
            const response = await axios.post(`/api/faculties/${id}/archive`);

            const data = response.data || {};

            if ((response.status >= 200 && response.status < 300) && data.success) {
                fetchFaculties();
            }
        } catch (error) {
            console.error('Error archiving faculty:', error);
        }
    };

    const closeSuccessModal = () => {
        setSuccessModalOpen(false);
        setSuccessMessage('');
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
                    <h2 className="settings-modal__success-title">Successfully</h2>
                    <p className="settings-modal__success-message">{successMessage || 'Action completed.'}</p>
                </div>
            </div>
        );
    };

    const renderFormView = () => (
        <main className="faculty-form-screen">
            <div className="faculty-form-screen__heading">
                <h1>{isEditing ? 'Edit Faculty' : 'Add New Faculty'}</h1>
                <p>{isEditing ? 'Update the information below and save your changes.' : 'Enter faculty details to add them to the system.'}</p>
            </div>

            <form className="faculty-form" onSubmit={handleSubmit}>
                {formError && <div className="settings-modal__error">{formError}</div>}

                <div className="faculty-form__grid">
                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Position</span>
                        <select
                            className="faculty-form__input"
                            value={form.position}
                            onChange={handleChange('position')}
                            required
                        >
                            <option value="">Select position</option>
                            {positionOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Status</span>
                        <select className="faculty-form__input" value={form.status} onChange={handleChange('status')}>
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Department</span>
                        <select
                            className="faculty-form__input"
                            value={form.department_id}
                            onChange={handleChange('department_id')}
                        >
                            <option value="">Select department</option>
                            {departments.map((dept) => (
                                <option key={dept.department_id} value={dept.department_id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">First Name</span>
                        <input
                            className="faculty-form__input"
                            value={form.first_name}
                            onChange={handleChange('first_name')}
                            required
                        />
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Middle Name</span>
                        <input
                            className="faculty-form__input"
                            value={form.middle_name}
                            onChange={handleChange('middle_name')}
                        />
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Last Name</span>
                        <input
                            className="faculty-form__input"
                            value={form.last_name}
                            onChange={handleChange('last_name')}
                            required
                        />
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Suffix</span>
                        <input
                            className="faculty-form__input"
                            value={form.suffix}
                            onChange={handleChange('suffix')}
                        />
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Sex</span>
                        <select className="faculty-form__input" value={form.sex} onChange={handleChange('sex')}>
                            <option value="">Select sex</option>
                            {sexOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Email Address</span>
                        <input
                            type="email"
                            className="faculty-form__input"
                            value={form.email_address}
                            onChange={handleChange('email_address')}
                        />
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Phone Number</span>
                        <input
                            className="faculty-form__input"
                            value={form.phone_number}
                            onChange={handleChange('phone_number')}
                            placeholder="e.g., 09XXXXXXXXX"
                        />
                    </label>

                    <label className="faculty-form__field">
                        <span className="faculty-form__label">Date of Birth</span>
                        <input
                            type="date"
                            className="faculty-form__input"
                            value={form.date_of_birth}
                            onChange={handleChange('date_of_birth')}
                        />
                    </label>
                </div>

                <label className="faculty-form__field faculty-form__field--full">
                    <span className="faculty-form__label">Address</span>
                    <textarea
                        className="faculty-form__input faculty-form__input--textarea"
                        value={form.address}
                        onChange={handleChange('address')}
                        rows={3}
                    />
                </label>

                <div className="faculty-form__actions">
                    <button
                        type="button"
                        className="faculty-form__cancel"
                        onClick={closeForm}
                        disabled={formLoading}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="faculty-form__submit" disabled={formLoading}>
                        {formLoading ? 'Saving...' : isEditing ? 'Update' : 'Submit'}
                    </button>
                </div>
            </form>
        </main>
    );

    const renderListView = () => (
        <main className="settings-content">
            <header className="settings-header">
                <div>
                    <h1 className="settings-title">Faculty</h1>
                    <p className="settings-subtitle">Manage faculty records and information</p>
                </div>
            </header>

            <section className="settings-controls" aria-label="Faculty controls">
                <label className="settings-search" aria-label="Search">
                    <span className="settings-search__icon" aria-hidden="true">
                        <FiSearch size={20} />
                    </span>
                    <input
                        type="search"
                        className="settings-search__input"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </label>

                <div className="settings-button-group" role="group" aria-label="Faculty actions">
                    <button
                        type="button"
                        className="settings-btn settings-btn--ghost"
                        onClick={() => navigate('/archive?entity=faculty')}
                    >
                        <span className="settings-btn__icon" aria-hidden="true">
                            <FiArchive size={18} />
                        </span>
                        Archived List
                    </button>

                    <select
                        className="settings-btn settings-btn--ghost"
                        value={departmentFilter}
                        onChange={(event) => setDepartmentFilter(event.target.value)}
                        aria-label="Filter by department"
                    >
                        <option value="all">All Department</option>
                        {departments.map((dept) => (
                            <option key={dept.department_id} value={dept.department_id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="settings-btn settings-btn--primary"
                        onClick={openCreateForm}
                    >
                        <span className="settings-btn__icon" aria-hidden="true">
                            <FiPlus size={18} />
                        </span>
                        Add Faculty
                    </button>
                </div>
            </section>

            <section className="settings-table" aria-label="Faculty list">
                <header className="settings-table__header" style={{ '--settings-columns': 4 }}>
                    <span>Faculty</span>
                    <span>Department Name</span>
                    <span>Status</span>
                    <span>Action</span>
                </header>

                <div className="settings-table__body">
                    {loading ? (
                        <div className="settings-table__empty">Loading...</div>
                    ) : paginatedFaculties.length === 0 ? (
                        <div className="settings-table__empty">No faculty found</div>
                    ) : (
                        paginatedFaculties.map((faculty) => (
                            <div
                                key={faculty.faculty_id}
                                className="settings-table__row"
                                style={{ '--settings-columns': 4 }}
                            >
                                <span>{faculty.full_name || `${faculty.first_name} ${faculty.last_name}`}</span>
                                <span>{faculty.department?.name || '—'}</span>
                                <span
                                    className={
                                        statusColors[(faculty.status || 'active').toLowerCase()] ||
                                        'faculty-status faculty-status--active'
                                    }
                                >
                                    {faculty.status || 'Active'}
                                </span>
                                <span className="settings-table__actions">
                                    <button
                                        type="button"
                                        className="settings-chip settings-chip--outline"
                                        onClick={() => handleEdit(faculty.faculty_id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="settings-chip settings-chip--ghost"
                                        onClick={() => handleArchive(faculty.faculty_id)}
                                    >
                                        Archive
                                    </button>
                                </span>
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
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage <= 1}
                >
                    <FiChevronLeft size={16} />
                </button>
                <span className="settings-page-indicator">
                    {currentPage} / {totalPages}
                </span>
                <button
                    type="button"
                    className="settings-pagination"
                    aria-label="Next page"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage >= totalPages}
                >
                    <FiChevronRight size={16} />
                </button>
            </footer>
        </main>
    );

    return (
        <div className="dashboard-layout faculty-page">
            <SideBarMenu />
            {showForm ? renderFormView() : renderListView()}
            {renderSuccessModal()}
        </div>
    );
}

export default Faculties;
