import React from 'react';
import { FourSquare } from "react-loading-indicators";
import './FoursquareLoading.css'; // Import CSS file for styling

function FoursquareLoading() {
    return (
        <div className="loading-container"> {/* Wrapping div for styling */}
            <FourSquare color="rgba(231, 121, 43, 0.9)" size="medium" text="" textColor="black" />
            {/* <h1 className='Loadingtxt'>Loading..</h1> */}
        </div>
    );
}

export default FoursquareLoading;
