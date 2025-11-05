import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        try {
            // Attempt login - adjust field names if your backend expects 'email' instead of 'username'
            const payload = { username, password };
            const res = await axios.post('/login', payload);
            // on success, redirect to dashboard (server route)
            window.location.href = '/dashboard';
        } catch (err) {
            console.error('Login error', err);
            // show validation/server message if available
            const msg = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'Login failed. Please check credentials.';
            alert(msg);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h3 style={styles.title}>AcadLink</h3>
                <p style={styles.subtitle}>Father Saturnino Urios University</p>

                <form onSubmit={onSubmit} style={styles.form}>
                    <label style={styles.label}>Username</label>
                    <input
                        style={styles.input}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        required
                    />

                    <label style={styles.label}>Password</label>
                    <div style={styles.passwordWrap}>
                        <input
                            style={{ ...styles.input, paddingRight: 40 }}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eyeBtn}
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <button type="submit" style={styles.submit}>Log In</button>
                </form>

                <div style={styles.footer}>© AcadLink - Student Management Portal</div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#3b1760',
        padding: 20,
    },
    card: {
        width: 720,
        maxWidth: '95%',
        background: '#dcc7ff',
        padding: '48px 56px',
        borderRadius: 4,
        boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
        textAlign: 'center',
    },
    title: {
        margin: 0,
        color: '#31124a',
        fontSize: 28,
        fontWeight: 700,
    },
    subtitle: {
        marginTop: 6,
        marginBottom: 18,
        color: '#5b3a73',
        fontSize: 12,
    },
    form: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    label: {
        textAlign: 'left',
        fontSize: 12,
        color: '#4b2f66',
        margin: '10px 0 6px',
    },
    input: {
        height: 36,
        padding: '6px 10px',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.12)',
        outline: 'none',
        fontSize: 14,
    },
    passwordWrap: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    eyeBtn: {
        position: 'absolute',
        right: 6,
        top: 6,
        height: 24,
        width: 32,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 14,
    },
    submit: {
        marginTop: 18,
        height: 36,
        borderRadius: 18,
        border: 'none',
        background: '#3a1b56',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
    },
    footer: {
        marginTop: 18,
        color: '#6b4e88',
        fontSize: 11,
    },
};

export default Login;
