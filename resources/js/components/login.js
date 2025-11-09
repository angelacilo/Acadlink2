import React, { useState } from 'react';
import axios from 'axios';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';
import '../../sass/login.scss';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function onSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const payload = { username, password };
            await axios.post('/api/auth/login', payload);
            window.location.href = '/dashboard';
        } catch (err) {
            console.error('Login error', err);
            if (err.response?.data?.errors) {
                const messages = Object.values(err.response.data.errors)
                    .flat()
                    .join(' ');
                setError(messages || 'Login failed. Please check credentials.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please check credentials.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-page">
            <header className="login-page__header" aria-hidden="true">
            
            </header>
            <div className="login-page__content">
                <div className="login-page__logo" aria-hidden="true">
                    <LuGraduationCap size={56} color="#3e1c83" />
                </div>
                <h1 className="login-page__brand">AcadLink</h1>
                <p className="login-page__tagline">Father Saturnino Urios University</p>

                <form onSubmit={onSubmit} className="login-form">
                    {error ? (
                        <div className="login-form__error" role="alert">
                            {error}
                        </div>
                    ) : null}

                    <label htmlFor="username" className="sr-only">
                        Username
                    </label>
                    <div className="login-input">
                        <FiMail className="login-input__icon" aria-hidden="true" />
                        <input
                            id="username"
                            className="login-input__field"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="username"
                            required
                        />
                    </div>

                    <label htmlFor="password" className="sr-only">
                        Password
                    </label>
                    <div className="login-input">
                        <FiLock className="login-input__icon" aria-hidden="true" />
                        <input
                            id="password"
                            className="login-input__field"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((previous) => !previous)}
                            className="login-input__toggle"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>

                    <button type="submit" className="login-form__submit" disabled={submitting}>
                        {submitting ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="login-page__helper">
                    Don&apos;t have an account?{' '}
                    <a href="#" className="login-page__helper-link">
                        Create Account
                    </a>
                </p>
            </div>

            <footer className="login-page__footer">
                © {new Date().getFullYear()} AcadLink - Father Saturnino Urios University Academic Management Portal
            </footer>
        </div>
    );
}

export default Login;
