import React, { useMemo, useState } from 'react';
import SideBarMenu from './sidebarmenu';
import '../../sass/settings.scss';

const tabConfig = {
    course: {
        label: 'Course',
        addLabel: 'Add Courses',
        searchPlaceholder: 'Search courses',
        columns: [
            { key: 'code', label: 'Course Code' },
            { key: 'name', label: 'Course Name' },
            { key: 'department', label: 'Department' },
            { key: 'actions', label: 'Action', type: 'actions' },
        ],
        rows: [
            {
                id: 'course-1',
                code: 'BSIT',
                name: 'Bachelor of Science in Information Technology',
                department: 'Computer Studies Program',
            },
        ],
    },
    department: {
        label: 'Department',
        addLabel: 'Add Department',
        searchPlaceholder: 'Search departments',
        columns: [
            { key: 'code', label: 'Department Code' },
            { key: 'name', label: 'Department Name' },
            { key: 'head', label: 'Department Head' },
            { key: 'actions', label: 'Action', type: 'actions' },
        ],
        rows: [
            {
                id: 'dept-1',
                code: 'CSP',
                name: 'Computer Studies Program',
                head: 'Mr. Lamberto S. Bollogr',
            },
        ],
    },
    academicYear: {
        label: 'Academic Year',
        addLabel: 'Add Academic Year',
        searchPlaceholder: 'Search academic years',
        columns: [
            { key: 'year', label: 'Academic Year' },
            { key: 'startDate', label: 'Start Date' },
            { key: 'endDate', label: 'End Date' },
            { key: 'status', label: 'Status', type: 'status' },
            { key: 'actions', label: 'Action', type: 'actions' },
        ],
        rows: [
            {
                id: 'ay-1',
                year: '2025 - 2026',
                startDate: '8/15/2025',
                endDate: '6/15/2026',
                status: 'Activate',
            },
        ],
    },
};

const tabOrder = ['course', 'department', 'academicYear'];

function SystemSettings() {
    const [activeTab, setActiveTab] = useState(tabOrder[0]);
    const currentTab = tabConfig[activeTab];

    const emptyRows = useMemo(() => Array.from({ length: 3 }), []);

    return (
        <div className="dashboard-layout settings-page">
            <SideBarMenu />

            <main className="settings-content">
                <header className="settings-header">
                    <h1 className="settings-title">Settings</h1>
                </header>

                <section className="settings-controls" aria-label="Settings controls">
                    <div className="settings-search">
                        <span className="settings-search__icon" aria-hidden="true" role="presentation">🔍</span>
                        <input
                            type="search"
                            className="settings-search__input"
                            placeholder={currentTab.searchPlaceholder}
                            aria-label={currentTab.searchPlaceholder}
                        />
                    </div>

                    <div className="settings-button-group" role="group" aria-label="Settings actions">
                        <button type="button" className="settings-btn settings-btn--ghost">
                            <span aria-hidden="true" role="presentation">🗂</span> Archived
                        </button>
                        <button type="button" className="settings-btn settings-btn--primary">
                            <span aria-hidden="true" role="presentation">＋</span> {currentTab.addLabel}
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

                <section className="settings-table" aria-label={`${currentTab.label} management`}>
                    <header
                        className="settings-table__header"
                        style={{ '--settings-columns': currentTab.columns.length }}
                    >
                        {currentTab.columns.map((column) => (
                            <span key={column.key}>{column.label}</span>
                        ))}
                    </header>

                    <div className="settings-table__body">
                        {currentTab.rows.map((row) => (
                            <div
                                key={row.id}
                                className="settings-table__row"
                                style={{ '--settings-columns': currentTab.columns.length }}
                            >
                                {currentTab.columns.map((column) => {
                                    if (column.type === 'actions') {
                                        return (
                                            <span key={column.key} className="settings-table__actions">
                                                <button type="button" className="settings-chip settings-chip--outline">
                                                    Edit
                                                </button>
                                                <button type="button" className="settings-chip settings-chip--ghost">
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
                        ))}

                        {emptyRows.map((_, idx) => (
                            <div
                                key={`empty-${idx}`}
                                className="settings-table__row settings-table__row--empty"
                                style={{ '--settings-columns': currentTab.columns.length }}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                </section>

                <footer className="settings-footer" aria-label="Pagination">
                    <button type="button" className="settings-pagination" aria-label="Previous page">
                        ‹
                    </button>
                    <span className="settings-page-indicator">1 / 10</span>
                    <button type="button" className="settings-pagination" aria-label="Next page">
                        ›
                    </button>
                </footer>
            </main>
        </div>
    );
}

export default SystemSettings;
