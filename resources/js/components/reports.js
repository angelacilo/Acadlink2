import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FiChevronLeft,
    FiChevronRight,
    FiDownload,
    FiFilter,
    FiRefreshCw,
} from 'react-icons/fi';
import SideBarMenu from './sidebarmenu';
import '../../sass/report.scss';

const TAB_CONFIG = {
    student: {
        label: 'Student Reports',
        columns: [
            { key: 'studentNumber', label: 'Student ID' },
            { key: 'name', label: 'Student' },
            { key: 'course', label: 'Course' },
            { key: 'yearLevel', label: 'Year' },
            { key: 'status', label: 'Status', type: 'status' },
        ],
    },
    faculty: {
        label: 'Faculty Reports',
        columns: [
            { key: 'facultyNumber', label: 'Faculty ID' },
            { key: 'name', label: 'Name' },
            { key: 'department', label: 'Department Name' },
            { key: 'status', label: 'Status', type: 'status' },
        ],
    },
};

const statusClassMap = {
    active: 'report-status report-status--active',
    continuing: 'report-status report-status--active',
    'on leave': 'report-status report-status--leave',
    leave: 'report-status report-status--leave',
    inactive: 'report-status report-status--inactive',
    archived: 'report-status report-status--inactive',
};

function Reports() {
    const [activeTab, setActiveTab] = useState('student');
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);

    const [courseFilter, setCourseFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [generatedRows, setGeneratedRows] = useState({ student: [], faculty: [] });
    const [isGenerated, setIsGenerated] = useState({ student: false, faculty: false });
    const [errorMessage, setErrorMessage] = useState('');

    const resetFilters = () => {
        setCourseFilter('all');
        setDepartmentFilter('all');
    };

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [courseRes, departmentRes] = await Promise.all([
                    axios.get('/api/courses'),
                    axios.get('/api/departments'),
                ]);

                const courseData = Array.isArray(courseRes.data?.data) ? courseRes.data.data : courseRes.data;
                const departmentData = Array.isArray(departmentRes.data?.data) ? departmentRes.data.data : departmentRes.data;

                setCourses(Array.isArray(courseData) ? courseData : []);
                setDepartments(Array.isArray(departmentData) ? departmentData : []);
            } catch (error) {
                console.error('Error loading report filters:', error);
            }
        };

        loadFilters();
    }, []);

    useEffect(() => {
        if (activeTab === 'student') {
            setCourseFilter('all');
            setIsGenerated((previous) => ({ ...previous, student: false }));
            setGeneratedRows((previous) => ({ ...previous, student: [] }));
        } else {
            setDepartmentFilter('all');
            setIsGenerated((previous) => ({ ...previous, faculty: false }));
            setGeneratedRows((previous) => ({ ...previous, faculty: [] }));
        }
        setErrorMessage('');
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'student') {
            setIsGenerated((previous) => ({ ...previous, student: false }));
            setGeneratedRows((previous) => ({ ...previous, student: [] }));
            setErrorMessage('');
        }
    }, [courseFilter, activeTab]);

    useEffect(() => {
        if (activeTab === 'faculty') {
            setIsGenerated((previous) => ({ ...previous, faculty: false }));
            setGeneratedRows((previous) => ({ ...previous, faculty: [] }));
            setErrorMessage('');
        }
    }, [departmentFilter, activeTab]);

    const displayedRows = isGenerated[activeTab] ? generatedRows[activeTab] : [];

    const currentColumns = TAB_CONFIG[activeTab].columns;

    const renderStatus = (value) => {
        if (!value) return '—';
        const key = value.toLowerCase();
        const className = statusClassMap[key] || 'report-status';
        return <span className={className}>{value}</span>;
    };

    const handleExportReport = () => {
        const rows = displayedRows;
        if (!rows.length) {
            window.alert('No data available to export.');
            return;
        }

        const csvColumns = currentColumns.map((column) => column.label);
        const csvRows = rows.map((row) =>
            currentColumns
                .map((column) => {
                    const value = row[column.key];
                    if (value == null) return '';
                    if (typeof value === 'string') {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(','),
        );

        const csvContent = [csvColumns.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${activeTab}-report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleGenerateReport = async () => {
        setErrorMessage('');
        setGeneratedRows((previous) => ({ ...previous, [activeTab]: [] }));
        setIsGenerated((previous) => ({ ...previous, [activeTab]: false }));
        setTableLoading(true);

        try {
            const endpoint = activeTab === 'student' ? '/api/reports/students' : '/api/reports/faculties';
            const params = {};

            if (activeTab === 'student' && courseFilter !== 'all') {
                params.course_id = courseFilter;
            }

            if (activeTab === 'faculty' && departmentFilter !== 'all') {
                params.department_id = departmentFilter;
            }

            const response = await axios.get(endpoint, { params });
            const data = response.data || {};

            if (!(response.status >= 200 && response.status < 300)) {
                throw new Error(data.message || 'Unable to generate report.');
            }

            const rows = Array.isArray(data.data) ? data.data : [];
            setGeneratedRows((previous) => ({ ...previous, [activeTab]: rows }));
            setIsGenerated((previous) => ({ ...previous, [activeTab]: true }));
        } catch (error) {
            console.error('Error generating report:', error);
            setGeneratedRows((previous) => ({ ...previous, [activeTab]: [] }));
            setIsGenerated((previous) => ({ ...previous, [activeTab]: false }));
            setErrorMessage(error.message || 'Unable to generate report. Please try again.');
        } finally {
            setTableLoading(false);
        }
    };

    return (
        <div className="dashboard-layout report-page">
            <SideBarMenu />
            <main className="report-content">
                <header className="report-header">
                    <div>
                        <h1 className="report-title">Report</h1>
                        <p className="report-subtitle">Generate report for student and faculty.</p>
                    </div>
                </header>

                <nav className="report-tabs" aria-label="Report type">
                    {Object.entries(TAB_CONFIG).map(([key, tab]) => {
                        const isActive = key === activeTab;
                        return (
                            <button
                                key={key}
                                type="button"
                                className={`report-tab${isActive ? ' report-tab--active' : ''}`}
                                onClick={() => setActiveTab(key)}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                <section className="report-toolbar" aria-label="Report filters">
                    <div className="report-toolbar__filters">
                        <span className="report-toolbar__icon" aria-hidden="true">
                            <FiFilter size={18} />
                        </span>

                        {activeTab === 'student' && (
                            <select
                                className="report-select"
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

                        {activeTab === 'faculty' && (
                            <select
                                className="report-select"
                                value={departmentFilter}
                                onChange={(event) => setDepartmentFilter(event.target.value)}
                                aria-label="Filter faculty by department"
                            >
                                <option value="all">All Departments</option>
                                {departments.map((department) => (
                                    <option key={department.department_id} value={department.department_id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="report-toolbar__actions">
                        <button
                            type="button"
                            className="report-btn report-btn--ghost"
                            onClick={handleGenerateReport}
                        >
                            <span className="report-btn__icon" aria-hidden="true">
                                <FiRefreshCw size={16} />
                            </span>
                            Generate Report
                        </button>

                        <button
                            type="button"
                            className="report-btn report-btn--primary"
                            onClick={handleExportReport}
                        >
                            <span className="report-btn__icon" aria-hidden="true">
                                <FiDownload size={16} />
                            </span>
                            Export Report
                        </button>
                    </div>
                </section>

                <section className="report-table" aria-label="Report results">
                    <header
                        className="report-table__header"
                        style={{ '--report-columns': currentColumns.length }}
                    >
                        {currentColumns.map((column) => (
                            <span key={column.key}>{column.label}</span>
                        ))}
                    </header>

                    <div className="report-table__body">
                        {tableLoading ? (
                            <div className="report-table__empty">Loading...</div>
                        ) : errorMessage ? (
                            <div className="report-table__empty">{errorMessage}</div>
                        ) : !isGenerated[activeTab] ? (
                            <div className="report-table__empty">Select filters and click Generate Report.</div>
                        ) : displayedRows.length === 0 ? (
                            <div className="report-table__empty">No records found for the selected filters.</div>
                        ) : (
                            displayedRows.map((row) => (
                                <div
                                    key={row.id}
                                    className="report-table__row"
                                    style={{ '--report-columns': currentColumns.length }}
                                >
                                    {currentColumns.map((column) => {
                                        const value = row[column.key];
                                        if (column.type === 'status') {
                                            return <span key={column.key}>{renderStatus(value)}</span>;
                                        }
                                        return <span key={column.key}>{value || '—'}</span>;
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <footer className="report-footer" aria-label="Pagination">
                    <button type="button" className="report-pagination" aria-label="Previous page">
                        <FiChevronLeft size={16} />
                    </button>
                    <span className="report-page-indicator">1 / 1</span>
                    <button type="button" className="report-pagination" aria-label="Next page">
                        <FiChevronRight size={16} />
                    </button>
                </footer>
            </main>
        </div>
    );
}

export default Reports;
