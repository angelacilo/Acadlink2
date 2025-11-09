import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
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

const STORAGE_KEY = 'acadlink.admin';
const getStoredAdmin = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            return {
                username: parsed.username || '',
                email: parsed.email || '',
            };
        }
    } catch (error) {
        console.warn('Unable to read admin from session storage:', error);
    }
    return null;
};

const storeAdmin = (data) => {
    try {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                username: data.username || 'Admin User',
                email: data.email || 'admin@urusa.edu.ph',
            }),
        );
    } catch (error) {
        console.warn('Unable to store admin in session storage:', error);
    }
};

function SideBarMenu() {
    const storedAdmin = getStoredAdmin();
    const [admin, setAdmin] = useState(
        storedAdmin || {
            username: 'Admin User',
            email: 'admin@urusa.edu.ph',
        },
    );

    useEffect(() => {
        let isMounted = true;

        const loadAuthenticatedAdmin = async () => {
            try {
                const response = await axios.get('/api/auth/me');
                const profile = response.data?.data;

                if (isMounted && profile) {
                    const nextAdmin = {
                        username: profile.username || 'Admin User',
                        email: profile.email || 'admin@urusa.edu.ph',
                    };
                    setAdmin(nextAdmin);
                    storeAdmin(nextAdmin);
                }
            } catch (error) {
                console.error('Failed to load authenticated admin info:', error);
            }
        };

        const handleProfileUpdate = (event) => {
            const detail = event.detail || {};
            setAdmin((previous) => {
                const updated = {
                    username: detail.username || previous.username,
                    email: detail.email || previous.email,
                };
                storeAdmin(updated);
                return updated;
            });
        };

        loadAuthenticatedAdmin();
        window.addEventListener('adminProfileUpdated', handleProfileUpdate);

        return () => {
            isMounted = false;
            window.removeEventListener('adminProfileUpdated', handleProfileUpdate);
        };
    }, []);

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
                        <LuUserRound size={30} />
                    </div>
                    <div>
                        <p className="sidebar__user-name">{admin.username || 'Admin User'}</p>
                        <p className="sidebar__user-email">{admin.email || 'admin@urusa.edu.ph'}</p>
                    </div>
                </NavLink>
            </footer>
        </aside>
    );
}

export default SideBarMenu;
