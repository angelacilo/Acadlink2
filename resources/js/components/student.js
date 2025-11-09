import React, { useEffect, useMemo, useState } from 'react';
import {
    FiSearch,
    FiPlus,
    FiArchive,
    FiChevronLeft,
    FiChevronRight,
    FiCheck,
    FiX,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideBarMenu from './sidebarmenu';
import '../../sass/settings.scss';
import '../../sass/student.scss';

const statusPills = {
    continuing: 'student-status student-status--continuing',
    returnee: 'student-status student-status--returnee',
    dropped: 'student-status student-status--dropped',
};

const statusOptions = ['Continuing', 'Returnee', 'Dropped'];
const sexOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
];
const yearLevelOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const defaultFormState = {
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    status: 'Continuing',
    department_id: '',
    course_id: '',
    academic_year_id: '',
    year_level: '',
    sex: '',
    email_address: '',
    phone_number: '',
    date_of_birth: '',
    address: '',
};

export function Student() {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [courseFilter, setCourseFilter] = useState('all');

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(defaultFormState);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [listLoading, setListLoading] = useState(false);

    const navigate = useNavigate();

    const isEditing = editingStudentId !== null;

    const fetchStudents = async () => {
        setListLoading(true);
        try {
            const response = await fetch('/api/students?archived=0');
            const data = await response.json();
            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setListLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('/api/departments');
            const data = await response.json();
            setDepartments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            const data = await response.json();
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    };

    const fetchAcademicYears = async () => {
        try {
            const response = await fetch('/api/academic-years');
            const data = await response.json();
            setAcademicYears(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading academic years:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
        fetchCourses();
        fetchAcademicYears();
    }, []);

    useEffect(() => {
        if (departmentFilter === 'all') return;
        if (courseFilter === 'all') return;

        const matchingCourse = courses.find(
            (course) =>
                String(course.course_id) === String(courseFilter) &&
                String(course.department_id || '') === String(departmentFilter),
        );

        if (!matchingCourse) {
            setCourseFilter('all');
        }
    }, [departmentFilter, courseFilter, courses]);

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const matchesSearch = [
                student.full_name,
                student.first_name,
                student.last_name,
                student.course?.course_name,
                student.department?.name,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDepartment =
                departmentFilter === 'all' || String(student.department_id || '') === String(departmentFilter);

            const matchesCourse =
                courseFilter === 'all' || String(student.course_id || '') === String(courseFilter);

            return matchesSearch && matchesDepartment && matchesCourse;
        });
    }, [students, searchTerm, departmentFilter, courseFilter]);

    const openCreateForm = () => {
        setEditingStudentId(null);
        setForm(defaultFormState);
        setFormError('');
        setFormLoading(false);
        setSuccessModalOpen(false);
        setSuccessMessage('');
        setShowForm(true);
        fetchDepartments();
        fetchCourses();
        fetchAcademicYears();
    };

    const handleEdit = (studentId) => {
        const existing = students.find((student) => student.student_id === studentId);
        if (!existing) {
            return;
        }

        setEditingStudentId(studentId);
        setForm({
            first_name: existing.first_name || '',
            middle_name: existing.middle_name || '',
            last_name: existing.last_name || '',
            suffix: existing.suffix || '',
            status: existing.status || 'Continuing',
            department_id: existing.department_id ? String(existing.department_id) : '',
            course_id: existing.course_id ? String(existing.course_id) : '',
            academic_year_id: existing.academic_year_id ? String(existing.academic_year_id) : '',
            year_level: existing.year_level || '',
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
        fetchCourses();
        fetchAcademicYears();
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingStudentId(null);
        setForm(defaultFormState);
        setFormError('');
        setFormLoading(false);
        setSuccessModalOpen(false);
        setSuccessMessage('');
    };

    const handleChange = (field) => (event) => {
        const value = event.target.value;

        setForm((previous) => ({
            ...previous,
            [field]: value,
            ...(field === 'department_id' ? { course_id: '' } : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormLoading(true);
        setFormError('');

        const payload = {
            ...form,
            department_id: form.department_id ? Number(form.department_id) : null,
            course_id: form.course_id ? Number(form.course_id) : null,
            academic_year_id: form.academic_year_id ? Number(form.academic_year_id) : null,
            date_of_birth: form.date_of_birth || null,
            sex: form.sex || null,
            email_address: form.email_address || null,
            phone_number: form.phone_number || null,
            address: form.address || null,
        };

        const endpoint = isEditing ? `/api/students/${editingStudentId}` : '/api/students';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setForm(defaultFormState);
                setShowForm(false);
                setEditingStudentId(null);
                setSuccessMessage(isEditing ? 'Student details updated.' : 'New student is added.');
                setSuccessModalOpen(true);
                fetchStudents();
                fetchDepartments();
                fetchCourses();
                fetchAcademicYears();
            } else {
                const message = data.errors
                    ? Object.values(data.errors)
                          .flat()
                          .join(' ')
                    : data.message || 'Unable to save student.';
                setFormError(message);
            }
        } catch (error) {
            console.error('Error saving student:', error);
            setFormError('Something went wrong. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleArchive = async (studentId) => {
        if (!studentId) return;
        const confirmArchive = window.confirm('Are you sure you want to archive this student?');
        if (!confirmArchive) return;

        try {
            const response = await fetch(`/api/students/${studentId}/archive`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                fetchStudents();
                setSuccessMessage('Student archived.');
                setSuccessModalOpen(true);
            }
        } catch (error) {
            console.error('Error archiving student:', error);
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
        <main className="student-form-screen">
            <div className="student-form-screen__heading">
                <h1>{isEditing ? 'Edit Student' : 'Add New Student'}</h1>
                <p>
                    {isEditing
                        ? 'Update the information below and save your changes.'
                        : 'Enter student details to add them to the system.'}
                </p>
            </div>

            <form className="student-form" onSubmit={handleSubmit}>
                {formError && <div className="settings-modal__error">{formError}</div>}

                <div className="student-form__grid">
                    <label className="student-form__field">
                        <span className="student-form__label">First Name</span>
                        <input className="student-form__input" value={form.first_name} onChange={handleChange('first_name')} required />
                    </label>
                    <label className="student-form__field">
                        <span className="student-form__label">Middle Name</span>
                        <input className="student-form__input" value={form.middle_name} onChange={handleChange('middle_name')} />
                    </label>
                    <label className="student-form__field">
                        <span className="student-form__label">Last Name</span>
                        <input className="student-form__input" value={form.last_name} onChange={handleChange('last_name')} required />
                    </label>
                    <label className="student-form__field">
                        <span className="student-form__label">Suffix</span>
                        <input className="student-form__input" value={form.suffix} onChange={handleChange('suffix')} />
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Status</span>
                        <select className="student-form__input" value={form.status} onChange={handleChange('status')}>
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Department</span>
                        <select className="student-form__input" value={form.department_id} onChange={handleChange('department_id')}>
                            <option value="">Select department</option>
                            {departments.map((dept) => (
                                <option key={dept.department_id} value={dept.department_id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Course</span>
                        <select className="student-form__input" value={form.course_id} onChange={handleChange('course_id')}>
                            <option value="">Select course</option>
                            {courses
                                .filter((course) => {
                                    if (!form.department_id) return true;
                                    return String(course.department_id || '') === String(form.department_id);
                                })
                                .map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.course_name || course.name}
                                    </option>
                                ))}
                        </select>
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Academic Year</span>
                        <select
                            className="student-form__input"
                            value={form.academic_year_id}
                            onChange={handleChange('academic_year_id')}
                        >
                            <option value="">Select academic year</option>
                            {academicYears.map((ay) => (
                                <option key={ay.academic_year_id} value={ay.academic_year_id}>
                                    {ay.school_year}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Year Level</span>
                        <select
                            className="student-form__input"
                            value={form.year_level}
                            onChange={handleChange('year_level')}
                        >
                            <option value="">Select year level</option>
                            {yearLevelOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Sex</span>
                        <select className="student-form__input" value={form.sex} onChange={handleChange('sex')}>
                            <option value="">Select sex</option>
                            {sexOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Email Address</span>
                        <input
                            type="email"
                            className="student-form__input"
                            value={form.email_address}
                            onChange={handleChange('email_address')}
                        />
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Phone Number</span>
                        <input
                            className="student-form__input"
                            value={form.phone_number}
                            onChange={handleChange('phone_number')}
                            placeholder="e.g., 09XXXXXXXXX"
                        />
                    </label>

                    <label className="student-form__field">
                        <span className="student-form__label">Date of Birth</span>
                        <input
                            type="date"
                            className="student-form__input"
                            value={form.date_of_birth}
                            onChange={handleChange('date_of_birth')}
                        />
                    </label>
                </div>

                <label className="student-form__field student-form__field--full">
                    <span className="student-form__label">Address</span>
                    <textarea
                        className="student-form__input student-form__input--textarea"
                        value={form.address}
                        onChange={handleChange('address')}
                        rows={3}
                    />
                </label>

                <div className="student-form__actions">
                    <button type="button" className="student-form__cancel" onClick={closeForm} disabled={formLoading}>
                        Cancel
                    </button>
                    <button type="submit" className="student-form__submit" disabled={formLoading}>
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
                    <h1 className="settings-title">Student</h1>
                    <p className="settings-subtitle">Father Saturnino Urios University - Student Records</p>
                </div>
            </header>

            <section className="settings-controls" aria-label="Student controls">
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

                <div className="settings-button-group" role="group" aria-label="Student filters">
                    <button
                        type="button"
                        className="settings-btn settings-btn--ghost"
                        onClick={() => navigate('/archive?entity=student')}
                    >
                        <span className="settings-btn__icon" aria-hidden="true">
                            <FiArchive size={18} />
                        </span>
                        Archived List
                    </button>

                    <select
                        className="settings-btn settings-btn--ghost"
                        value={courseFilter}
                        onChange={(event) => setCourseFilter(event.target.value)}
                        aria-label="Filter by course"
                    >
                        <option value="all">All Courses</option>
                        {courses
                            .filter((course) => {
                                if (departmentFilter === 'all') return true;
                                return String(course.department_id || '') === String(departmentFilter);
                            })
                            .map((course) => (
                                <option key={course.course_id} value={course.course_id}>
                                    {course.course_name || course.name}
                                </option>
                            ))}
                    </select>

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
                        Add Students
                    </button>
                </div>
            </section>

            <section className="settings-table" aria-label="Student list">
                <header className="settings-table__header" style={{ '--settings-columns': 4 }}>
                    <span>Student</span>
                    <span>Department Name</span>
                    <span>Status</span>
                    <span>Action</span>
                </header>

                <div className="settings-table__body">
                    {listLoading ? (
                        <div className="settings-table__empty">Loading...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="settings-table__empty">No student found</div>
                    ) : (
                        filteredStudents.map((student) => (
                            <div
                                key={student.student_id}
                                className="settings-table__row"
                                style={{ '--settings-columns': 4 }}
                            >
                                <span>{student.full_name || `${student.first_name} ${student.last_name}`}</span>
                                <span>{student.department?.name || '—'}</span>
                                <span
                                    className={
                                        statusPills[(student.status || '').toLowerCase()] ||
                                        'student-status student-status--continuing'
                                    }
                                >
                                    {student.status || 'Continuing'}
                                </span>
                                <span className="settings-table__actions">
                                    <button
                                        type="button"
                                        className="settings-chip settings-chip--outline"
                                        onClick={() => handleEdit(student.student_id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="settings-chip settings-chip--ghost"
                                        onClick={() => handleArchive(student.student_id)}
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
                <button type="button" className="settings-pagination" aria-label="Previous page">
                    <FiChevronLeft size={16} />
                </button>
                <span className="settings-page-indicator">1 / 1</span>
                <button type="button" className="settings-pagination" aria-label="Next page">
                    <FiChevronRight size={16} />
                </button>
            </footer>
        </main>
    );

    return (
        <div className="dashboard-layout student-page">
            <SideBarMenu />
            {showForm ? renderFormView() : renderListView()}
            {renderSuccessModal()}
        </div>
    );
}

export default Student;
