import React from 'react';
import './Inputfield.css';

function Input({ inputType, value, onChange }) {
    // Convert the value to a string if it's not already a string
    const displayValue = typeof value !== 'string' ? String(value) : value;

    return (
        <div className="input-container">
            <label htmlFor={inputType} id="inputtxt">{inputType}:</label>
            <input type={inputType} id="inputfield" value={displayValue} onChange={onChange} />
        </div>
    );
}

export default Input;
