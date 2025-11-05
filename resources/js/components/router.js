import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Routes as RouterRoutes,
    Route,
    Navigate,
} from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';
import SystemSettings from './system-settings';

function AppRoutes() {
    return (
        <Router>
            <RouterRoutes>
                {/* public */}
                <Route path="/" element={<Login />} />

                {/* protected area */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<SystemSettings />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </RouterRoutes>
        </Router>
    );
}

export default AppRoutes;

const appElement = document.getElementById('login-root') || document.getElementById('app');
if (appElement) {
    // React 17 compatible mounting
    ReactDOM.render(<AppRoutes />, appElement);
}