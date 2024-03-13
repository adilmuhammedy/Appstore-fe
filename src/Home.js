import React, { useState } from 'react';
import './Home.css';
import Navbar from './Components/Navbar';
import Secbtn from './Components/secButton';

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
                <div id="upload-btn" onClick={handleUpload}>
                    <Secbtn buttonText={"Upload"}></Secbtn>
                </div>
         
            </div>
        </div>
    );
}

export default Home;
