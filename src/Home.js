import React, { useState } from 'react';
import axios from 'axios'; 
import './Home.css';
import Navbar from './Components/Navbar';


function Home() {
    const [file, setFile] = useState(null);
  


    const handleUpload=()=>{
      window.location.href='./Upload';
    }

   

    return (
        <div className="home-container">
            <div style={{ display: 'flex' }}>
                <Navbar/>
            </div>
            <div id="upload-card">
                <h1 id="upload-apk">Upload APK</h1>
                <button id="upload-btn" onClick={handleUpload}>Upload</button>
         
            </div>
        </div>
    );
}

export default Home;
