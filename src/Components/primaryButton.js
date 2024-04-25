import React from 'react';
import './primaryButton.css';
function PrimaryButton({buttonText}) {

    return(
        <div>
        <button id="pbtn">{buttonText}</button>
        </div>

    );
}
export default PrimaryButton;