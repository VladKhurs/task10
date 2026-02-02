import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function LinkCustom({ to, children }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`mx-2 font-bold transition ${
                isActive ? 'text-accent' : 'text-gray-light hover:text-accent-hover'
            }`}
        >
            {children}
        </Link>
    );
}