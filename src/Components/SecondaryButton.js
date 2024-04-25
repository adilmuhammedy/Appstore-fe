import React from 'react';
import './secButton.css';
function SecondaryButton({buttonText}) {

    return(
        <div>
        <button id="secbtn">{buttonText}</button>
        </div>

    );
}
export default SecondaryButton;