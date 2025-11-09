import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiCheck, FiX } from 'react-icons/fi';
import { LuUserRound } from 'react-icons/lu';
import SideBarMenu from './sidebarmenu';
import '../../sass/profile.scss';
import '../../sass/settings.scss';

const ADMIN_ID = 1;

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`/api/admins/${ADMIN_ID}`);
            if (response.data?.success) {
                const data = response.data.data;
                setProfile(data);
                setForm((prev) => ({
                    ...prev,
                    username: data.username || '',
                    email: data.email || '',
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                }));
            } else {
                setError(response.data?.message || 'Unable to load profile information.');
            }
        } catch (err) {
            setError('Unable to load profile information.');
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formattedCreatedAt = useMemo(() => {
        if (!profile?.created_at) return '';
        const date = new Date(profile.created_at);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    }, [profile?.created_at]);

    const handleEditToggle = () => {
        setSuccessMessage('');
        setSuccessModalOpen(false);
        setError('');
        setEditing(true);
        setForm((prev) => ({
            ...prev,
            username: profile?.username || '',
            email: profile?.email || '',
            current_password: '',
            password: '',
            password_confirmation: '',
        }));
    };

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleCancel = () => {
        setEditing(false);
        setSuccessMessage('');
        setSuccessModalOpen(false);
        setForm((prev) => ({
            ...prev,
            current_password: '',
            password: '',
            password_confirmation: '',
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const payload = {
                username: form.username,
                email: form.email,
            };

            if (form.password) {
                payload.current_password = form.current_password;
                payload.password = form.password;
                payload.password_confirmation = form.password_confirmation;
            }

            const response = await axios.put(`/api/admins/${ADMIN_ID}`, payload);

            if (response.data?.success) {
                setSuccessMessage('Profile updated successfully.');
                setSuccessModalOpen(true);
                window.dispatchEvent(
                    new CustomEvent('adminProfileUpdated', {
                        detail: {
                            username: response.data?.data?.username || form.username,
                            email: response.data?.data?.email || form.email,
                        },
                    }),
                );
                setEditing(false);
                await fetchProfile();
            } else {
                const message = response.data?.message || 'Unable to update profile.';
                setError(message);
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                const messages = Object.values(err.response.data.errors)
                    .flat()
                    .join(' ');
                setError(messages || 'Unable to update profile.');
            } else {
                setError('Unable to update profile.');
            }
            console.error('Profile update error:', err);
        } finally {
            setSaving(false);
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
                    <h2 className="settings-modal__success-title">Success</h2>
                    <p className="settings-modal__success-message">
                        {successMessage || 'Profile updated successfully.'}
                    </p>
                </div>
            </div>
        );
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            window.location.href = '/';
        }
    };

    return (
        <div className="profile-layout profile-page">
            <SideBarMenu />
            <main className="profile-content" aria-label="Profile details">
                <header className="profile-header">
                    <div>
                        <h1 className="profile-title">My Profile</h1>
                        <p className="profile-subtitle">Manage your profile information and system settings.</p>
                    </div>
                    <button type="button" className="profile-button profile-button--outline" onClick={handleLogout}>
                        Log Out
                    </button>
                </header>

                <section className="profile-banner" aria-hidden="true" />

                {loading ? (
                    <div className="profile-card" aria-live="polite">
                        <p>Loading profile...</p>
                    </div>
                ) : error && !editing && !profile ? (
                    <div className="profile-card" aria-live="assertive">
                        <p className="profile-alert profile-alert--error">{error}</p>
                    </div>
                ) : (
                    <section className="profile-card" aria-label="Profile overview">
                        <div className="profile-card__header">
                            <span className="profile-avatar">
                                <LuUserRound size={56} aria-hidden="true" />
                            </span>
                            <div>
                                <p className="profile-name">{profile?.name || 'Admin User'}</p>
                            </div>
                        </div>

                        {editing ? (
                            <section className="profile-edit" aria-label="Edit profile">
                                <h3>Edit Profile</h3>
                                {error && (
                                    <div className="profile-alert profile-alert--error" aria-live="assertive">
                                        {error}
                                    </div>
                                )}
                                <form className="profile-form" onSubmit={handleSubmit}>
                                    <label className="profile-field">
                                        <span>username:</span>
                                        <input
                                            type="text"
                                            value={form.username}
                                            onChange={handleChange('username')}
                                            required
                                        />
                                    </label>
                                    <label className="profile-field">
                                        <span>email address:</span>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange('email')}
                                            required
                                        />
                                    </label>
                                    <label className="profile-field">
                                        <span>current password:</span>
                                        <input
                                            type="password"
                                            value={form.current_password}
                                            onChange={handleChange('current_password')}
                                            placeholder="••••••"
                                        />
                                    </label>
                                    <label className="profile-field">
                                        <span>new password:</span>
                                        <input
                                            type="password"
                                            value={form.password}
                                            onChange={handleChange('password')}
                                            placeholder="••••••"
                                        />
                                    </label>
                                    <label className="profile-field">
                                        <span>confirm password:</span>
                                        <input
                                            type="password"
                                            value={form.password_confirmation}
                                            onChange={handleChange('password_confirmation')}
                                            placeholder="••••••"
                                        />
                                    </label>
                                    <div className="profile-actions profile-actions--form">
                                        <button
                                            type="button"
                                            className="profile-button profile-button--muted"
                                            onClick={handleCancel}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="profile-button profile-button--success"
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        ) : (
                            <div className="profile-section" aria-label="Intro information">
                                <h3>INTRO</h3>
                                {error && (
                                    <div className="profile-alert profile-alert--error" aria-live="assertive">
                                        {error}
                                    </div>
                                )}
                                <div className="profile-info">
                                    <span>
                                        <strong>username:</strong> {profile?.username || '—'}
                                    </span>
                                    <span>
                                        <strong>email:</strong> {profile?.email || '—'}
                                    </span>
                                    <span>
                                        <strong>role:</strong> admin
                                    </span>
                                    <span className="profile-info__highlight">
                                        {formattedCreatedAt ? `Created at ${formattedCreatedAt}` : ''}
                                    </span>
                                </div>
                                <div className="profile-actions">
                                    <button type="button" className="profile-button" onClick={handleEditToggle}>
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </main>
            {renderSuccessModal()}
        </div>
    );
}

export default Profile;
