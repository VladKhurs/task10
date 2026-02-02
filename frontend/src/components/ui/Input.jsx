import React from 'react';

export default function Input({ register, name, options, placeholder, type = 'text', className = '' }) {
    return (
        <input
            {...register(name, options)}
            type={type}
            placeholder={placeholder}
            className={`border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-theme ${className}`}
        />
    );
}