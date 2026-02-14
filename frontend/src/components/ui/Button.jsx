import React from 'react';

export default function Button({ children, onClick, className = '', type = 'button', disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn ${className}`}
        >
            {children}
        </button>
    );
}