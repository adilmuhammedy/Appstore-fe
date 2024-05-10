import React from 'react';
import './BigButton.css';
function BigButton({ buttonText }) {

    return (
        <div>
            <button className='bigbtn'>{buttonText}</button>
        </div>

    );
}
export default BigButton;