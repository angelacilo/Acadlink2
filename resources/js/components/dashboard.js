import React from 'react';
import SideBarMenu from './sidebarmenu';
import '../../sass/dashboard.scss';

const statCards = [
    { label: 'Total Students', value: '2,158' },
    { label: 'Total Faculty', value: '55' },
    { label: 'Department', value: '8' },
    { label: 'Courses', value: '67' },
];

const courseMetrics = [
    { course: 'IT (279)', value: 260 },
    { course: 'BSN (117)', value: 190 },
    { course: 'BSEM (92)', value: 90 },
    { course: 'BSCRIM (80)', value: 150 },
    { course: 'HCI (36)', value: 30 },
];

const facultyMetrics = [
    { department: 'Teacher Education Program', color: 'teal' },
    { department: 'Business Education Program', color: 'blue' },
    { department: 'BMMP Science Program', color: 'orange' },
    { department: 'Computer Studies Program', color: 'purple' },
    { department: 'Criminal Justice Education Program', color: 'green' },
    { department: 'Tourism and Hospitality Program', color: 'pink' },
];

function Dashboard() {
    return (
        <div className="dashboard-layout">
            <SideBarMenu />

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <p className="dashboard-greeting">Welcome Back, Admin</p>
                        <p className="dashboard-subtitle">
                            Here’s what’s happening in your academic institution today
                        </p>
                    </div>
                </header>

                <section className="dashboard-stats" aria-label="Key metrics">
                    {statCards.map((card) => (
                        <div className="stat-card" key={card.label}>
                            <span className="stat-card__label">{card.label}</span>
                            <span className="stat-card__value">{card.value}</span>
                        </div>
                    ))}
                </section>

                <section className="dashboard-panels" aria-label="Institution performance">
                    <article className="panel">
                        <header className="panel__header">Number of Students per Course</header>
                        <div className="panel__body">
                            <ul className="panel-bars">
                                {courseMetrics.map((item) => (
                                    <li key={item.course} className="panel-bars__item">
                                        <span className="panel-bars__label">{item.course}</span>
                                        <div className="panel-bars__bar">
                                            <span
                                                className="panel-bars__fill"
                                                style={{ width: `${item.value / 2.8}%` }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>

                    <article className="panel">
                        <header className="panel__header">Number of Faculty per Department</header>
                        <div className="panel__body panel__body--ring">
                            <div className="panel-ring" role="presentation">
                                {facultyMetrics.map((item) => (
                                    <span
                                        key={item.department}
                                        className={`panel-ring__segment panel-ring__segment--${item.color}`}
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>

                            <ul className="panel-legend">
                                {facultyMetrics.map((item) => (
                                    <li key={item.department} className="panel-legend__item">
                                        <span className={`panel-legend__swatch panel-legend__swatch--${item.color}`} />
                                        <span className="panel-legend__label">{item.department}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
