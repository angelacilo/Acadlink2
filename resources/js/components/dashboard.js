import React, { useEffect, useMemo, useState } from 'react';
import SideBarMenu from './sidebarmenu';
import '../../sass/dashboard.scss';

const FACULTY_COLORS = [
    '#7B64FF',
    '#9156F4',
    '#36C4E8',
    '#FF9631',
    '#4E5DEE',
    '#38C987',
    '#FF5E7A',
    '#F6B142',
    '#B07EFF',
    '#1F9FFF',
];

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [studentRes, facultyRes, departmentRes, courseRes] = await Promise.all([
                    fetch('/api/students'),
                    fetch('/api/faculties'),
                    fetch('/api/departments'),
                    fetch('/api/courses'),
                ]);

                const [studentData, facultyData, departmentData, courseData] = await Promise.all([
                    studentRes.json(),
                    facultyRes.json(),
                    departmentRes.json(),
                    courseRes.json(),
                ]);

                setStudents(Array.isArray(studentData) ? studentData : []);
                setFaculties(Array.isArray(facultyData) ? facultyData : []);
                setDepartments(Array.isArray(departmentData) ? departmentData : []);
                setCourses(Array.isArray(courseData) ? courseData : []);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const statCards = useMemo(
        () => [
            { label: 'Total Students', value: students.length },
            { label: 'Total Faculty', value: faculties.length },
            { label: 'Departments', value: departments.length },
            { label: 'Courses', value: courses.length },
        ],
        [students.length, faculties.length, departments.length, courses.length],
    );

    const STOP_WORDS = useMemo(() => new Set(['and', 'or', 'of', 'in', 'the', 'for', 'a', 'an', '&']), []);

    const toAcronym = (name) => {
        if (!name || typeof name !== 'string') return 'N/A';
        const trimmed = name.replace(/\s+/g, ' ').trim();
        if (!trimmed) return 'N/A';

        const letters = trimmed
            .split(' ')
            .filter(Boolean)
            .filter((word) => !STOP_WORDS.has(word.toLowerCase()));

        const acronym = letters
            .map((word) => word[0])
            .join('')
            .toUpperCase();

        if (acronym.length >= 2) {
            return acronym;
        }

        const initials = (trimmed.match(/\b[A-Z]/g) || []).join('');
        if (initials.length >= 2) {
            return initials.toUpperCase();
        }

        return trimmed
            .slice(0, 3)
            .toUpperCase();
    };

    const topCourses = useMemo(() => {
        if (!students.length) return [];

        const counts = new Map();
        students.forEach((student) => {
            const courseName =
                student.course?.course_name || student.course?.name || student.course_name || 'Unassigned';
            counts.set(courseName, (counts.get(courseName) || 0) + 1);
        });

        const sorted = Array.from(counts.entries())
            .map(([course, value]) => ({ course: course.trim(), value }))
            .sort((a, b) => b.value - a.value || a.course.localeCompare(b.course));

        return sorted.slice(0, 5).map((item) => {
            const display = toAcronym(item.course);
            return {
                ...item,
                display,
            };
        });
    }, [students, STOP_WORDS]);

    const maxCourseValue = useMemo(() => {
        return topCourses.reduce((max, item) => Math.max(max, item.value), 0);
    }, [topCourses]);

    const computeNiceNumber = (value, round) => {
        if (value <= 0) return 0;
        const exponent = Math.floor(Math.log10(value));
        const fraction = value / 10 ** exponent;
        let niceFraction;
        if (round) {
            if (fraction < 1.5) niceFraction = 1;
            else if (fraction < 3) niceFraction = 2;
            else if (fraction < 7) niceFraction = 5;
            else niceFraction = 10;
        } else if (fraction <= 1) niceFraction = 1;
        else if (fraction <= 2) niceFraction = 2;
        else if (fraction <= 5) niceFraction = 5;
        else niceFraction = 10;

        return niceFraction * 10 ** exponent;
    };

    const courseScaleMax = useMemo(() => {
        const rawMax = Math.max(maxCourseValue, 1);
        const niceMax = computeNiceNumber(rawMax, true);
        return Math.max(10, niceMax);
    }, [maxCourseValue]);

    const courseScaleStep = useMemo(() => {
        const desiredTicks = 5;
        const rawStep = courseScaleMax / (desiredTicks - 1);
        const niceStep = computeNiceNumber(rawStep, false);
        return Math.max(1, niceStep);
    }, [courseScaleMax]);

    const courseTicks = useMemo(() => {
        const ticks = [];
        for (let value = 0; value <= courseScaleMax + courseScaleStep / 2; value += courseScaleStep) {
            ticks.push(Math.round(value));
        }
        if (ticks[ticks.length - 1] !== courseScaleMax) {
            ticks[ticks.length - 1] = courseScaleMax;
        }
        return ticks;
    }, [courseScaleMax, courseScaleStep]);

    const facultyByDepartment = useMemo(() => {
        if (!faculties.length) return [];

        const counts = new Map();
        faculties.forEach((faculty) => {
            const departmentName =
                faculty.department?.name || faculty.department_name || 'Unassigned Department';
            counts.set(departmentName, (counts.get(departmentName) || 0) + 1);
        });

        const sorted = Array.from(counts.entries())
            .map(([department, value]) => ({ department, value }))
            .sort((a, b) => b.value - a.value || a.department.localeCompare(b.department));

        return sorted.map((item, index) => ({
            ...item,
            color: FACULTY_COLORS[index % FACULTY_COLORS.length],
        }));
    }, [faculties]);

    const facultyRingGradient = useMemo(() => {
        const total = facultyByDepartment.reduce((sum, item) => sum + item.value, 0);
        if (!total) {
            return 'rgba(126, 140, 255, 0.25) 0deg 360deg';
        }

        let currentAngle = 0;
        return facultyByDepartment
            .map((item) => {
                const start = currentAngle;
                const sweep = (item.value / total) * 360;
                currentAngle += sweep;
                const end = currentAngle;
                return `${item.color} ${start}deg ${end}deg`;
            })
            .join(', ');
    }, [facultyByDepartment]);

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
                            <span className="stat-card__value">{card.value.toLocaleString()}</span>
                        </div>
                    ))}
                </section>

                <section className="dashboard-panels" aria-label="Institution performance">
                    <article className="panel">
                        <header className="panel__header">Number of Students per Course</header>
                        <div className="panel__body panel__body--bars">
                            {loading ? (
                                <p className="panel__placeholder">Loading data...</p>
                            ) : topCourses.length === 0 ? (
                                <p className="panel__placeholder">No student data available yet.</p>
                            ) : (
                                <>
                                    <ul className="panel-bars">
                                        {topCourses.map((item) => (
                                            <li key={item.course} className="panel-bars__item">
                                                <span className="panel-bars__label" title={item.course}>
                                                    {item.display}
                                                </span>
                                                <div className="panel-bars__bar" role="presentation">
                                                    <span
                                                        className="panel-bars__fill"
                                                        style={{ width: `${(Math.min(item.value, courseScaleMax) / courseScaleMax) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="panel-bars__value">{item.value.toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="panel-bars__scale" aria-hidden="true">
                                        {courseTicks.map((tick) => (
                                            <span key={tick}>{tick.toLocaleString()}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </article>

                    <article className="panel">
                        <header className="panel__header">Number of Faculty per Department</header>
                        <div className="panel__body panel__body--ring">
                            {loading ? (
                                <p className="panel__placeholder">Loading data...</p>
                            ) : facultyByDepartment.length === 0 ? (
                                <p className="panel__placeholder">No faculty data available yet.</p>
                            ) : (
                                <>
                                    <div
                                        className="panel-ring"
                                        role="presentation"
                                        style={{ background: `conic-gradient(${facultyRingGradient})` }}
                                    >
                                        <span className="panel-ring__center">Faculty</span>
                                    </div>

                                    <ul className="panel-legend">
                                        {facultyByDepartment.map((item) => (
                                            <li key={item.department} className="panel-legend__item">
                                                <span
                                                    className="panel-legend__swatch"
                                                    style={{ backgroundColor: item.color }}
                                                    aria-hidden="true"
                                                />
                                                <span className="panel-legend__label">
                                                    {item.department} ({item.value.toLocaleString()})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
