import React from 'react';

export default function Button({ children, onClick, className = '', type = 'button', disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-theme text-white px-4 py-2 rounded hover:bg-theme-hover transition disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}