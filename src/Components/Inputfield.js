import React from 'react';

function Input({ label, inputType, value, onChange }) {
    // Convert the value to a string if it's not already a string
    const displayValue = typeof value !== 'string' ? String(value) : value;

    return (
        <div id="inputContainer" >
            <label  id="inputtxt">{label}</label>
            <br></br>
            <input 
                type={inputType} 
                id="inputfield" 
                value={displayValue} 
                onChange={onChange} 
                className="w-56 px-3 py-1 border border-gray-300 rounded mt-2 "
                required 
            />
        </div>
    );
}

export default Input;
