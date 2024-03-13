import React from 'react';
import './primaryButton.css';
function primaryButton({buttonText}) {

    return(
        <div>
        <button id="pbtn">{buttonText}</button>
        </div>

    );
}
export default primaryButton;