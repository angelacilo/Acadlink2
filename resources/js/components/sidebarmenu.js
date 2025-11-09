import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LuTrendingUp,
    LuUsers,
    LuUserRound,
    LuClock3,
    LuSettings,
    LuLogOut,
} from 'react-icons/lu';

const icons = {
    dashboard: <LuTrendingUp size={20} aria-hidden="true" />,
    users: <LuUsers size={20} aria-hidden="true" />,
    student: <LuUserRound size={20} aria-hidden="true" />,
    reporting: <LuClock3 size={20} aria-hidden="true" />,
    settings: <LuSettings size={20} aria-hidden="true" />,
};
const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', href: '/dashboard', end: true },
    { label: 'Faculty', icon: 'users', href: '/faculty' },
    { label: 'Student', icon: 'student', href: '/student' },
    { label: 'Reporting', icon: 'reporting', href: '/reporting' },
    { label: 'Settings', icon: 'settings', href: '/settings' },
];

function SideBarMenu() {
    return (
        <aside className="sidebar">
            <div className="sidebar__brand" aria-label="Application brand">
                <div className="sidebar__brand-icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32" role="presentation" aria-hidden="true">
                        <path
                            d="M25.5 11.3 16 6 6.5 11.3v2.8l9.5 5.4 9.5-5.4v-2.8Zm-9.5 7.8-7-4v3l7 4 7-4v-3l-7 4Zm4 4.6-4 2.3-4-2.3v2.5l4 2.3 4-2.3v-2.5Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
                <div>
                    <span className="sidebar__brand-text">AcadLink</span>
                </div>
            </div>

            <nav className="sidebar__nav" aria-label="Primary">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.href}
                        end={item.end}
                        className={({ isActive }) =>
                            `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
                        }
                    >
                        <span className="sidebar__icon" aria-hidden="true">
                            {icons[item.icon]}
                        </span>
                        <span className="sidebar__label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <footer className="sidebar__footer">
                <NavLink to="/profile" className="sidebar__user" aria-label="View profile">
                    <div className="sidebar__avatar" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
                            <path
                                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.3 0-6 2-6 4.4V21h12v-2.6c0-2.4-2.7-4.4-6-4.4Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="sidebar__user-name">Admin User</p>
                        <p className="sidebar__user-email">admin@urusa.edu.ph</p>
                    </div>
                </NavLink>
            </footer>
        </aside>
    );
}

export default SideBarMenu;
