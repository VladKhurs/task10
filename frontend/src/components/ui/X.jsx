import React from 'react';

export default function X({ onClick, className = '' }) {
    return (
        <button onClick={onClick} className={`font-bold text-gray-500 hover:text-red-500 ${className}`}>
            &#10005;
        </button>
    );
}