import React from 'react';
import './secButton.css';
function secButton({buttonText}) {

    return(
        <div>
        <button id="secbtn">{buttonText}</button>
        </div>

    );
}
export default secButton;