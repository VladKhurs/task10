import React from 'react';

export default function X({ onClick, className = '' }) {
    return (
        <button 
            onClick={onClick} 
            className={`close-btn ${className}`}
        >
            &#10005;
        </button>
    );
}