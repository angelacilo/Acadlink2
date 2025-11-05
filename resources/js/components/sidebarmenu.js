import React from 'react';

const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', href: '/dashboard', active: true },
    { label: 'Faculty', icon: 'users', href: '/faculty' },
    { label: 'Student', icon: 'student', href: '/student' },
    { label: 'Reporting', icon: 'chart', href: '/reporting' },
    { label: 'Settings', icon: 'settings', href: '/settings' },
];

function SideBarMenu() {
    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <div className="sidebar__brand-icon" aria-hidden="true">A</div>
                <span className="sidebar__brand-text">AcadLink</span>
            </div>

            <nav className="sidebar__nav" aria-label="Primary">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className={`sidebar__nav-item${item.active ? ' sidebar__nav-item--active' : ''}`}
                    >
                        <span className={`sidebar__icon sidebar__icon--${item.icon}`} aria-hidden="true">
                            {item.label.charAt(0).toUpperCase()}
                        </span>
                        <span className="sidebar__label">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="sidebar__footer">
                <div className="sidebar__avatar" aria-hidden="true">AU</div>
                <div className="sidebar__user">
                    <p className="sidebar__user-name">Admin User</p>
                    <p className="sidebar__user-email">adm@fsuu.edu.ph</p>
                </div>
            </div>
        </aside>
    );
}

export default SideBarMenu;
