import React from 'react';

export default function Input({ register, name, options, placeholder, type = 'text', className = '' }) {
    return (
        <input
            {...register(name, options)}
            type={type}
            placeholder={placeholder}
            className={`input-field ${className}`}
        />
    );
}