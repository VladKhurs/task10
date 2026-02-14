import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function LinkCustom({ to, children }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`nav-link ${isActive ? 'active' : ''}`}
        >
            {children}
        </Link>
    );
}